import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Target, Users, Zap, TrendingUp, Shield, Globe, MessageCircle, LayoutTemplate, BarChart3, Share2, DollarSign, Brain, Play, Menu, Crown, ArrowRight } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { useState, useEffect } from "react";
import EmailCaptureDialog from "@/components/EmailCaptureDialog";
import { useSEO } from "@/hooks/useSEO";
import Footer from "@/components/Footer";

const Index = () => {
  const { createPayment, getCurrentUser, loading } = usePayment();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load Wistia scripts
  useEffect(() => {
    // Load Wistia player script
    const playerScript = document.createElement('script');
    playerScript.src = 'https://fast.wistia.com/player.js';
    playerScript.async = true;
    document.head.appendChild(playerScript);

    // Load Wistia embed script
    const embedScript = document.createElement('script');
    embedScript.src = 'https://fast.wistia.com/embed/ccb04hxoon.js';
    embedScript.async = true;
    embedScript.type = 'module';
    document.head.appendChild(embedScript);

    // Add Wistia styles
    const style = document.createElement('style');
    style.textContent = `
      wistia-player[media-id='ccb04hxoon']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/ccb04hxoon/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top: 56.25%; 
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.head.removeChild(playerScript);
      document.head.removeChild(embedScript);
      document.head.removeChild(style);
    };
  }, []);

  // SEO Configuration
  useSEO({
    title: "WiizeFlow - Crie Funis Visuais e Aumente Sua Conversão",
    description: "Transforme sua estratégia digital com funis visuais, rastreamento inteligente e templates prontos. Crie seu funil com o WiizeFlow.",
    keywords: "funis visuais, wiizeflow, mapa mental, automação de marketing, funil de vendas visual",
    ogTitle: "WiizeFlow - A Ferramenta Brasileira para Funis Visuais",
    ogDescription: "Primeira plataforma brasileira para criar funis visuais profissionais. Aumente suas conversões em 268%.",
    canonicalUrl: window.location.href
  });

  const handlePlanClick = async (priceId: string) => {
    console.log('Plan clicked with priceId:', priceId);
    
    const user = await getCurrentUser();
    if (user?.email) {
      console.log('User logged in, using session email:', user.email);
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const plans = [
    {
      name: "Free",
      price: "R$0",
      period: "/mês",
      funnelLimit: "Até 2 funis",
      features: [
        "Até 2 funis",
        "Elementos básicos",
        "Compartilhamento por Link",
        "Suporte por email"
      ],
      buttonText: "Começar Grátis",
      popular: false,
      color: "gray",
      priceId: "free"
    },
    {
      name: "Mensal", 
      price: "R$47",
      period: "/mês",
      funnelLimit: "Funis ilimitados",
      features: [
        "Funis ilimitados",
        "Todos os elementos",
        "Compartilhamento por Link",
        "Sistema de Templates",
        "Suporte prioritário via WhatsApp",
        "Integração com ferramentas",
        "Sistema de Trackeamento (Em breve)"
      ],
      buttonText: "Assinar Mensal",
      popular: false,
      color: "green",
      priceId: "price_1RdhpHG1GdQ2ZjmFmYXfEFJa"
    },
    {
      name: "Anual",
      price: "R$397",
      period: "/ano",
      originalPrice: "R$564",
      savings: "30% OFF",
      funnelLimit: "Funis ilimitados",
      features: [
        "Funis ilimitados",
        "Todos os elementos",
        "Compartilhamento por Link",
        "Sistema de Templates",
        "Suporte prioritário via WhatsApp",
        "Integração com ferramentas",
        "Sistema de Trackeamento (Em breve)",
        "30% de desconto no valor"
      ],
      buttonText: "Assinar Anual",
      popular: true,
      color: "green",
      priceId: "price_1RdhqYG1GdQ2ZjmFlAOaBr4A"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-[rgb(6,214,160)]" />
            <span className="text-2xl font-bold text-[#2B2D42]">WiizeFlow</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/auth'}
              className="text-[#2B2D42] hover:text-[rgb(6,214,160)]"
            >
              Login
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/contact'}
              className="text-[#2B2D42] hover:text-[rgb(6,214,160)]"
            >
              Contato
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('pricing')}
              className="text-[#2B2D42] hover:text-[rgb(6,214,160)]"
            >
              Preços
            </Button>
            <Button 
              className="bg-[rgb(6,214,160)] hover:bg-[rgb(5,195,148)] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              onClick={() => window.location.href = '/auth'}
            >
              Comece Agora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-4">
            <Button 
              variant="ghost" 
              className="w-full text-left justify-start"
              onClick={() => window.location.href = '/auth'}
            >
              Login
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-left justify-start"
              onClick={() => window.location.href = '/contact'}
            >
              Contato
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-left justify-start"
              onClick={() => scrollToSection('pricing')}
            >
              Preços
            </Button>
            <Button 
              className="w-full bg-[rgb(6,214,160)] hover:bg-[rgb(5,195,148)] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              onClick={() => window.location.href = '/auth'}
            >
              Comece Agora
            </Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#F4FDF9] to-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Usado por centenas de empresários brasileiros
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-[#2B2D42] leading-tight">
                Triplique suas<br />
                Vendas com<br />
                <span className="text-[rgb(6,214,160)]">Funis Visuais</span>
              </h1>
              
              <h2 className="text-xl lg:text-2xl text-gray-600 font-medium">
                Visualize. Construa. Converta.
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                A primeira ferramenta brasileira que transforma sua estratégia de marketing digital em funis visuais profissionais. Otimize conversões, aumente ROI e escale seu negócio com automação inteligente.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-[rgb(6,214,160)] hover:bg-[rgb(5,195,148)] text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                  onClick={() => window.location.href = '/auth'}
                >
                  Criar Meu Funil de Vendas Grátis
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-[rgb(6,214,160)] text-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)] hover:text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                  onClick={() => scrollToSection('demo')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Ver Demonstração
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2B2D42]">100+</div>
                  <div className="text-sm text-gray-600">Funis Criados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2B2D42]">268%</div>
                  <div className="text-sm text-gray-600">+ Conversões</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2B2D42]">Poucos</div>
                  <div className="text-sm text-gray-600">Cliques</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-[rgb(6,214,160)] rounded-lg mx-auto">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3 text-center font-medium">
                      Editor Visual Drag & Drop
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 text-center font-medium">
                      Sistema simples e prático de usar
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 text-center font-medium">
                      Análise de Performance
                    </div>
                  </div>
                  
                  <p className="text-center text-sm text-gray-600 mt-4">
                    Interface 100% intuitiva - Sem conhecimento técnico
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demonstração - Video da Wistia */}
      <section id="demo" className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#2B2D42] mb-8">
            Veja como funciona na prática
          </h2>
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-2 md:p-8">
              <div className="relative w-full">
                <wistia-player 
                  media-id="ccb04hxoon" 
                  seo="false" 
                  aspect="1.7777777777777777"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problemas */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2B2D42] text-center mb-12">
            Você ainda está perdendo leads por causa disso?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, text: "Funis bagunçados e sem rastreio" },
              { icon: Zap, text: "Ferramentas difíceis de integrar" },
              { icon: Users, text: "Falta de visão clara da jornada do cliente" },
              { icon: DollarSign, text: "Soluções genéricas, caras e não intuitivas" },
              { icon: Target, text: "Demora para tirar uma ideia do papel" },
              { icon: Share2, text: "Não consegue compartilhar a visão do funil com o time ou cliente" }
            ].map((item, index) => (
              <Card key={index} className="p-6 text-center border-red-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-0">
                  <item.icon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-700">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solução */}
      <section className="py-16 bg-[#F4FDF9]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-[#2B2D42] mb-6">
                A Solução — O que é WiizeFlow
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                O WiizeFlow é a única plataforma brasileira criada exclusivamente para{" "}
                <strong>construir funis e mapas mentais de vendas visuais</strong>, com foco em performance e simplicidade.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nossa ferramenta foi desenvolvida pensando nas necessidades específicas do mercado brasileiro, oferecendo uma interface intuitiva, suporte em português e templates otimizados para diferentes tipos de negócio.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="flex items-center justify-center w-64 h-64 bg-white rounded-xl">
                <Target className="w-32 h-32 text-[rgb(6,214,160)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2B2D42] text-center mb-12">
            Benefícios Reais do WiizeFlow
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: "100% Brasileira", desc: "Plataforma desenvolvida no Brasil" },
              { icon: MessageCircle, title: "Suporte em Português", desc: "Atendimento especializado" },
              { icon: Target, title: "Exclusiva para Funis", desc: "Focada em mapas mentais e funis" },
              { icon: LayoutTemplate, title: "Templates Prontos", desc: "Modelos otimizados para conversão" },
              { icon: BarChart3, title: "Sistema de Tracking", desc: "Rastreamento inteligente (em breve)" },
              { icon: Share2, title: "Compartilhamento", desc: "Colaboração com terceiros" },
              { icon: DollarSign, title: "Acessível", desc: "Preço justo para qualquer negócio" },
              { icon: Brain, title: "Interface Simples", desc: "Intuitiva e fácil de usar" }
            ].map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-0">
                  <benefit.icon className="w-12 h-12 text-[rgb(6,214,160)] mx-auto mb-4" />
                  <h3 className="font-semibold text-[#2B2D42] mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2B2D42] text-center mb-12">
            Como funciona (passo a passo)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              { step: "1", title: "Crie sua conta", desc: "Cadastro simples e rápido" },
              { step: "2", title: "Crie seu funil visual", desc: "Use nossos templates ou comece do zero" },
              { step: "3", title: "Personalize com drag & drop", desc: "Interface intuitiva e poderosa" },
              { step: "4", title: "Compartilhe e visualize", desc: "Gere links e analise resultados" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <Card className="text-center p-6">
                  <CardContent className="pt-0">
                    <div className="w-12 h-12 bg-[rgb(6,214,160)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-[#2B2D42] mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
                
                {/* Arrow connecting cards - hidden on last item and mobile */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-[rgb(6,214,160)]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2B2D42] text-center mb-12">
            Para quem é o WiizeFlow
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Agências de Marketing", desc: "Otimize campanhas e apresente resultados visuais" },
              { icon: Brain, title: "Infoprodutores", desc: "Mapeie jornadas de venda complexas" },
              { icon: Users, title: "Freelancers", desc: "Profissionalize seus projetos" },
              { icon: TrendingUp, title: "Pequenas Empresas", desc: "Escale suas vendas com organização" }
            ].map((useCase, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-0">
                  <useCase.icon className="w-12 h-12 text-[rgb(6,214,160)] mx-auto mb-4" />
                  <h3 className="font-semibold text-[#2B2D42] mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 text-sm">{useCase.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prova social */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2B2D42] text-center mb-12">
            O que nossos clientes dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Carlos Silva",
                role: "Agência Digital",
                text: "O WiizeFlow revolucionou nossa forma de apresentar estratégias para clientes. Aumentamos nossa taxa de fechamento em 40%.",
                rating: 5
              },
              {
                name: "Marina Costa",
                role: "Infoprodutora",
                text: "Finalmente uma ferramenta brasileira que entende nossas necessidades. Criamos funis em minutos, não horas.",
                rating: 5
              },
              {
                name: "Roberto Santos",
                role: "E-commerce",
                text: "A visualização clara da jornada do cliente nos ajudou a identificar gargalos e aumentar conversões em 180%.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-[#2B2D42]">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[rgb(6,214,160)]">98%</div>
              <div className="text-gray-600">NPS</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[rgb(6,214,160)]">100+</div>
              <div className="text-gray-600">Funis Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[rgb(6,214,160)]">268%</div>
              <div className="text-gray-600">Aumento Médio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparativo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2B2D42] text-center mb-12">
            Por que escolher WiizeFlow?
          </h2>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-[#F4FDF9]">
                  <th className="p-4 text-left font-semibold text-[#2B2D42]">Recurso</th>
                  <th className="p-4 text-center font-semibold text-[rgb(6,214,160)]">WiizeFlow</th>
                  <th className="p-4 text-center font-semibold text-gray-600">Miro</th>
                  <th className="p-4 text-center font-semibold text-gray-600">Funnelytics</th>
                  <th className="p-4 text-center font-semibold text-gray-600">Notion</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Plataforma 100% Brasileira", "✅", "❌", "❌", "❌"],
                  ["Suporte em Português", "✅", "⚠️", "⚠️", "❌"],
                  ["Foco em Funis e Mapas Mentais", "✅", "❌", "✅", "❌"],
                  ["Templates Prontos", "✅", "❌", "✅", "❌"],
                  ["Sistema de Trackeamento Integrado", "✅ (em breve)", "❌", "❌", "❌"],
                  ["Compartilhamento Visual com Terceiros", "✅", "⚠️", "⚠️", "✅"],
                  ["Acessível e Simples de Usar", "✅", "⚠️", "⚠️", "⚠️"]
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-4 font-medium text-[#2B2D42]">{row[0]}</td>
                    <td className="p-4 text-center text-lg">{row[1]}</td>
                    <td className="p-4 text-center text-lg">{row[2]}</td>
                    <td className="p-4 text-center text-lg">{row[3]}</td>
                    <td className="p-4 text-center text-lg">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-6">
            {/* WiizeFlow Card */}
            <Card className="border-2 border-[rgb(6,214,160)] bg-[#F4FDF9]">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-[rgb(6,214,160)] flex items-center justify-center">
                  <Target className="w-6 h-6 mr-2" />
                  WiizeFlow
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[rgb(6,214,160)] mr-2" />
                    <span>100% Brasileiro</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[rgb(6,214,160)] mr-2" />
                    <span>Suporte em PT</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[rgb(6,214,160)] mr-2" />
                    <span>Foco em Funis</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[rgb(6,214,160)] mr-2" />
                    <span>Templates</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[rgb(6,214,160)] mr-2" />
                    <span>Trackeamento</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[rgb(6,214,160)] mr-2" />
                    <span>Fácil de Usar</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitors Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Miro */}
              <Card className="border border-gray-200">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg font-bold text-yellow-600 flex items-center justify-center">
                    Miro
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center">
                      <X className="w-3 h-3 text-red-500 mr-2" />
                      <span>Não BR</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-2">⚠️</span>
                      <span>Suporte limitado</span>
                    </div>
                    <div className="flex items-center">
                      <X className="w-3 h-3 text-red-500 mr-2" />
                      <span>Não foca em funis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Funnelytics */}
              <Card className="border border-gray-200">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg font-bold text-blue-700 flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-700 rounded mr-2"></div>
                    Funnelytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center">
                      <X className="w-3 h-3 text-red-500 mr-2" />
                      <span>Não BR</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-2">⚠️</span>
                      <span>Suporte limitado</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-3 h-3 text-green-500 mr-2" />
                      <span>Foca em funis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="pricing" className="py-16 bg-[#F4FDF9]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2B2D42] text-center mb-12">
            Escolha o plano ideal para seu negócio
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-[rgb(6,214,160)] scale-105' : 'border border-gray-200'} hover:shadow-lg transition-all duration-200`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[rgb(6,214,160)] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-[#2B2D42] mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-[#2B2D42]">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
                      <Badge className="bg-[#FFD166] text-[#2B2D42] font-bold">
                        {plan.savings}
                      </Badge>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {plan.funnelLimit}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-[rgb(6,214,160)] mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => plan.priceId === 'free' ? window.location.href = '/auth' : handlePlanClick(plan.priceId)}
                    disabled={loading}
                    className="w-full bg-[rgb(6,214,160)] hover:bg-[rgb(5,195,148)] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                  >
                    {loading ? "Processando..." : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <div className="bg-[#FFD166] bg-opacity-20 p-6 rounded-lg inline-block">
              <Shield className="w-8 h-8 text-[rgb(6,214,160)] mx-auto mb-2" />
              <h3 className="font-semibold text-[#2B2D42] mb-1">🎯 Garantia de 30 Dias</h3>
              <p className="text-gray-600">
                Se não aumentar suas conversões em 30 dias, devolvemos 100% do seu dinheiro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risco Zero */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#2B2D42] mb-4">
            Sem cartão. Sem compromisso.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Comece agora mesmo e veja a diferença em seus resultados.
          </p>
          <Button 
            size="lg"
            className="bg-[rgb(6,214,160)] hover:bg-[rgb(5,195,148)] text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            onClick={() => window.location.href = '/auth'}
          >
            Começar Gratuitamente
          </Button>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-[rgb(6,214,160)] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Não perca mais tempo com funis desorganizados
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de empresários que já transformaram seus negócios com o WiizeFlow
          </p>
          <Button 
            size="lg"
            className="bg-white hover:bg-gray-100 text-[rgb(6,214,160)] font-bold px-8 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            onClick={() => window.location.href = '/auth'}
          >
            Criar Funil Agora
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2B2D42] text-center mb-12">
            Perguntas Frequentes
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {[
                {
                  question: "O plano gratuito tem limitações?",
                  answer: "O plano gratuito permite criar até 2 funis com elementos básicos e compartilhamento por link. É perfeito para testar a plataforma."
                },
                {
                  question: "Posso cancelar minha assinatura a qualquer momento?",
                  answer: "Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais. Não há contratos de fidelidade."
                },
                {
                  question: "Como funciona o suporte técnico?",
                  answer: "Oferecemos suporte por email para todos os usuários e suporte prioritário via WhatsApp para assinantes dos planos pagos."
                },
                {
                  question: "O WiizeFlow se integra com outras ferramentas?",
                  answer: "Sim, estamos constantemente adicionando novas integrações. Atualmente suportamos as principais ferramentas de marketing e vendas."
                },
                {
                  question: "Quando o sistema de trackeamento estará disponível?",
                  answer: "O sistema de trackeamento integrado está em desenvolvimento e será lançado nos próximos meses para todos os usuários dos planos pagos."
                },
                {
                  question: "Posso compartilhar meus funis com minha equipe?",
                  answer: "Sim, todos os funis podem ser compartilhados através de links únicos, permitindo colaboração com sua equipe e clientes."
                }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-[#2B2D42] font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Componente Footer reutilizado */}
      <Footer />

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
