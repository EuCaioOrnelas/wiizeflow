
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, UserCheck, Calendar } from "lucide-react";
import { ConversionMetrics } from "@/types/adminMetrics";

interface ConversionCardProps {
  metrics: ConversionMetrics;
}

export const ConversionCard = ({ metrics }: ConversionCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {metrics.trialToPayConversionRate.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Trial para pago
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assinantes Mensais</CardTitle>
          <UserCheck className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.newSubscribersMonthly}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Novos este mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assinantes Anuais</CardTitle>
          <UserCheck className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {metrics.newSubscribersAnnual}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Novos este mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
          <Calendar className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {metrics.avgConversionTime}d
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Até conversão
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
