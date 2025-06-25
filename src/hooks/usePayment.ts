
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  const createPayment = async (priceId: string, customerEmail?: string) => {
    console.log('Starting payment process with priceId:', priceId);
    console.log('Customer email provided:', customerEmail);
    
    // Evitar múltiplas chamadas simultâneas
    if (loading) {
      console.log('Payment already in progress, ignoring duplicate request');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Se não foi fornecido email, tentar pegar do usuário logado
      let finalEmail = customerEmail;
      if (!finalEmail) {
        const user = await getCurrentUser();
        if (user?.email) {
          finalEmail = user.email;
          console.log('Using logged user email:', finalEmail);
        }
      }

      console.log('Final email for checkout:', finalEmail);
      console.log('Calling Supabase function create-payment...');
      
      // Fazer a chamada para a edge function
      const { data, error: functionError } = await supabase.functions.invoke('create-payment', {
        body: {
          priceId,
          customerEmail: finalEmail
        }
      });

      console.log('Supabase function response:', { data, error: functionError });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(functionError.message || 'Erro ao processar pagamento');
      }

      if (data?.url) {
        console.log('Redirecting to Stripe checkout URL:', data.url);
        // Usar location.assign para garantir redirecionamento mais confiável
        window.location.assign(data.url);
      } else {
        console.error('No checkout URL received from Stripe');
        throw new Error('URL de checkout não recebida');
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pagamento';
      setError(errorMessage);
      setLoading(false); // Só resetar loading em caso de erro
    }
    // Não resetar loading em caso de sucesso, pois o usuário será redirecionado
  };

  return {
    createPayment,
    getCurrentUser,
    loading,
    error
  };
};
