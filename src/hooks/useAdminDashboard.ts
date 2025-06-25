
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
      syncExistingUsers();
      // Refresh stats every 30 seconds
      const interval = setInterval(() => {
        loadDashboardStats();
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

      // Verificar primeiro se é o email admin
      if (user.email === 'adminwiize@wiizeflow.com.br') {
        console.log('Admin user detected by email');
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Verificar na tabela admin_users
      const { data: adminCheck, error } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Admin check result:', adminCheck, 'Error:', error);

      if (error && user.email !== 'adminwiize@wiizeflow.com.br') {
        console.error('Error checking admin status:', error);
        setLoading(false);
        navigate('/admin-auth');
        return;
      }

      setIsAdmin(!!adminCheck || user.email === 'adminwiize@wiizeflow.com.br');
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

  const syncExistingUsers = async () => {
    try {
      console.log('Syncing existing users...');
      const { data, error } = await supabase.rpc('sync_existing_users');
      
      if (error) {
        console.error('Error syncing existing users:', error);
      } else if (data > 0) {
        console.log(`Synced ${data} existing users to profiles table`);
      }
    } catch (error) {
      console.error('Error syncing existing users:', error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      console.log('Loading dashboard stats...');

      // Buscar todos os perfis
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, plan_type, subscription_status, subscription_expires_at, created_at');

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados dos usuários.",
          variant: "destructive",
        });
        return;
      }

      console.log('Profiles loaded:', profiles?.length || 0);

      // Buscar sessões ativas (últimos 15 minutos)
      const { data: activeSessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gt('last_activity', new Date(Date.now() - 15 * 60 * 1000).toISOString());

      if (sessionsError) {
        console.error('Error loading sessions:', sessionsError);
      }

      const onlineUsers = activeSessions?.length || 0;
      const allProfiles = profiles || [];
      const totalUsers = allProfiles.length;

      // Filtrar usuários por plano
      const freeUsers = allProfiles.filter(p => p.plan_type === 'free').length;
      const monthlyUsers = allProfiles.filter(p => p.plan_type === 'monthly').length;
      const annualUsers = allProfiles.filter(p => p.plan_type === 'annual').length;
      
      // Calcular receita projetada (R$ 47,00 mensal e R$ 397,00 anual)
      const projectedRevenue = (monthlyUsers * 47.00) + (annualUsers * (397.00 / 12));

      const statsData = {
        online_users: onlineUsers,
        total_users: totalUsers,
        free_users: freeUsers,
        monthly_users: monthlyUsers,
        annual_users: annualUsers,
        projected_monthly_revenue: projectedRevenue,
      };

      console.log('Dashboard stats calculated:', statsData);
      setStats(statsData);

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
