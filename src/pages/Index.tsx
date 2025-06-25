import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Target, Zap, Users, ArrowRight, BarChart3, 
         MousePointer, Palette, Download, Eye, Lightbulb, Trophy, Shield, 
         Crown, PlayCircle, TrendingUp, Clock, DollarSign } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { useState } from "react";
import EmailCaptureDialog from "@/components/EmailCaptureDialog";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  const { createPayment, getCurrentUser, loading } = usePayment();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string>("");

  // SEO otimizado para conversão
  useSEO({
    title: "WiizeFlow - Ferramenta de Funis de Vendas Visual | Aumente suas Conversões em 300%",
    description: "Crie funis de vendas visuais profissionais com drag-and-drop. Aumente suas conversões, otimize sua estratégia de marketing digital e triplique suas vendas. Templates prontos + Editor visual + Análises detalhadas. Teste grátis!",
    keywords: "funil de vendas, marketing digital, conversão, CRM, automação de vendas, estratégia de vendas, landing page, lead generation, marketing automation, vendas online, ROI, otimização conversão, jornada do cliente, pipeline vendas, growth hacking, inbound marketing, outbound marketing, vendas B2B, vendas B2C, e-commerce, infoprodutos, curso online, consultoria, agência marketing, empreendedorismo, negócio digital, monetização, receita recorrente, LTV, CAC, métricas vendas, dashboard vendas, relatórios vendas, análise performance",
    ogTitle: "WiizeFlow - Triplique suas Vendas com Funis Visuais Profissionais",
    ogDescription: "A primeira ferramenta brasileira para criar funis de vendas visuais. Aumente conversões em 300%, economize 15h/semana. +5.000 empresários já usam. Teste grátis!",
    ogImage: "https://lovable.dev/opengraph-image-p98pqg.png",
    canonicalUrl: "https://wiizeflow.com/",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "WiizeFlow",
      "description": "Ferramenta visual para criação de funis de vendas profissionais com drag-and-drop",
      "url": "https://wiizeflow.com",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": [
        {
          "@type": "Offer",
          "name": "Plano Gratuito",
          "price": "0",
          "priceCurrency": "BRL",
          "description": "Até 2 funis com funcionalidades básicas"
        },
        {
          "@type": "Offer",
          "name": "Plano Mensal",
          "price": "47",
          "priceCurrency": "BRL",
          "description": "Funis ilimitados com todas as funcionalidades"
        },
        {
          "@type": "Offer",
          "name": "Plano Anual",
          "price": "397",
          "priceCurrency": "BRL",
          "description": "Plano anual com 30% de desconto e benefícios exclusivos"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "5000",
        "bestRating": "5"
      },
      "publisher": {
        "@type": "Organization",
        "name": "WiizeFlow",
        "logo": {
          "@type": "ImageObject",
          "url": "https://wiizeflow.com/lovable-uploads/7f16165c-d306-4571-8b04-5c0136a778b4.png"
        }
      }
    }
  });

  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  const handlePlanClick = async (priceId: string) => {
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

  const handlePricingScroll = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const plans = [
    {
      name: "Mensal",
      price: "R$47",
      period: "/mês",
      originalPrice: null,
      savings: null,
      funnelLimit: "Ilimitados",
      features: [
        "Funis ilimitados",
        "Todos os templates inclusos",
        "Editor visual completo",
        "Exportar como imagem/PDF",
        "Suporte prioritário",
        "Análises detalhadas",
        "Histórico de versões"
      ],
      restrictions: [],
      buttonText: "Assinar Mensal",
      popular: false,
      color: "blue",
      priceId: "price_1RdfWZQFkphRyjSA3oNlNfiK"
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
        "Integração com ferramentas externas"
      ],
      restrictions: [],
      buttonText: "Assinar Anual",
      popular: true,
      color: "green",
      priceId: "price_1RdfX2QFkphRyjSANdSPAZUq"
    }
  ];

  const features = [
    {
      icon: <MousePointer className="w-8 h-8 text-blue-600" />,
      title: "Editor Visual Intuitivo",
      description: "Arraste, solte e conecte elementos com facilidade. Interface 100% visual, sem necessidade de conhecimento técnico."
    },
    {
      icon: <Palette className="w-8 h-8 text-green-600" />,
      title: "Templates Profissionais",
      description: "Biblioteca completa com templates testados e otimizados para diferentes segmentos e objetivos de negócio."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Análise de Performance",
      description: "Visualize métricas importantes e identifique gargalos em sua estratégia de vendas."
    },
    {
      icon: <Download className="w-8 h-8 text-orange-600" />,
      title: "Exportação Flexível",
      description: "Exporte seus funis em alta qualidade como PDF, PNG ou compartilhe online com sua equipe."
    },
    {
      icon: <Eye className="w-8 h-8 text-red-600" />,
      title: "Visualização Clara",
      description: "Entenda toda a jornada do cliente de forma visual, identificando oportunidades de melhoria."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Criação Rápida",
      description: "Crie funis profissionais em minutos usando nossos templates e ferramentas automatizadas."
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      title: "Aumente suas Conversões em até 300%",
      description: "Identifique exatamente onde seus clientes abandonam o processo e otimize cada etapa da jornada."
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "Economize 15+ Horas por Semana",
      description: "Pare de usar planilhas confusas e ferramentas complexas. Crie estratégias visuais em minutos."
    },
    {
      icon: <DollarSign className="w-6 h-6 text-purple-600" />,
      title: "ROI Comprovado",
      description: "Nossos clientes veem retorno do investimento já no primeiro mês de uso da plataforma."
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "CEO, E-commerce de Moda",
      content: "Conseguimos aumentar nossas conversões em 280% após mapear nosso funil no WiizeFlow. A visualização nos mostrou gargalos que nem sabíamos que existiam.",
      rating: 5,
      result: "+280% conversões"
    },
    {
      name: "João Santos",
      role: "Consultor de Marketing Digital",
      content: "Uso o WiizeFlow com todos os meus clientes. Em 6 meses, economizei mais de R$ 15.000 que gastaria com outras ferramentas.",
      rating: 5,
      result: "R$ 15k economizados"
    },
    {
      name: "Ana Costa",
      role: "Fundadora, SaaS B2B",
      content: "Nossa equipe finalmente consegue visualizar e entender nossa estratégia completa. O alinhamento melhorou 100%.",
      rating: 5,
      result: "Equipe alinhada"
    }
  ];

  const getCardStyle = (plan: any) => {
    if (plan.popular) {
      return 'border-2 border-green-500 scale-105 relative shadow-xl';
    }
    return 'border border-gray-200 shadow-lg';
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/7f16165c-d306-4571-8b04-5c0136a778b4.png" 
              alt="WiizeFlow - Ferramenta de Funis de Vendas" 
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handlePricingScroll}>
              Preços
            </Button>
            <Button variant="ghost" onClick={() => window.location.href = '/contact'}>
              Contato
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/auth'}>
              Login
            </Button>
            <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Otimizado para SEO */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <PlayCircle className="w-4 h-4 mr-2" />
                Usado por 5.000+ empresários brasileiros
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Triplique suas Vendas com 
                <span className="text-blue-600 block">Funis Visuais</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                A primeira ferramenta brasileira que transforma sua estratégia de marketing digital em 
                funis visuais profissionais. Otimize conversões, aumente ROI e 
                escale seu negócio com automação inteligente.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Criar Meu Funil de Vendas Grátis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-2 hover:bg-gray-50"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Ver Demonstração
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">5.000+</div>
                  <div className="text-sm text-gray-600">Funis Criados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">300%</div>
                  <div className="text-sm text-gray-600">+ Conversões</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">15min</div>
                  <div className="text-sm text-gray-600">Para Criar</div>
                </div>
              </div>
            </div>
            
            <div className="lg:text-center">
              <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 h-80 rounded-lg flex flex-col items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                  <div className="relative z-10 text-center">
                    <BarChart3 className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                    <div className="space-y-2">
                      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">Editor Visual Drag & Drop</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">Templates de Conversão</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">Análise de Performance</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Interface 100% intuitiva - Sem conhecimento técnico
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Otimizado com palavras-chave de dor */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Por que 87% dos negócios digitais falham?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              O problema não é falta de tráfego ou produto ruim. É a ausência de uma estratégia visual clara para converter visitantes em clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-l-4 border-red-500">
              <div className="text-6xl mb-4">📉</div>
              <h3 className="text-xl font-semibold mb-3 text-red-600">Baixa Taxa de Conversão</h3>
              <p className="text-gray-600">Você investe em marketing digital mas não consegue converter visitantes em clientes pagantes. O funil está furado.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-l-4 border-orange-500">
              <div className="text-6xl mb-4">🤯</div>
              <h3 className="text-xl font-semibold mb-3 text-orange-600">Jornada do Cliente Confusa</h3>
              <p className="text-gray-600">Sua equipe não entende o processo de vendas porque não existe uma visualização clara da estratégia.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-l-4 border-yellow-500">
              <div className="text-6xl mb-4">💸</div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-600">ROI Negativo</h3>
              <p className="text-gray-600">Você gasta com tráfego pago mas não sabe onde os leads abandonam sua jornada de compra.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-xl border border-red-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Resultado: Prejuízo de R$ 50.000+ por ano em oportunidades perdidas
              </h3>
              <p className="text-lg text-gray-700">
                Esse é o valor médio que empreendedores perdem anualmente por não ter clareza sobre sua estratégia de conversão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Conheça o <span className="text-blue-600">WiizeFlow</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A solução completa para mapear, visualizar e otimizar toda sua estratégia de vendas de forma simples e profissional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-200">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Cards brancos com conteúdo visível */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Resultados Reais dos Nossos Clientes
            </h2>
            <p className="text-xl text-green-100">
              Empresários como você já transformaram seus negócios com o WiizeFlow
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="bg-green-100 p-4 rounded-lg w-fit mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              variant="secondary"
              className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-lg"
            >
              Quero Esses Resultados Também
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Mais de 5.000 empresários já transformaram seus negócios
            </h2>
            <p className="text-xl text-gray-600">
              Veja os resultados reais de quem usa o WiizeFlow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium w-fit mb-4">
                    {testimonial.result}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Escolha o Plano Ideal para Seu Negócio
            </h2>
            <p className="text-xl text-gray-600">
              Comece grátis e escale conforme seu negócio cresce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`${getCardStyle(plan)} hover:shadow-2xl transition-all duration-200`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                      <Crown className="w-4 h-4 mr-2" />
                      Mais Escolhido
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>
                  
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
                      <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                        {plan.savings}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 font-medium">
                    {plan.funnelLimit} funis
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handlePlanClick(plan.priceId)}
                    disabled={loading}
                    className={`w-full py-3 text-lg font-medium ${getButtonStyle(plan)} shadow-lg hover:shadow-xl transition-all`}
                  >
                    {loading && plan.priceId === selectedPriceId ? "Processando..." : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Nova seção explicativa sobre acesso */}
          <div className="text-center mt-12">
            <div className="bg-blue-50 p-6 rounded-lg max-w-2xl mx-auto mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                🎯 Garantia de 30 Dias
              </h3>
              <p className="text-blue-700">
                Se não aumentar suas conversões em 30 dias, devolvemos 100% do seu dinheiro.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg max-w-3xl mx-auto border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                📧 Como Acessar Após a Compra
              </h3>
              <div className="text-green-700 space-y-2">
                <p className="font-medium">
                  ✅ <strong>Já tem conta?</strong> Use o mesmo email para fazer login e ter acesso imediato aos benefícios premium
                </p>
                <p className="font-medium">
                  ✅ <strong>Não tem conta?</strong> Após a compra, crie sua conta usando o mesmo email da compra para ativar automaticamente todos os benefícios
                </p>
                <p className="text-sm text-green-600 mt-3">
                  💡 <em>É importante usar o mesmo email da compra para que o sistema reconheça automaticamente sua assinatura</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Triplicar suas Vendas?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a mais de 5.000 empresários que já transformaram seus negócios com funis visuais profissionais
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl"
            >
              Começar Gratuitamente Agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-blue-200">
              ✓ Sem cartão de crédito ✓ Acesso imediato ✓ Suporte incluído
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Preciso ter conhecimento técnico para usar?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Absolutamente não! O WiizeFlow foi desenvolvido para ser usado por qualquer pessoa. Nosso editor visual funciona com arrastar e soltar, sem necessidade de código.</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Comprei sem ter conta, como acesso meus benefícios?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Muito simples! Crie sua conta usando o mesmo email que você usou na compra. O sistema reconhecerá automaticamente sua assinatura e ativará todos os benefícios premium na sua conta.</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Posso cancelar a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Sim! Você pode cancelar sua assinatura a qualquer momento diretamente na plataforma. Não há contratos ou taxas de cancelamento.</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>O que acontece com meus funis se eu cancelar?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Você pode exportar todos os seus funis em PDF ou imagem antes de cancelar. Seus dados ficam seguros e você mantém acesso aos arquivos exportados.</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Vocês oferecem suporte em português?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Sim! Nosso suporte é 100% em português brasileiro, com uma equipe especializada pronta para ajudar via chat, email e vídeo-chamada.</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Posso usar o WiizeFlow para qualquer tipo de negócio?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Sim! Temos templates para e-commerce, infoprodutos, consultoria, SaaS, agências, cursos online e muito mais. A ferramenta se adapta a qualquer modelo de negócio.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/7f16165c-d306-4571-8b04-5c0136a778b4.png" 
                  alt="WiizeFlow Logo" 
                  className="w-8 h-8"
                />
                <span className="text-2xl font-bold">WiizeFlow</span>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                A primeira plataforma brasileira para criar funis de vendas visuais e profissionais. 
                Transforme sua estratégia de marketing em resultados concretos.
              </p>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <strong>Vendas:</strong> vendas@wiizeflow.com
                </p>
                <p className="text-gray-300">
                  <strong>Suporte:</strong> suporte@wiizeflow.com
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Início</a></li>
                <li><a href="/pricing" className="text-gray-300 hover:text-blue-400 transition-colors">Planos</a></li>
                <li><a href="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">Dashboard</a></li>
                <li><a href="/account" className="text-gray-300 hover:text-blue-400 transition-colors">Minha Conta</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contato</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors">Termos de Uso</a></li>
                <li><a href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} WiizeFlow. Todos os direitos reservados. 
              Desenvolvido no Brasil para empreendedores brasileiros.
            </p>
          </div>
        </div>
      </footer>

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

export default Index;
