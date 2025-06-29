
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

interface RevenueDetails {
  monthly_revenue: number;
  annual_monthly_revenue: number;
  total_monthly_revenue: number;
  monthly_count: number;
  annual_count: number;
}

interface CreateUserResponse {
  success?: boolean;
  error?: string;
  user_id?: string;
  message?: string;
}

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenueDetails, setRevenueDetails] = useState<RevenueDetails | null>(null);
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
      loadRevenueDetails();
      checkExpiredSubscriptions();
      // Refresh stats every 30 seconds
      const interval = setInterval(() => {
        loadDashboardStats();
        loadRevenueDetails();
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
      
      // Usar a função get_admin_dashboard_stats que já filtra usuários excluídos
      const { data: statsData, error } = await supabase.rpc('get_admin_dashboard_stats');

      if (error) {
        console.error('Error loading dashboard stats:', error);
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

      if (statsData && Array.isArray(statsData) && statsData.length > 0) {
        const stats = statsData[0];
        console.log('Dashboard stats loaded:', stats);
        setStats({
          online_users: stats.online_users || 1,
          total_users: stats.total_users || 0,
          free_users: stats.free_users || 0,
          monthly_users: stats.monthly_users || 0,
          annual_users: stats.annual_users || 0,
          projected_monthly_revenue: stats.projected_monthly_revenue || 0,
        });
      } else {
        setStats({
          online_users: 1,
          total_users: 0,
          free_users: 0,
          monthly_users: 0,
          annual_users: 0,
          projected_monthly_revenue: 0,
        });
      }

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar estatísticas.",
        variant: "destructive",
      });
    }
  };

  const loadRevenueDetails = async () => {
    try {
      console.log('Loading revenue details...');
      
      // Consulta direta para calcular os valores reais da receita
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('plan_type, monthly_amount, annual_amount, exclude_from_revenue, stripe_customer_id')
        .not('stripe_customer_id', 'is', null)
        .neq('stripe_customer_id', '')
        .eq('exclude_from_revenue', false);

      if (profilesError) {
        console.error('Error loading revenue details:', profilesError);
        setRevenueDetails({
          monthly_revenue: 0,
          annual_monthly_revenue: 0,
          total_monthly_revenue: 0,
          monthly_count: 0,
          annual_count: 0,
        });
        return;
      }

      if (profilesData) {
        const monthlyUsers = profilesData.filter(user => user.plan_type === 'monthly');
        const annualUsers = profilesData.filter(user => user.plan_type === 'annual');
        
        const monthlyRevenue = monthlyUsers.reduce((sum, user) => sum + (user.monthly_amount || 47.00), 0);
        const annualMonthlyRevenue = annualUsers.reduce((sum, user) => sum + ((user.annual_amount || 397.00) / 12), 0);
        
        const details = {
          monthly_revenue: monthlyRevenue,
          annual_monthly_revenue: annualMonthlyRevenue,
          total_monthly_revenue: monthlyRevenue + annualMonthlyRevenue,
          monthly_count: monthlyUsers.length,
          annual_count: annualUsers.length,
        };
        
        console.log('Revenue details loaded:', details);
        setRevenueDetails(details);
      } else {
        setRevenueDetails({
          monthly_revenue: 0,
          annual_monthly_revenue: 0,
          total_monthly_revenue: 0,
          monthly_count: 0,
          annual_count: 0,
        });
      }

    } catch (error) {
      console.error('Error loading revenue details:', error);
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
    revenueDetails,
    loading,
    isAdmin,
    logout,
    createUser,
    refreshStats: () => {
      loadDashboardStats();
      loadRevenueDetails();
    }
  };
};
