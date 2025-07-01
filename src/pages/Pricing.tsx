import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Target, Crown } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { useState } from "react";
import EmailCaptureDialog from "@/components/EmailCaptureDialog";

const Pricing = () => {
  const { createPayment, getCurrentUser, loading } = usePayment();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string>("");

  const handlePlanClick = async (priceId: string) => {
    console.log('Plan clicked with priceId:', priceId);
    
    // Verificar se usuário está logado
    const user = await getCurrentUser();
    if (user?.email) {
      // Usuário logado - usar email da sessão
      console.log('User logged in, using session email:', user.email);
      createPayment(priceId, user.email);
    } else {
      // Usuário não logado - abrir popup para capturar email
      setSelectedPriceId(priceId);
      setEmailDialogOpen(true);
    }
  };

  const handleEmailConfirm = (email: string) => {
    createPayment(selectedPriceId, email);
    setEmailDialogOpen(false);
  };

  const plans = [
    {
      name: "Mensal", 
      price: "R$47",
      period: "/mês",
      funnelLimit: "Ilimitados",
      features: [
        "Funis ilimitados",
        "Todos os templates inclusos",
        "Editor visual completo",
        "Exportar como imagem/PDF",
        "Suporte prioritário",
        "Análises detalhadas",
        "Histórico de versões",
        "Sistema de Metrificação de Resultados",
        "Dashboard com Métricas Reais"
      ],
      restrictions: [],
      buttonText: "Assinar Mensal",
      popular: false,
      color: "blue",
      priceId: "price_1RdhpHG1GdQ2ZjmFmYXfEFJa"
    },
    {
      name: "Anual",
      price: "R$397",
      period: "/ano",
      originalPrice: "R$564",
      savings: "30% OFF",
      funnelLimit: "Ilimitados", 
      features: [
        "Funis ilimitados",
        "Todos os templates inclusos",
        "Editor visual completo",
        "Exportar como imagem/PDF",
        "Suporte prioritário VIP",
        "Análises detalhadas",
        "Histórico de versões",
        "Acesso antecipado a novas funcionalidades",
        "Consultoria personalizada (1h/mês)",
        "Sistema de Metrificação de Resultados",
        "Dashboard com Métricas Reais"
      ],
      restrictions: [],
      buttonText: "Assinar Anual",
      popular: true,
      color: "green",
      priceId: "price_1RdhqYG1GdQ2ZjmFlAOaBr4A"
    }
  ];

  const getCardStyle = (plan: any) => {
    if (plan.popular) {
      return 'border-2 border-green-500 scale-105 relative';
    }
    return 'border border-gray-200';
  };

  const getButtonStyle = (plan: any) => {
    switch (plan.color) {
      case 'green':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="hover:bg-blue-50"
          >
            Voltar ao Início
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Escolha o Plano Ideal para Seu Negócio
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Crie funis ilimitados e escale seu negócio com nossas ferramentas profissionais. Todos os planos incluem suporte em português.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`${getCardStyle(plan)} hover:shadow-lg transition-all duration-200`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Mais Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                
                {plan.originalPrice && (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
                    <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full font-medium">
                      {plan.savings}
                    </span>
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mt-2">
                  {plan.funnelLimit} funis
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => handlePlanClick(plan.priceId)}
                  disabled={loading}
                  className={`w-full ${getButtonStyle(plan)}`}
                >
                  {loading ? "Processando..." : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 max-w-4xl mx-auto">
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Economize 30% com o Plano Anual
            </h3>
            <p className="text-blue-700">
              Pague apenas R$ 397 ao invés de R$ 564 e tenha acesso completo por um ano inteiro!
            </p>
          </div>
          
          <p className="text-gray-600 mb-4">
            ✨ Todos os planos incluem acesso completo aos templates e funcionalidades avançadas
          </p>
          <p className="text-gray-600">
            🔒 Pagamento seguro • Processamento via Stripe • Suporte em português • Garantia de 30 dias
          </p>
        </div>
      </section>

      {/* Email Capture Dialog */}
      <EmailCaptureDialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        onConfirm={handleEmailConfirm}
        loading={loading}
      />
    </div>
  );
};

export default Pricing;
