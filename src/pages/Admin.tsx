import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Users, 
  UserCheck, 
  DollarSign, 
  Activity,
  Crown,
  CreditCard,
  Gift,
  RefreshCw,
  ArrowLeft,
  LogOut
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { CreateUserDialog } from "@/components/CreateUserDialog";
import { PaymentFailuresTable } from "@/components/PaymentFailuresTable";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();
  const { stats, loading, isAdmin, logout, createUser, refreshStats } = useAdminDashboard();
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
    await refreshStats();
    setRefreshing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
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
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">WiizeFlow</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Crown className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <CreateUserDialog onCreateUser={createUser} />
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
            Controle geral da plataforma WiizeFlow
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Online Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats?.online_users || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Ativos nos últimos 15 minutos
              </p>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.total_users || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Usuários registrados
              </p>
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal Projetada</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.projected_monthly_revenue || 0)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Baseado nos planos ativos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Plan Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Free Plan Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plano Gratuito</CardTitle>
              <Gift className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stats?.free_users || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {stats?.total_users ? 
                  `${((stats.free_users / stats.total_users) * 100).toFixed(1)}% dos usuários` : 
                  '0% dos usuários'
                }
              </p>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  R$ 0,00/mês
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Plan Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plano Mensal</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.monthly_users || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {stats?.total_users ? 
                  `${((stats.monthly_users / stats.total_users) * 100).toFixed(1)}% dos usuários` : 
                  '0% dos usuários'
                }
              </p>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  R$ 47,00/mês
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Annual Plan Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plano Anual</CardTitle>
              <Crown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.annual_users || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {stats?.total_users ? 
                  `${((stats.annual_users / stats.total_users) * 100).toFixed(1)}% dos usuários` : 
                  '0% dos usuários'
                }
              </p>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  R$ 397,00/ano
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Detalhamento da Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Receita Planos Mensais</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency((stats?.monthly_users || 0) * 47.00)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats?.monthly_users || 0} usuários × R$ 47,00
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Receita Planos Anuais (mensal)</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {formatCurrency((stats?.annual_users || 0) * (397.00 / 12))}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats?.annual_users || 0} usuários × R$ 33,08
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Mensal</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats?.projected_monthly_revenue || 0)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Receita recorrente mensal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Failures Table */}
        <PaymentFailuresTable />
      </main>
    </div>
  );
};

export default Admin;
