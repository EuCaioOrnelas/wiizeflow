
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CreditCard, TrendingUp, LogOut } from "lucide-react";
import { CreateUserDialog } from "@/components/CreateUserDialog";
import { useState } from "react";
import { PaymentFailuresTable } from "@/components/PaymentFailuresTable";
import { EngagementMetrics } from "@/components/analytics/EngagementMetrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const { stats, loading, isAdmin, logout } = useAdminDashboard();
  const [showCreateUser, setShowCreateUser] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta área.</p>
          <Button onClick={() => window.location.href = '/admin-auth'}>
            Fazer Login como Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600">WiizeFlow - Gestão e Analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowCreateUser(true)}
            >
              Criar Usuário
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Avançados</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: 'rgb(6, 214, 160)' }}>
                    {stats?.online_users || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ativos nos últimos 15min
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats?.total_users || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.free_users || 0} gratuitos | {((stats?.monthly_users || 0) + (stats?.annual_users || 0))} pagos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assinantes Mensais</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.monthly_users || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    R$ 47,00/mês cada
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Projetada</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {stats?.projected_monthly_revenue?.toFixed(2) || '0,00'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Por mês (atual)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Plan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Planos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600 mb-2">
                      {stats?.free_users || 0}
                    </div>
                    <div className="text-sm text-gray-500">Plano Gratuito</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gray-400 h-2 rounded-full" 
                        style={{ 
                          width: `${stats?.total_users ? (stats.free_users / stats.total_users) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {stats?.monthly_users || 0}
                    </div>
                    <div className="text-sm text-gray-500">Plano Mensal</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ 
                          width: `${stats?.total_users ? (stats.monthly_users / stats.total_users) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {stats?.annual_users || 0}
                    </div>
                    <div className="text-sm text-gray-500">Plano Anual</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ 
                          width: `${stats?.total_users ? (stats.annual_users / stats.total_users) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <EngagementMetrics />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentFailuresTable />
          </TabsContent>
        </Tabs>
      </main>

      <CreateUserDialog 
        isOpen={showCreateUser}
        onClose={() => setShowCreateUser(false)}
      />
    </div>
  );
};

export default Admin;
