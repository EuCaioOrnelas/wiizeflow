
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
  LogOut,
  Bell
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { CreateUserDialog } from "@/components/CreateUserDialog";
import { PaymentFailuresTable } from "@/components/PaymentFailuresTable";
import { supabase } from "@/integrations/supabase/client";

/**
 * Página principal do dashboard administrativo do WiizeFlow
 * 
 * Funcionalidades:
 * - Exibição de estatísticas em tempo real
 * - Criação de novos usuários
 * - Visualização de falhas de pagamento
 * - Controle de acesso para administradores
 * - Navegação para outras seções administrativas
 */
const Admin = () => {
  const navigate = useNavigate();
  
  // Hook personalizado para gerenciar dados do dashboard admin
  const { stats, loading, isAdmin, logout, createUser, refreshStats } = useAdminDashboard();
  
  // Estado para controlar indicador visual durante atualização manual
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Effect para verificar autenticação quando a página carrega
   * Redireciona para login se não houver sessão ativa
   */
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-auth');
      }
    };
    
    checkAuth();
  }, [navigate]);

  /**
   * Manipula a atualização manual das estatísticas
   * Mostra indicador visual durante o processo
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshStats();
    setRefreshing(false);
  };

  /**
   * Formata valores monetários para exibição em Real brasileiro
   * @param value - Valor numérico a ser formatado
   * @returns String formatada em moeda brasileira
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Tela de carregamento enquanto verifica permissões e carrega dados
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: 'rgb(6, 214, 160)' }} />
          <p className="text-gray-600 dark:text-gray-400">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  // Tela de acesso negado para usuários não-admin
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
      {/* Cabeçalho da página administrativa */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo e badge de identificação */}
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
          
          {/* Barra de ações do cabeçalho */}
          <div className="flex items-center space-x-4">
            {/* Botão para criar novo usuário */}
            <CreateUserDialog onCreateUser={createUser} />
            
            {/* Botão para gerenciar avisos */}
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/avisos')}
              size="sm"
            >
              <Bell className="w-4 h-4 mr-2" />
              Avisos
            </Button>
            
            {/* Botão para atualizar dados manualmente */}
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            {/* Botão para voltar ao site principal */}
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Site
            </Button>
            
            {/* Botão de logout */}
            <Button variant="destructive" onClick={logout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal da página */}
      <main className="container mx-auto px-6 py-8">
        {/* Título e descrição da página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Controle geral da plataforma WiizeFlow
          </p>
        </div>

        {/* Grade de estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card: Usuários Online */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
              <Activity className="h-4 w-4" style={{ color: 'rgb(6, 214, 160)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'rgb(6, 214, 160)' }}>
                {stats?.online_users || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Ativos nos últimos 15 minutos
              </p>
            </CardContent>
          </Card>

          {/* Card: Total de Usuários */}
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

          {/* Card: Receita Mensal Projetada */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal Projetada</CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: 'rgb(6, 214, 160)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'rgb(6, 214, 160)' }}>
                {formatCurrency(stats?.projected_monthly_revenue || 0)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Baseado nos planos ativos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Grade de distribuição por planos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card: Plano Gratuito */}
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

          {/* Card: Plano Mensal */}
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

          {/* Card: Plano Anual */}
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

        {/* Seção de detalhamento da receita */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" style={{ color: 'rgb(6, 214, 160)' }} />
                Detalhamento da Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Receita dos Planos Mensais */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Receita Planos Mensais</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency((stats?.monthly_users || 0) * 47.00)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats?.monthly_users || 0} usuários × R$ 47,00
                  </p>
                </div>
                
                {/* Receita dos Planos Anuais (convertida para mensal) */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Receita Planos Anuais (mensal)</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {formatCurrency((stats?.annual_users || 0) * (397.00 / 12))}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats?.annual_users || 0} usuários × R$ 33,08
                  </p>
                </div>
                
                {/* Total da Receita Mensal */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Mensal</p>
                  <p className="text-2xl font-bold" style={{ color: 'rgb(6, 214, 160)' }}>
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

        {/* Tabela de falhas de pagamento */}
        <PaymentFailuresTable />
      </main>
    </div>
  );
};

export default Admin;
