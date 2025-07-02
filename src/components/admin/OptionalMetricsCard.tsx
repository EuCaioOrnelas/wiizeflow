
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, AlertCircle } from "lucide-react";
import { OptionalMetrics } from "@/types/adminMetrics";

interface OptionalMetricsCardProps {
  metrics: OptionalMetrics;
}

export const OptionalMetricsCard = ({ metrics }: OptionalMetricsCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
            Preferência de Planos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Plano Mensal</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {metrics.planPreference.monthly} usuários
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Plano Anual</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {metrics.planPreference.annual} usuários
              </Badge>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-500">
                Total: {metrics.planPreference.monthly + metrics.planPreference.annual} assinantes pagos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
            Trials Expirando (3 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.expiringTrials.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Nenhum trial expirando nos próximos 3 dias
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Expira em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.expiringTrials.slice(0, 5).map((trial) => (
                  <TableRow key={trial.id}>
                    <TableCell className="font-medium">{trial.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{trial.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={trial.daysLeft <= 1 ? "destructive" : "secondary"}
                        className={trial.daysLeft <= 1 ? "" : "bg-orange-100 text-orange-800"}
                      >
                        {trial.daysLeft}d
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
