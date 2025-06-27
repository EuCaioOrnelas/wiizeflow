
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Interface para definir a estrutura de uma falha de pagamento
interface PaymentFailure {
  id: string;                    // ID único da falha
  user_id: string;              // ID do usuário relacionado
  stripe_customer_id: string;   // ID do cliente no Stripe
  stripe_subscription_id: string; // ID da assinatura no Stripe
  failure_reason: string;       // Motivo da falha
  failure_date: string;         // Data da falha
  resolved: boolean;            // Status de resolução
}

/**
 * Componente para exibir e gerenciar falhas de pagamento
 * 
 * Funcionalidades:
 * - Lista falhas de pagamento não resolvidas
 * - Permite verificação manual com Stripe
 * - Atualização automática dos dados
 * - Interface responsiva com indicadores visuais
 */
export const PaymentFailuresTable = () => {
  // Estados para gerenciar dados e status do componente
  const [failures, setFailures] = useState<PaymentFailure[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Carrega falhas de pagamento não resolvidas do banco de dados
   * Busca apenas os 10 registros mais recentes
   */
  const loadPaymentFailures = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_failures')
        .select('*')
        .eq('resolved', false) // Apenas falhas não resolvidas
        .order('failure_date', { ascending: false }) // Mais recentes primeiro
        .limit(10); // Limitar a 10 registros

      if (error) {
        console.error('Erro ao carregar falhas de pagamento:', error);
      } else {
        setFailures(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar falhas de pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verifica assinaturas no Stripe via edge function
   * Atualiza automaticamente o status das assinaturas
   */
  const checkStripeSubscriptions = async () => {
    setLoading(true);
    try {
      // Chamar edge function para verificar status no Stripe
      const { data, error } = await supabase.functions.invoke('check-stripe-subscriptions');
      
      if (error) {
        throw error;
      }

      // Mostrar resultado da verificação
      toast({
        title: "Verificação Concluída",
        description: `${data.updated} assinaturas foram atualizadas`,
        variant: "default",
      });

      // Recarregar falhas após verificação
      await loadPaymentFailures();
    } catch (error: any) {
      console.error('Erro ao verificar assinaturas no Stripe:', error);
      toast({
        title: "Erro",
        description: "Erro ao verificar assinaturas no Stripe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect para carregar dados quando o componente monta
  useEffect(() => {
    loadPaymentFailures();
  }, []);

  /**
   * Formata data para exibição no formato brasileiro
   * @param dateString - String de data ISO
   * @returns Data formatada em português brasileiro
   */
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
      {/* Cabeçalho da tabela com título e botão de verificação */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
          Falhas de Pagamento
        </CardTitle>
        {/* Botão para verificar status no Stripe */}
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
        {/* Estado de carregamento */}
        {loading ? (
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : failures.length === 0 ? (
          /* Estado vazio - nenhuma falha encontrada */
          <div className="text-center py-4">
            <p className="text-gray-500">Nenhuma falha de pagamento encontrada</p>
          </div>
        ) : (
          /* Tabela com as falhas de pagamento */
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
                  {/* Data da falha formatada */}
                  <TableCell>{formatDate(failure.failure_date)}</TableCell>
                  
                  {/* ID do cliente truncado para melhor visualização */}
                  <TableCell className="font-mono text-sm">
                    {failure.stripe_customer_id?.substring(0, 12)}...
                  </TableCell>
                  
                  {/* Motivo da falha com texto truncado */}
                  <TableCell className="max-w-xs truncate">
                    {failure.failure_reason}
                  </TableCell>
                  
                  {/* Badge de status (resolvido/pendente) */}
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
