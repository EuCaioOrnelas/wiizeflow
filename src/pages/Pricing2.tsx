
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Target, 
  ArrowLeft,
  Crown,
  Zap
} from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { useNavigate } from "react-router-dom";

const Pricing2 = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { createPayment, loading } = usePayment();
  const navigate = useNavigate();

  const handleSelectPlan = async (priceId: string, planName: string) => {
    try {
      await createPayment(priceId);
    } catch (error) {
      console.error('Erro ao criar sessão de pagamento:', error);
    }
  };

  const monthlyFeatures = [
    "Funis ilimitados",
    "Templates profissionais",
    "Análises em tempo real",
    "Suporte prioritário",
    "Integração com WhatsApp",
    "Exportação em PDF/PNG",
    "Dashboard personalizado"
  ];

  const annualFeatures = [
    "Funis ilimitados",
    "Templates profissionais",
    "Análises em tempo real", 
    "Suporte prioritário VIP",
    "Integração com WhatsApp",
    "Exportação em PDF/PNG",
    "Dashboard personalizado",
    "Consultoria mensal gratuita",
    "Acesso antecipado a novos recursos"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Escolha seu <span className="text-green-600">Plano</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transforme seus visitantes em clientes com funis profissionais
          </p>
          
          {/* Toggle anual/mensal */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-green-600' : 'text-gray-500'}`}>
              Mensal
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-green-600' : 'text-gray-500'}`}>
              Anual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Economize 15%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Mensal */}
          <Card className={`relative border-2 transition-all hover:shadow-lg ${
            !isAnnual ? 'border-green-500 shadow-lg scale-105' : 'border-gray-200'
          }`}>
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Plano Mensal</CardTitle>
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-4xl font-bold text-green-600">R$ 47</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <p className="text-gray-600">Para quem quer começar agora</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {monthlyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handleSelectPlan('price_1QZ5UDKfpR3j80kJZSJqm7Oe', 'Plano Mensal')}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
              >
                {loading ? 'Processando...' : 'Começar Agora'}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Cancele a qualquer momento
              </p>
            </CardContent>
          </Card>

          {/* Plano Anual */}
          <Card className={`relative border-2 transition-all hover:shadow-lg ${
            isAnnual ? 'border-green-500 shadow-lg scale-105' : 'border-gray-200'
          }`}>
            {isAnnual && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-4 py-1 text-sm font-medium">
                  <Crown className="w-4 h-4 mr-1" />
                  Mais Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Plano Anual</CardTitle>
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-4xl font-bold text-green-600">R$ 397</span>
                <span className="text-gray-500">/ano</span>
              </div>
              <div className="text-sm text-gray-500">
                <span className="line-through">R$ 564</span>
                <span className="text-green-600 font-medium ml-2">Economize R$ 167</span>
              </div>
              <p className="text-gray-600">Para quem quer crescer</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {annualFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handleSelectPlan('price_1QZ5VNKfpR3j80kJwkzJaenZ', 'Plano Anual')}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
              >
                {loading ? 'Processando...' : 'Começar Agora'}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Cobrança única anual • Cancele a qualquer momento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Garantia */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-700 font-medium">
              30 dias de garantia • Suporte 24/7 • Sem taxas de setup
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing2;
