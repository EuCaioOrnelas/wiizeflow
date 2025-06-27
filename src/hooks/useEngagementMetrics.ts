
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EngagementMetrics {
  dau: number;
  wau: number;
  mau: number;
  users_with_funnels: number;
  total_active_users: number;
  freemium_to_paid_rate: number;
  retention_30_days: number;
  monthly_churn_rate: number;
}

export const useEngagementMetrics = () => {
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadMetrics = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('get_engagement_metrics');
      
      if (error) {
        console.error('Error loading engagement metrics:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar métricas de engajamento.",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        setMetrics(data[0]);
      }
    } catch (error) {
      console.error('Error loading engagement metrics:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar métricas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    
    // Atualizar métricas a cada 5 minutos
    const interval = setInterval(loadMetrics, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    loading,
    refreshMetrics: loadMetrics
  };
};
