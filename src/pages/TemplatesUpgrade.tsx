
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, 
  Crown, 
  Check,
  ArrowLeft,
  LogOut,
  User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePayment } from "@/hooks/usePayment";
import EmailCaptureDialog from "@/components/EmailCaptureDialog";

const TemplatesUpgrade = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  const { createPayment, getCurrentUser, loading } = usePayment();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth');
          return;
        }
        
        setUser(session.user);
        
        // Buscar o perfil do usuário para obter o nome
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('name, plan_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Erro ao buscar perfil:', error);
        }
        
        setUserProfile(profile);

        // Se já é usuário pago, redirecionar para templates
        if (profile?.plan_type === 'monthly' || profile?.plan_type === 'annual') {
          navigate('/templates-prontos');
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handlePlanClick = async (priceId: string) => {
    console.log('Plan clicked with priceId:', priceId);
    
    const user = await getCurrentUser();
    if (user?.email) {
      createPayment(priceId, user.email);
    } else {
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
      features: [
        "Funis ilimitados",
        "Todos os elementos",
        "Compartilhamento por Link",
        "Sistema de Templates",
        "Suporte prioritário via WhatsApp",
        "Sistema de Trackeamento (Em breve)",
        "Sistema de Metrificação de Resultados",
        "Dashboard com Métricas Reais"
      ],
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
      features: [
        "Funis ilimitados",
        "Todos os elementos",
        "Compartilhamento por Link",
        "Sistema de Templates",
        "Suporte prioritário via WhatsApp",
        "Sistema de Trackeamento (Em breve)",
        "Sistema de Metrificação de Resultados",
        "Dashboard com Métricas Reais",
        "30% de desconto no valor"
      ],
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: 'rgb(6, 214, 160)' }} />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white border-b transition-colors duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-green-600" style={{ color: 'rgb(6, 214, 160)' }} />
            <span className="text-2xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Olá, {userProfile?.name || user?.email?.split('@')[0] || 'Usuário'}!
            </span>
            <Button variant="outline" onClick={() => navigate('/account')} size="sm">
              <User className="w-4 h-4 mr-2" />
              Conta
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Crown className="w-16 h-16 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Acesso Exclusivo para Assinantes
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Infelizmente, você está utilizando o plano gratuito e não tem acesso à funcionalidade de 
            <strong> Templates Prontos</strong>. Para desbloquear esta funcionalidade e muito mais, 
            faça upgrade para um dos nossos planos premium.
          </p>
          <div className="bg-blue-50 p-6 rounded-lg mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🎯 O que você ganha com os Templates Prontos:
            </h3>
            <ul className="text-blue-700 text-left space-y-2">
              <li>• Acesso a dezenas de funis profissionais</li>
              <li>• Templates testados e otimizados</li>
              <li>• Download direto para seu projeto</li>
              <li>• Economia de tempo na criação</li>
            </ul>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
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
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              ✨ Upgrade Agora e Desbloqueie Tudo!
            </h3>
            <p className="text-green-700">
              Acesso imediato a todos os templates, funis ilimitados e suporte prioritário.
            </p>
          </div>
          
          <p className="text-gray-600 mb-4">
            🔒 Pagamento seguro • Processamento via Stripe • Suporte em português
          </p>
        </div>
      </main>

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

export default TemplatesUpgrade;
