
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminDashboardMetrics } from '@/types/adminMetrics';
import { useToast } from '@/hooks/use-toast';

export const useAdminMetrics = () => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Iniciando busca de métricas...');
      
      // Buscar métricas de crescimento de usuários
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Total de usuários - buscar todos os profiles
      console.log('📊 Buscando total de usuários...');
      const { data: totalUsers, error: totalUsersError } = await supabase
        .from('profiles')
        .select('id, email, created_at, plan_type');

      if (totalUsersError) {
        console.error('❌ Erro ao buscar total de usuários:', totalUsersError);
      } else {
        console.log('✅ Total de usuários encontrados:', totalUsers?.length);
        console.log('👥 Usuários:', totalUsers?.map(u => ({ email: u.email, plan: u.plan_type })));
      }

      // Novos cadastros últimos 7 dias
      console.log('📈 Buscando cadastros dos últimos 7 dias...');
      const { data: newSignups7Days, error: signup7Error } = await supabase
        .from('profiles')
        .select('id, email, created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (signup7Error) {
        console.error('❌ Erro ao buscar cadastros 7 dias:', signup7Error);
      } else {
        console.log('✅ Cadastros últimos 7 dias:', newSignups7Days?.length);
      }

      // Novos cadastros últimos 30 dias
      console.log('📈 Buscando cadastros dos últimos 30 dias...');
      const { data: newSignups30Days, error: signup30Error } = await supabase
        .from('profiles')
        .select('id, email, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (signup30Error) {
        console.error('❌ Erro ao buscar cadastros 30 dias:', signup30Error);
      } else {
        console.log('✅ Cadastros últimos 30 dias:', newSignups30Days?.length);
      }

      // Usuários ativos (com sessões nos últimos 30 dias)
      console.log('🔴 Buscando usuários ativos...');
      const { data: activeSessions, error: activeError } = await supabase
        .from('user_sessions')
        .select('user_id, last_activity')
        .gte('last_activity', thirtyDaysAgo.toISOString());

      if (activeError) {
        console.error('❌ Erro ao buscar sessões ativas:', activeError);
      }

      const uniqueActiveUsers = new Set(activeSessions?.map(s => s.user_id) || []).size;
      console.log('✅ Usuários ativos únicos:', uniqueActiveUsers);

      // Trials ativos
      console.log('⏰ Buscando trials ativos...');
      const { data: activeTrials, error: trialsError } = await supabase
        .from('profiles')
        .select('id, email, plan_type, free_trial_expires_at')
        .eq('plan_type', 'free')
        .gte('free_trial_expires_at', now.toISOString());

      if (trialsError) {
        console.error('❌ Erro ao buscar trials ativos:', trialsError);
      } else {
        console.log('✅ Trials ativos:', activeTrials?.length);
      }

      // Métricas de conversão
      console.log('💰 Buscando usuários pagos...');
      const { data: paidUsers, error: paidError } = await supabase
        .from('profiles')
        .select('id, email, plan_type, stripe_customer_id, monthly_amount, annual_amount')
        .in('plan_type', ['monthly', 'annual'])
        .not('stripe_customer_id', 'is', null);

      if (paidError) {
        console.error('❌ Erro ao buscar usuários pagos:', paidError);
      } else {
        console.log('✅ Usuários pagos:', paidUsers?.length);
        console.log('💵 Valores pagos:', paidUsers?.map(u => ({ 
          email: u.email, 
          plan: u.plan_type, 
          monthly_amount: u.monthly_amount, 
          annual_amount: u.annual_amount 
        })));
      }

      const { data: totalTrialUsers, error: trialError } = await supabase
        .from('profiles')
        .select('id')
        .eq('plan_type', 'free');

      const trialToPayConversionRate = totalTrialUsers && paidUsers 
        ? (paidUsers.length / totalTrialUsers.length) * 100 
        : 0;

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const { data: newSubscribers } = await supabase
        .from('profiles')
        .select('plan_type')
        .in('plan_type', ['monthly', 'annual'])
        .gte('updated_at', startOfMonth.toISOString());

      const newSubscribersMonthly = newSubscribers?.filter(s => s.plan_type === 'monthly').length || 0;
      const newSubscribersAnnual = newSubscribers?.filter(s => s.plan_type === 'annual').length || 0;

      // Métricas de receita usando valores reais pagos pelos clientes
      console.log('💰 Calculando receita real com valores pagos pelos clientes...');
      const monthlyUsers = paidUsers?.filter(u => u.plan_type === 'monthly') || [];
      const annualUsers = paidUsers?.filter(u => u.plan_type === 'annual') || [];

      // Calcular MRR usando valores reais (incluindo descontos)
      const monthlyRevenue = monthlyUsers.reduce((sum, user) => {
        const realAmount = user.monthly_amount || 47.00; // fallback para valor padrão se não houver valor real
        console.log(`💵 Usuário mensal ${user.email}: R$ ${realAmount}`);
        return sum + realAmount;
      }, 0);

      const annualMonthlyRevenue = annualUsers.reduce((sum, user) => {
        const realAmount = (user.annual_amount || 397.00) / 12; // fallback para valor padrão se não houver valor real
        console.log(`💵 Usuário anual ${user.email}: R$ ${user.annual_amount || 397.00} (R$ ${realAmount}/mês)`);
        return sum + realAmount;
      }, 0);

      const mrr = monthlyRevenue + annualMonthlyRevenue;
      const arr = mrr * 12;
      const totalPaidUsers = (monthlyUsers?.length || 0) + (annualUsers?.length || 0);
      const arpu = totalPaidUsers > 0 ? mrr / totalPaidUsers : 0;

      console.log('📊 Receita calculada:', {
        monthlyRevenue: monthlyRevenue,
        annualMonthlyRevenue: annualMonthlyRevenue,
        mrr: mrr,
        arr: arr,
        arpu: arpu
      });

      // Cancelamentos e churn
      const { data: cancellations } = await supabase
        .from('profiles')
        .select('id')
        .eq('subscription_status', 'canceled')
        .gte('updated_at', startOfMonth.toISOString());

      const churnRate = totalPaidUsers > 0 ? ((cancellations?.length || 0) / totalPaidUsers) * 100 : 0;

      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const { data: expiringTrials } = await supabase
        .from('profiles')
        .select('id, name, email, free_trial_expires_at')
        .eq('plan_type', 'free')
        .lte('free_trial_expires_at', threeDaysFromNow.toISOString())
        .gte('free_trial_expires_at', now.toISOString());

      const formattedExpiringTrials = expiringTrials?.map(trial => ({
        id: trial.id,
        name: trial.name || 'Usuário',
        email: trial.email || '',
        expiresAt: trial.free_trial_expires_at || '',
        daysLeft: Math.ceil((new Date(trial.free_trial_expires_at || '').getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      })) || [];

      const dashboardMetrics: AdminDashboardMetrics = {
        userGrowth: {
          newSignups7Days: newSignups7Days?.length || 0,
          newSignups30Days: newSignups30Days?.length || 0,
          totalUsers: totalUsers?.length || 0,
          totalActiveUsers: uniqueActiveUsers,
          totalActiveTrials: activeTrials?.length || 0
        },
        conversion: {
          trialToPayConversionRate,
          newSubscribersMonthly,
          newSubscribersAnnual,
          avgConversionTime: 15
        },
        revenue: {
          mrr,
          arr,
          arpu
        },
        churn: {
          cancellationsThisMonth: cancellations?.length || 0,
          churnRate,
          avgRetentionMonths: 8
        },
        optional: {
          planPreference: {
            monthly: monthlyUsers?.length || 0,
            annual: annualUsers?.length || 0
          },
          expiringTrials: formattedExpiringTrials
        }
      };

      console.log('📊 Métricas finais:', dashboardMetrics);
      setMetrics(dashboardMetrics);
    } catch (error) {
      console.error('❌ Erro geral ao buscar métricas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar métricas do painel administrativo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { metrics, loading, refreshMetrics: fetchMetrics };
};
