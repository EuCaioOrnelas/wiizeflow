
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    
    if (loading) {
      console.log('Payment already in progress, ignoring duplicate request');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
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
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const { data, error: functionError } = await supabase.functions.invoke('create-payment', {
        body: {
          priceId,
          customerEmail: finalEmail
        }
      });

      clearTimeout(timeoutId);
      console.log('Supabase function response:', { data, error: functionError });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(functionError.message || 'Erro ao processar pagamento');
      }

      if (data?.url) {
        console.log('Redirecting to Stripe checkout URL:', data.url);
        // Usar window.location.href para redirecionamento mais confiável
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received from Stripe');
        throw new Error('URL de checkout não recebida');
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pagamento';
      setError(errorMessage);
      toast.error('Erro no pagamento', {
        description: errorMessage
      });
      setLoading(false);
    }
  };

  return {
    createPayment,
    getCurrentUser,
    loading,
    error
  };
};
