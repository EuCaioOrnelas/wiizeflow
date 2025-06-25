
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AdminStats {
  online_users: number;
  total_users: number;
  free_users: number;
  monthly_users: number;
  annual_users: number;
  projected_monthly_revenue: number;
}

interface CreateUserResponse {
  success?: boolean;
  error?: string;
  user_id?: string;
  message?: string;
}

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardStats();
      checkExpiredSubscriptions();
      // Refresh stats every 30 seconds
      const interval = setInterval(() => {
        loadDashboardStats();
        checkExpiredSubscriptions();
      }, 30000);
      return () => clearInterval(interval);
    } else if (loading === false && !isAdmin) {
      navigate('/admin-auth');
    }
  }, [isAdmin, loading, navigate]);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found');
        setLoading(false);
        navigate('/admin-auth');
        return;
      }

      console.log('Checking admin status for user:', user.email);

      if (user.email === 'adminwiize@wiizeflow.com.br') {
        console.log('Admin user detected by email');
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      const { data: adminCheck, error } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Admin check result:', adminCheck, 'Error:', error);

      if (error) {
        console.error('Error checking admin status:', error);
        if (user.email === 'adminwiize@wiizeflow.com.br') {
          setIsAdmin(true);
          setLoading(false);
          return;
        }
      }

      setIsAdmin(!!adminCheck);
      setLoading(false);

      if (!adminCheck && user.email !== 'adminwiize@wiizeflow.com.br') {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar esta área.",
          variant: "destructive",
        });
        navigate('/admin-auth');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'adminwiize@wiizeflow.com.br') {
        setIsAdmin(true);
      }
      
      setLoading(false);
      
      if (!user || user.email !== 'adminwiize@wiizeflow.com.br') {
        navigate('/admin-auth');
      }
    }
  };

  const checkExpiredSubscriptions = async () => {
    try {
      console.log('Checking expired subscriptions...');
      const { data, error } = await supabase.rpc('check_expired_subscriptions');
      
      if (error) {
        console.error('Error checking expired subscriptions:', error);
      } else if (data > 0) {
        console.log(`Updated ${data} expired subscriptions to free plan`);
      }
    } catch (error) {
      console.error('Error checking expired subscriptions:', error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      console.log('Loading dashboard stats...');
      
      // Carregar todos os perfis diretamente
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, plan_type, subscription_status, subscription_expires_at, created_at');

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        return;
      }

      console.log('Loaded profiles:', profiles?.length, 'profiles');

      if (!profiles) {
        console.log('No profiles found');
        setStats({
          online_users: 0,
          total_users: 0,
          free_users: 0,
          monthly_users: 0,
          annual_users: 0,
          projected_monthly_revenue: 0,
        });
        return;
      }

      // Calcular usuários online (simulação - considerar usuários criados nas últimas 24h como ativos)
      const now = new Date();
      const onlineUsers = profiles.filter(p => {
        const created = new Date(p.created_at);
        const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
        return diffHours <= 24;
      }).length;

      // Filtrar apenas usuários com assinaturas ativas ou que não expiraram
      const activeProfiles = profiles.filter(p => {
        if (p.plan_type === 'free') return true;
        if (p.subscription_status !== 'active' && p.subscription_status !== 'pending_activation') return false;
        if (p.subscription_expires_at) {
          return new Date(p.subscription_expires_at) > now;
        }
        return true;
      });

      const totalUsers = profiles.length;
      const freeUsers = profiles.filter(p => p.plan_type === 'free').length;
      const monthlyUsers = activeProfiles.filter(p => p.plan_type === 'monthly').length;
      const annualUsers = activeProfiles.filter(p => p.plan_type === 'annual').length;
      
      // Novos valores: Mensal R$ 47,00 e Anual R$ 397,00 (33,08/mês)
      const projectedRevenue = (monthlyUsers * 47.00) + (annualUsers * (397.00 / 12));

      console.log('Calculated stats:', {
        totalUsers,
        freeUsers,
        monthlyUsers,
        annualUsers,
        projectedRevenue,
        onlineUsers
      });

      setStats({
        online_users: onlineUsers,
        total_users: totalUsers,
        free_users: freeUsers,
        monthly_users: monthlyUsers,
        annual_users: annualUsers,
        projected_monthly_revenue: projectedRevenue,
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar estatísticas.",
        variant: "destructive",
      });
    }
  };

  const createUser = async (email: string, password: string, name: string, planType: string, subscriptionPeriod: string) => {
    try {
      const { data, error } = await supabase.rpc('create_admin_user', {
        user_email: email,
        user_password: password,
        user_name: name,
        plan_type: planType,
        subscription_period: subscriptionPeriod
      });

      if (error) {
        throw error;
      }

      // Type guard para verificar se data é um objeto com a propriedade error
      const response = data as CreateUserResponse;

      if (response?.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso!",
        variant: "default",
      });

      // Recarregar estatísticas
      loadDashboardStats();

      return { success: true };
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-auth');
  };

  return {
    stats,
    loading,
    isAdmin,
    logout,
    createUser,
    refreshStats: loadDashboardStats
  };
};
