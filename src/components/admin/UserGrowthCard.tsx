
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Activity, Clock, Database } from "lucide-react";
import { UserGrowthMetrics } from "@/types/adminMetrics";

interface UserGrowthCardProps {
  metrics: UserGrowthMetrics;
}

export const UserGrowthCard = ({ metrics }: UserGrowthCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
          <Database className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {metrics.totalUsers}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Registrados na plataforma
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Novos Cadastros (7d)</CardTitle>
          <UserPlus className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {metrics.newSignups7Days}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Últimos 7 dias
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Novos Cadastros (30d)</CardTitle>
          <UserPlus className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.newSignups30Days}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Últimos 30 dias
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          <Activity className="h-4 w-4" style={{ color: 'rgb(6, 214, 160)' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: 'rgb(6, 214, 160)' }}>
            {metrics.totalActiveUsers}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Últimos 30 dias
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trials Ativos</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {metrics.totalActiveTrials}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Em período de teste
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
