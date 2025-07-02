
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  RefreshCw,
  ArrowLeft,
  LogOut,
  Bell,
  Crown
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { PaymentFailuresTable } from "@/components/PaymentFailuresTable";
import { UserGrowthCard } from "@/components/admin/UserGrowthCard";
import { ConversionCard } from "@/components/admin/ConversionCard";
import { RevenueCard } from "@/components/admin/RevenueCard";
import { ChurnCard } from "@/components/admin/ChurnCard";
import { OptionalMetricsCard } from "@/components/admin/OptionalMetricsCard";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();
  const { loading: authLoading, isAdmin, logout } = useAdminDashboard();
  const { metrics, loading: metricsLoading, refreshMetrics } = useAdminMetrics();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-auth');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshMetrics();
    setRefreshing(false);
  };

  if (authLoading || metricsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: 'rgb(6, 214, 160)' }} />
          <p className="text-gray-600 dark:text-gray-400">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Você não tem permissão para acessar esta área.
          </p>
          <Button onClick={() => navigate('/admin-auth')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ir para Login Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - mantendo exatamente como estava */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8" style={{ color: 'rgb(6, 214, 160)' }} />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">WiizeFlow</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)', color: 'rgb(6, 214, 160)' }}>
              <Crown className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/templates')}
              size="sm"
            >
              <Target className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/avisos')}
              size="sm"
            >
              <Bell className="w-4 h-4 mr-2" />
              Avisos
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Site
            </Button>
            <Button variant="destructive" onClick={logout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Métricas de crescimento e performance do SaaS
          </p>
        </div>

        {metrics && (
          <>
            {/* Seção 1: Crescimento de Usuários */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📈 Crescimento de Usuários
              </h2>
              <UserGrowthCard metrics={metrics.userGrowth} />
            </div>

            {/* Seção 2: Conversão */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                🎯 Métricas de Conversão
              </h2>
              <ConversionCard metrics={metrics.conversion} />
            </div>

            {/* Seção 3: Receita Recorrente */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                💰 Receita Recorrente
              </h2>
              <RevenueCard metrics={metrics.revenue} />
            </div>

            {/* Seção 4: Churn e Retenção */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📉 Churn e Retenção
              </h2>
              <ChurnCard metrics={metrics.churn} />
            </div>

            {/* Seção 5: Métricas Opcionais */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📊 Informações Adicionais
              </h2>
              <OptionalMetricsCard metrics={metrics.optional} />
            </div>
          </>
        )}

        {/* Sistema de Falhas de Pagamento - mantendo exatamente como estava */}
        <PaymentFailuresTable />
      </main>
    </div>
  );
};

export default Admin;
