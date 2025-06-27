
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
      
      // Sincronizar usuários existentes do auth para profiles
      await supabase.rpc('sync_existing_users');
      
      // Carregar todos os profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('plan_type, subscription_status, subscription_expires_at, created_at');

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        setStats({
          online_users: 1,
          total_users: 0,
          free_users: 0,
          monthly_users: 0,
          annual_users: 0,
          projected_monthly_revenue: 0,
        });
        return;
      }

      console.log('Loaded profiles:', profiles);

      // Contar usuários online (considerando atividade nos últimos 15 minutos)
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('last_activity', new Date(Date.now() - 15 * 60 * 1000).toISOString());

      const onlineUsers = sessionsError ? 1 : Math.max((sessions?.length || 0), 1);

      // Filtrar apenas usuários com assinaturas ativas ou que não expiraram
      const activeProfiles = profiles?.filter(p => {
        if (p.plan_type === 'free') return true;
        if (p.subscription_status && p.subscription_status !== 'active') {
          // Se status não é ativo, verificar se não expirou ainda
          if (p.subscription_expires_at) {
            return new Date(p.subscription_expires_at) > new Date();
          }
          return false;
        }
        if (p.subscription_expires_at) {
          return new Date(p.subscription_expires_at) > new Date();
        }
        return true;
      }) || [];

      const totalUsers = profiles?.length || 0;
      const freeUsers = activeProfiles.filter(p => p.plan_type === 'free').length;
      const monthlyUsers = activeProfiles.filter(p => p.plan_type === 'monthly').length;
      const annualUsers = activeProfiles.filter(p => p.plan_type === 'annual').length;
      
      // Calcular receita projetada: Mensal R$ 47,00 e Anual R$ 397,00 (33,08/mês)
      const projectedRevenue = (monthlyUsers * 47.00) + (annualUsers * (397.00 / 12));

      const newStats = {
        online_users: onlineUsers,
        total_users: totalUsers,
        free_users: freeUsers,
        monthly_users: monthlyUsers,
        annual_users: annualUsers,
        projected_monthly_revenue: projectedRevenue,
      };

      console.log('Calculated stats:', newStats);
      setStats(newStats);

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
      console.log('Creating user with params:', { email, name, planType, subscriptionPeriod });

      // Primeiro, tentar criar o usuário no auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name: name,
          full_name: name
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Falha ao criar usuário');
      }

      // Calcular data de expiração
      let expiresAt = null;
      if (planType !== 'free') {
        const now = new Date();
        if (subscriptionPeriod === 'monthly') {
          expiresAt = new Date(now.setMonth(now.getMonth() + 1));
        } else if (subscriptionPeriod === 'annual') {
          expiresAt = new Date(now.setFullYear(now.getFullYear() + 1));
        }
      }

      // Atualizar o perfil com as informações do plano
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: name,
          plan_type: planType,
          subscription_status: planType === 'free' ? 'active' : 'active',
          subscription_expires_at: expiresAt?.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
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
