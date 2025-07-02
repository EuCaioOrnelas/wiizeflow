
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserX, TrendingDown, Clock } from "lucide-react";
import { ChurnMetrics } from "@/types/adminMetrics";

interface ChurnCardProps {
  metrics: ChurnMetrics;
}

export const ChurnCard = ({ metrics }: ChurnCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cancelamentos</CardTitle>
          <UserX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {metrics.cancellationsThisMonth}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Este mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {metrics.churnRate.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Taxa mensal
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Retenção Média</CardTitle>
          <Clock className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {metrics.avgRetentionMonths}m
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Tempo médio
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
