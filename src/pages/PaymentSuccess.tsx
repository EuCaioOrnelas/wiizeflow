
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment, loading } = usePaymentVerification();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [retryCount, setRetryCount] = useState(0);

  const sessionId = searchParams.get('session_id');

  const handlePaymentVerification = async () => {
    if (!sessionId) {
      setVerificationStatus('error');
      return;
    }

    try {
      console.log('Attempting payment verification, try:', retryCount + 1);
      const isConfirmed = await verifyPayment(sessionId);
      
      if (isConfirmed) {
        setVerificationStatus('success');
        // Refresh user session to get updated profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.auth.refreshSession();
        }
      } else {
        // Se não foi confirmado e ainda não tentamos muitas vezes, tentar novamente
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000); // Tentar novamente em 2 segundos
        } else {
          setVerificationStatus('error');
        }
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      } else {
        setVerificationStatus('error');
      }
    }
  };

  useEffect(() => {
    handlePaymentVerification();
  }, [sessionId, retryCount]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const handleRetry = () => {
    setVerificationStatus('pending');
    setRetryCount(0);
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Link Inválido</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Este link de confirmação de pagamento é inválido ou expirou.
            </p>
            <Button onClick={() => navigate('/pricing')} className="w-full">
              Ver Planos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {verificationStatus === 'pending' && (
            <>
              <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <CardTitle className="text-blue-600">
                Verificando Pagamento
                {retryCount > 0 && ` (Tentativa ${retryCount + 1}/4)`}
              </CardTitle>
            </>
          )}
          
          {verificationStatus === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-green-600">Pagamento Confirmado!</CardTitle>
            </>
          )}
          
          {verificationStatus === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle className="text-yellow-600">Verificação Pendente</CardTitle>
            </>
          )}
        </CardHeader>
        
        <CardContent className="text-center">
          {verificationStatus === 'pending' && (
            <div>
              <p className="text-gray-600 mb-4">
                Aguarde enquanto verificamos seu pagamento...
              </p>
              {retryCount > 0 && (
                <p className="text-sm text-gray-500 mb-4">
                  Às vezes pode levar alguns minutos para o webhook processar.
                </p>
              )}
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <>
              <p className="text-gray-600 mb-6">
                Seu plano foi ativado com sucesso! Agora você pode aproveitar todos os recursos premium.
              </p>
              <Button onClick={handleContinue} className="w-full">
                Ir para Dashboard
              </Button>
            </>
          )}
          
          {verificationStatus === 'error' && (
            <>
              <p className="text-gray-600 mb-6">
                Seu pagamento foi processado, mas pode levar alguns minutos para ativar. 
                Se o problema persistir, entre em contato conosco.
              </p>
              <div className="space-y-2">
                <Button onClick={handleRetry} variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Verificar Novamente
                </Button>
                <Button onClick={() => navigate('/dashboard')} className="w-full">
                  Ir para Dashboard
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
