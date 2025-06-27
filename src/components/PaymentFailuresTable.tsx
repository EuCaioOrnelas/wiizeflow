
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentFailure {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  failure_reason: string;
  failure_date: string;
  resolved: boolean;
}

export const PaymentFailuresTable = () => {
  const [failures, setFailures] = useState<PaymentFailure[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadPaymentFailures = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_failures')
        .select('*')
        .eq('resolved', false)
        .order('failure_date', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading payment failures:', error);
      } else {
        setFailures(data || []);
      }
    } catch (error) {
      console.error('Error loading payment failures:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkStripeSubscriptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-stripe-subscriptions');
      
      if (error) {
        throw error;
      }

      toast({
        title: "Verificação Concluída",
        description: `${data.updated} assinaturas foram atualizadas`,
        variant: "default",
      });

      // Recarregar falhas após verificação
      await loadPaymentFailures();
    } catch (error: any) {
      console.error('Error checking Stripe subscriptions:', error);
      toast({
        title: "Erro",
        description: "Erro ao verificar assinaturas no Stripe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentFailures();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
          Falhas de Pagamento
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={checkStripeSubscriptions}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Verificar Stripe
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : failures.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Nenhuma falha de pagamento encontrada</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failures.map((failure) => (
                <TableRow key={failure.id}>
                  <TableCell>{formatDate(failure.failure_date)}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {failure.stripe_customer_id?.substring(0, 12)}...
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {failure.failure_reason}
                  </TableCell>
                  <TableCell>
                    <Badge variant={failure.resolved ? "default" : "destructive"}>
                      {failure.resolved ? "Resolvido" : "Pendente"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
