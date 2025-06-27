
import { Users, Target, CreditCard, UserCheck, UserX, TrendingUp } from "lucide-react";
import { useEngagementMetrics } from "@/hooks/useEngagementMetrics";
import { MetricCard } from "./MetricCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const EngagementMetrics = () => {
  const { metrics, loading, refreshMetrics } = useEngagementMetrics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Métricas de Engajamento</h2>
          <div className="animate-pulse">
            <div className="h-9 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Não foi possível carregar as métricas.</p>
        <Button onClick={refreshMetrics} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  
  const getEngagementRate = () => {
    if (metrics.total_active_users > 0) {
      return (metrics.users_with_funnels / metrics.total_active_users) * 100;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Métricas de Engajamento</h2>
          <p className="text-gray-600 mt-1">Análise de retenção, conversão e atividade dos usuários</p>
        </div>
        <Button 
          onClick={refreshMetrics} 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Atualizar</span>
        </Button>
      </div>

      {/* Métricas de Usuários Ativos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Usuários Ativos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="DAU - Usuários Ativos Diários"
            value={metrics.dau}
            subtitle="Últimas 24 horas"
            icon={<Users className="w-5 h-5" />}
            valueColor="text-blue-600"
          />
          <MetricCard
            title="WAU - Usuários Ativos Semanais"
            value={metrics.wau}
            subtitle="Últimos 7 dias"
            icon={<Users className="w-5 h-5" />}
            valueColor="text-green-600"
          />
          <MetricCard
            title="MAU - Usuários Ativos Mensais"
            value={metrics.mau}
            subtitle="Últimos 30 dias"
            icon={<Users className="w-5 h-5" />}
            valueColor="text-purple-600"
          />
        </div>
      </div>

      {/* Métricas de Engajamento */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Engajamento e Conversão</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Taxa de Ativação"
            value={formatPercentage(getEngagementRate())}
            subtitle={`${metrics.users_with_funnels} de ${metrics.total_active_users} usuários criaram funis`}
            icon={<Target className="w-5 h-5" />}
            valueColor="text-orange-600"
            trend={getEngagementRate() > 50 ? 'up' : getEngagementRate() > 25 ? 'neutral' : 'down'}
          />
          <MetricCard
            title="Conversão Freemium → Pago"
            value={formatPercentage(metrics.freemium_to_paid_rate)}
            subtitle="Últimos 30 dias"
            icon={<CreditCard className="w-5 h-5" />}
            valueColor="text-green-600"
            trend={metrics.freemium_to_paid_rate > 5 ? 'up' : metrics.freemium_to_paid_rate > 2 ? 'neutral' : 'down'}
          />
          <MetricCard
            title="Retenção 30 Dias"
            value={formatPercentage(metrics.retention_30_days)}
            subtitle="Usuários que voltaram após 30 dias"
            icon={<UserCheck className="w-5 h-5" />}
            valueColor="text-blue-600"
            trend={metrics.retention_30_days > 30 ? 'up' : metrics.retention_30_days > 15 ? 'neutral' : 'down'}
          />
        </div>
      </div>

      {/* Métricas de Churn */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Retenção e Churn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            title="Taxa de Churn Mensal"
            value={formatPercentage(metrics.monthly_churn_rate)}
            subtitle="Cancelamentos no último mês"
            icon={<UserX className="w-5 h-5" />}
            valueColor="text-red-600"
            trend={metrics.monthly_churn_rate < 5 ? 'up' : metrics.monthly_churn_rate < 10 ? 'neutral' : 'down'}
          />
          <MetricCard
            title="Crescimento de Usuários"
            value={metrics.total_active_users}
            subtitle="Total de usuários ativos (30 dias)"
            icon={<TrendingUp className="w-5 h-5" />}
            valueColor="text-purple-600"
          />
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Insights Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded border-l-4 border-blue-500">
            <p className="font-medium text-gray-700">Engajamento</p>
            <p className="text-gray-600">
              {getEngagementRate() > 50 
                ? "🎉 Excelente taxa de ativação!" 
                : getEngagementRate() > 25 
                ? "👍 Boa taxa de ativação" 
                : "⚠️ Taxa de ativação baixa"}
            </p>
          </div>
          <div className="bg-white p-3 rounded border-l-4 border-green-500">
            <p className="font-medium text-gray-700">Conversão</p>
            <p className="text-gray-600">
              {metrics.freemium_to_paid_rate > 5 
                ? "🚀 Ótima conversão!" 
                : metrics.freemium_to_paid_rate > 2 
                ? "📈 Conversão razoável" 
                : "🎯 Foque em melhorar a conversão"}
            </p>
          </div>
          <div className="bg-white p-3 rounded border-l-4 border-purple-500">
            <p className="font-medium text-gray-700">Retenção</p>
            <p className="text-gray-600">
              {metrics.retention_30_days > 30 
                ? "🔥 Excelente retenção!" 
                : metrics.retention_30_days > 15 
                ? "✅ Retenção boa" 
                : "🔍 Melhorar estratégias de retenção"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
