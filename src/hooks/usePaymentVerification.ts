
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePaymentVerification = () => {
  const [loading, setLoading] = useState(false);

  const verifyPayment = async (sessionId: string) => {
    setLoading(true);
    
    try {
      console.log('Verifying payment for session:', sessionId);
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });

      if (error) {
        console.error('Payment verification error:', error);
        throw error;
      }

      console.log('Payment verification result:', data);

      if (data.found && data.status === 'paid') {
        toast.success('Pagamento confirmado!', {
          description: `Plano ${data.plan_name} ativado com sucesso.`
        });
        
        // Força refresh da sessão do usuário para atualizar o plano
        await supabase.auth.refreshSession();
        
        return true;
      } else if (data.found && data.status === 'pending') {
        toast.info('Pagamento em processamento', {
          description: 'Aguardando confirmação do pagamento.'
        });
        return false;
      } else {
        toast.warning('Pagamento não encontrado', {
          description: 'Verificando com o Stripe... Isso pode levar alguns segundos.'
        });
        return false;
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Erro ao verificar pagamento', {
        description: 'Tente novamente em alguns instantes.'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyPayment,
    loading
  };
};
