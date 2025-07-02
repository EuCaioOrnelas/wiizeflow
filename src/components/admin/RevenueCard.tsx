
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calculator } from "lucide-react";
import { RevenueMetrics } from "@/types/adminMetrics";

interface RevenueCardProps {
  metrics: RevenueMetrics;
}

export const RevenueCard = ({ metrics }: RevenueCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">MRR</CardTitle>
          <DollarSign className="h-4 w-4" style={{ color: 'rgb(6, 214, 160)' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: 'rgb(6, 214, 160)' }}>
            {formatCurrency(metrics.mrr)}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Receita Recorrente Mensal
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ARR</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(metrics.arr)}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Receita Anual Estimada
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ARPU</CardTitle>
          <Calculator className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(metrics.arpu)}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Ticket médio por cliente
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
