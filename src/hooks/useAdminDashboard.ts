
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Interface para definir a estrutura das estatísticas do dashboard administrativo
interface AdminStats {
  online_users: number;      // Usuários online nos últimos 15 minutos
  total_users: number;       // Total de usuários registrados
  free_users: number;        // Usuários no plano gratuito
  monthly_users: number;     // Usuários no plano mensal
  annual_users: number;      // Usuários no plano anual
  projected_monthly_revenue: number; // Receita mensal projetada
}

// Interface para a resposta da criação de usuários
interface CreateUserResponse {
  success?: boolean;
  error?: string;
  user_id?: string;
  message?: string;
}

/**
 * Hook personalizado para gerenciar o dashboard administrativo
 * Responsável por:
 * - Verificar permissões de admin
 * - Carregar estatísticas do dashboard
 * - Criar novos usuários
 * - Verificar assinaturas expiradas
 * - Fazer logout
 */
export const useAdminDashboard = () => {
  // Estados para armazenar dados e status
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Hooks do React Router e notificações
  const { toast } = useToast();
  const navigate = useNavigate();

  // Effect para verificar status de admin quando o componente monta
  useEffect(() => {
    checkAdminStatus();
  }, []);

  // Effect para carregar dados do dashboard e configurar atualizações automáticas
  useEffect(() => {
    if (isAdmin) {
      // Carregar dados iniciais
      loadDashboardStats();
      checkExpiredSubscriptions();
      
      // Configurar intervalo para atualizar dados a cada 30 segundos
      const interval = setInterval(() => {
        loadDashboardStats();
        checkExpiredSubscriptions();
      }, 30000);
      
      // Cleanup do intervalo quando o componente desmonta
      return () => clearInterval(interval);
    } else if (loading === false && !isAdmin) {
      // Redirecionar para login admin se não for admin
      navigate('/admin-auth');
    }
  }, [isAdmin, loading, navigate]);

  /**
   * Verifica se o usuário atual tem permissões de administrador
   * Primeiro verifica por email específico, depois consulta a tabela admin_users
   */
  const checkAdminStatus = async () => {
    try {
      // Obter usuário autenticado atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Nenhum usuário encontrado');
        setLoading(false);
        navigate('/admin-auth');
        return;
      }

      console.log('Verificando status de admin para usuário:', user.email);

      // Verificação por email específico (hardcoded para admin principal)
      if (user.email === 'adminwiize@wiizeflow.com.br') {
        console.log('Usuário admin detectado por email');
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Consultar tabela admin_users para verificar permissões
      const { data: adminCheck, error } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Resultado da verificação admin:', adminCheck, 'Erro:', error);

      if (error) {
        console.error('Erro ao verificar status de admin:', error);
        // Fallback para email específico em caso de erro
        if (user.email === 'adminwiize@wiizeflow.com.br') {
          setIsAdmin(true);
          setLoading(false);
          return;
        }
      }

      // Definir status de admin baseado na consulta
      setIsAdmin(!!adminCheck);
      setLoading(false);

      // Mostrar erro e redirecionar se não for admin
      if (!adminCheck && user.email !== 'adminwiize@wiizeflow.com.br') {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar esta área.",
          variant: "destructive",
        });
        navigate('/admin-auth');
      }
    } catch (error) {
      console.error('Erro ao verificar status de admin:', error);
      
      // Fallback para email específico
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'adminwiize@wiizeflow.com.br') {
        setIsAdmin(true);
      }
      
      setLoading(false);
      
      // Redirecionar se não for o admin principal
      if (!user || user.email !== 'adminwiize@wiizeflow.com.br') {
        navigate('/admin-auth');
      }
    }
  };

  /**
   * Verifica e atualiza assinaturas expiradas
   * Chama uma função RPC do Supabase para processar automaticamente
   */
  const checkExpiredSubscriptions = async () => {
    try {
      console.log('Verificando assinaturas expiradas...');
      const { data, error } = await supabase.rpc('check_expired_subscriptions');
      
      if (error) {
        console.error('Erro ao verificar assinaturas expiradas:', error);
      } else if (data > 0) {
        console.log(`Atualizadas ${data} assinaturas expiradas para plano gratuito`);
      }
    } catch (error) {
      console.error('Erro ao verificar assinaturas expiradas:', error);
    }
  };

  /**
   * Carrega todas as estatísticas do dashboard
   * Inclui contagem de usuários, planos ativos e cálculo de receita
   */
  const loadDashboardStats = async () => {
    try {
      console.log('Carregando estatísticas do dashboard...');
      
      // Sincronizar usuários existentes do auth para profiles
      await supabase.rpc('sync_existing_users');
      
      // Carregar todos os perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('plan_type, subscription_status, subscription_expires_at, created_at');

      if (profilesError) {
        console.error('Erro ao carregar perfis:', profilesError);
        // Definir estatísticas padrão em caso de erro
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

      console.log('Perfis carregados:', profiles);

      // Contar usuários online (atividade nos últimos 15 minutos)
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('last_activity', new Date(Date.now() - 15 * 60 * 1000).toISOString());

      // Garantir pelo menos 1 usuário online (para evitar zero)
      const onlineUsers = sessionsError ? 1 : Math.max((sessions?.length || 0), 1);

      // Filtrar apenas usuários com assinaturas ativas
      const activeProfiles = profiles?.filter(p => {
        if (p.plan_type === 'free') return true;
        
        // Verificar status da assinatura
        if (p.subscription_status && p.subscription_status !== 'active') {
          // Se status não é ativo, verificar se ainda não expirou
          if (p.subscription_expires_at) {
            return new Date(p.subscription_expires_at) > new Date();
          }
          return false;
        }
        
        // Verificar data de expiração
        if (p.subscription_expires_at) {
          return new Date(p.subscription_expires_at) > new Date();
        }
        return true;
      }) || [];

      // Calcular contadores por tipo de plano
      const totalUsers = profiles?.length || 0;
      const freeUsers = activeProfiles.filter(p => p.plan_type === 'free').length;
      const monthlyUsers = activeProfiles.filter(p => p.plan_type === 'monthly').length;
      const annualUsers = activeProfiles.filter(p => p.plan_type === 'annual').length;
      
      // Calcular receita projetada mensal
      // Plano Mensal: R$ 47,00/mês
      // Plano Anual: R$ 397,00/ano = R$ 33,08/mês
      const projectedRevenue = (monthlyUsers * 47.00) + (annualUsers * (397.00 / 12));

      // Montar objeto com as estatísticas calculadas
      const newStats = {
        online_users: onlineUsers,
        total_users: totalUsers,
        free_users: freeUsers,
        monthly_users: monthlyUsers,
        annual_users: annualUsers,
        projected_monthly_revenue: projectedRevenue,
      };

      console.log('Estatísticas calculadas:', newStats);
      setStats(newStats);

    } catch (error) {
      console.error('Erro ao carregar estatísticas do dashboard:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar estatísticas.",
        variant: "destructive",
      });
    }
  };

  /**
   * Cria um novo usuário com plano específico
   * @param email - Email do novo usuário
   * @param password - Senha do novo usuário
   * @param name - Nome completo do usuário
   * @param planType - Tipo de plano (free, monthly, annual)
   * @param subscriptionPeriod - Período da assinatura (monthly, annual)
   */
  const createUser = async (
    email: string, 
    password: string, 
    name: string, 
    planType: string, 
    subscriptionPeriod: string
  ) => {
    try {
      console.log('Criando usuário com parâmetros:', { email, name, planType, subscriptionPeriod });

      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Confirmar email automaticamente
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

      // Calcular data de expiração baseada no tipo de plano
      let expiresAt = null;
      if (planType !== 'free') {
        const now = new Date();
        if (subscriptionPeriod === 'monthly') {
          // Adicionar 1 mês
          expiresAt = new Date(now.setMonth(now.getMonth() + 1));
        } else if (subscriptionPeriod === 'annual') {
          // Adicionar 1 ano
          expiresAt = new Date(now.setFullYear(now.getFullYear() + 1));
        }
      }

      // Atualizar perfil do usuário com informações do plano
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
        console.error('Erro ao atualizar perfil:', profileError);
      }

      // Mostrar notificação de sucesso
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso!",
        variant: "default",
      });

      // Recarregar estatísticas para refletir o novo usuário
      loadDashboardStats();

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  /**
   * Faz logout do usuário admin atual
   */
  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-auth');
  };

  // Retornar todas as funções e estados para uso nos componentes
  return {
    stats,
    loading,
    isAdmin,
    logout,
    createUser,
    refreshStats: loadDashboardStats
  };
};
