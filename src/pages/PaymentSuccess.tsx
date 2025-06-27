
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment, loading } = usePaymentVerification();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const handlePaymentVerification = async () => {
      if (!sessionId) {
        setVerificationStatus('error');
        return;
      }

      try {
        const isConfirmed = await verifyPayment(sessionId);
        if (isConfirmed) {
          setVerificationStatus('success');
          // Refresh user session to get updated profile
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Force refresh of user profile
            window.location.reload();
          }
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setVerificationStatus('error');
      }
    };

    handlePaymentVerification();
  }, [sessionId, verifyPayment]);

  const handleContinue = () => {
    navigate('/dashboard');
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
              <CardTitle className="text-blue-600">Verificando Pagamento</CardTitle>
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
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-red-600">Erro na Verificação</CardTitle>
            </>
          )}
        </CardHeader>
        
        <CardContent className="text-center">
          {verificationStatus === 'pending' && (
            <p className="text-gray-600 mb-4">
              Aguarde enquanto verificamos seu pagamento...
            </p>
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
                Não foi possível verificar seu pagamento automaticamente. Entre em contato conosco se o problema persistir.
              </p>
              <div className="space-y-2">
                <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                  Tentar Novamente
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
