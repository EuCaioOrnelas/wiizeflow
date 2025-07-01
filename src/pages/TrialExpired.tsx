
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock, Crown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePayment } from "@/hooks/usePayment";
import EmailCaptureDialog from "@/components/EmailCaptureDialog";

const TrialExpired = () => {
  const navigate = useNavigate();
  const { createPayment, loading } = usePayment();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string>("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const handleChoosePlan = (priceId: string) => {
    setSelectedPriceId(priceId);
    setShowEmailDialog(true);
  };

  const handleEmailConfirm = async (email: string) => {
    if (selectedPriceId) {
      await createPayment(selectedPriceId, email);
      setShowEmailDialog(false);
    }
  };

  const handleCloseEmailDialog = () => {
    setShowEmailDialog(false);
    setSelectedPriceId("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <Target className="w-8 sm:w-10 h-8 sm:h-10" style={{ color: 'rgb(6, 214, 160)' }} />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-red-500" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Seu teste gratuito expirou
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Obrigado por experimentar o WiizeFlow! Para continuar criando seus funis de vendas, 
            escolha um dos nossos planos abaixo.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Monthly Plan */}
          <Card className="relative hover:shadow-xl transition-all duration-300 border-2 hover:border-green-300">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Plano Mensal</CardTitle>
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">R$ 47</span>
                <span className="text-sm sm:text-base text-gray-600">/mês</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">Cobrado mensalmente</p>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Funis ilimitados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Todos os elementos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Compartilhamento por Link</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Sistema de Templates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Suporte prioritário via WhatsApp</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Sistema de Trackeamento (Em breve)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Sistema de Metrificação de Resultados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Dashboard com Métricas Reais</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleChoosePlan("price_1RdhpHG1GdQ2ZjmFmYXfEFJa")}
                disabled={loading}
                className="w-full text-white py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold mt-4"
                style={{ backgroundColor: 'rgb(6, 214, 160)' }}
              >
                <Crown className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                {loading ? "Processando..." : "Escolher Plano Mensal"}
              </Button>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="relative hover:shadow-xl transition-all duration-300 border-2 border-green-300 bg-gradient-to-br from-green-50 to-white">
            <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-600 text-white px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold"
                    style={{ backgroundColor: 'rgb(6, 214, 160)' }}>
                💰 Mais Popular - Economize 30%
              </span>
            </div>
            <CardHeader className="text-center pb-3 sm:pb-4 pt-4 sm:pt-6">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Plano Anual</CardTitle>
              <div className="flex items-center justify-center space-x-1 sm:space-x-2 flex-wrap">
                <span className="text-sm sm:text-lg text-gray-500 line-through">R$ 564</span>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">R$ 397</span>
                  <span className="text-sm sm:text-base text-gray-600">/ano</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-green-600 font-semibold" style={{ color: 'rgb(6, 214, 160)' }}>
                Equivale a R$ 33/mês
              </p>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Funis ilimitados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Todos os elementos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Compartilhamento por Link</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Sistema de Templates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Suporte prioritário via WhatsApp</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Sistema de Trackeamento (Em breve)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Sistema de Metrificação de Resultados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">Dashboard com Métricas Reais</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" style={{ color: 'rgb(6, 214, 160)' }} />
                  <span className="text-sm sm:text-base text-gray-700">30% de desconto no valor</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleChoosePlan("price_1RdhqYG1GdQ2ZjmFlAOaBr4A")}
                disabled={loading}
                className="w-full text-white py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold mt-4"
                style={{ backgroundColor: 'rgb(6, 214, 160)' }}
              >
                <Crown className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                {loading ? "Processando..." : "Escolher Plano Anual"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-gray-600">
            Todos os planos incluem garantia de 30 dias. Cancele quando quiser.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" onClick={() => navigate('/')} className="w-full sm:w-auto">
              Voltar ao Início
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="w-full sm:w-auto">
              Fazer Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Email Capture Dialog */}
      <EmailCaptureDialog
        open={showEmailDialog}
        onClose={handleCloseEmailDialog}
        onConfirm={handleEmailConfirm}
        loading={loading}
      />
    </div>
  );
};

export default TrialExpired;
