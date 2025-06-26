
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSEO } from '@/hooks/useSEO';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Target, 
  Clock, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  Menu,
  X,
  Play,
  TrendingUp,
  Eye,
  Layers,
  MapPin,
  Workflow
} from 'lucide-react';
import { useState } from 'react';

const Vendas = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useSEO({
    title: "WiizeFlow - Crie Funis Visuais e Aumente Sua Conversão",
    description: "Transforme suas ideias em funis visuais profissionais. Visualize, construa e converta com a ferramenta brasileira de automação de marketing mais intuitiva.",
    keywords: "funis visuais, ferramenta de funil, automação de marketing, wiizeflow, mapas mentais, conversão, vendas",
    ogTitle: "WiizeFlow - Crie Funis Visuais e Aumente Sua Conversão",
    ogDescription: "A ferramenta brasileira para criar funis visuais profissionais. Comece gratuitamente!",
    canonicalUrl: `${window.location.origin}/vendas`
  });

  const pricingPlans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "Até 3 funis",
        "Elementos básicos",
        "Exportação em PNG",
        "Suporte por email"
      ],
      buttonText: "Começar Grátis",
      highlighted: false
    },
    {
      name: "Pro",
      price: "R$ 29",
      period: "/mês",
      description: "Para profissionais",
      features: [
        "Funis ilimitados",
        "Todos os elementos",
        "Exportação PDF/PNG",
        "Templates premium",
        "Suporte prioritário",
        "Integração com ferramentas"
      ],
      buttonText: "Assinar Pro",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "R$ 299",
      period: "/ano",
      description: "Melhor valor - 2 meses grátis",
      features: [
        "Tudo do Pro",
        "White label",
        "API personalizada",
        "Suporte 24/7",
        "Consultoria inclusa",
        "Onboarding personalizado"
      ],
      buttonText: "Assinar Enterprise",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">WiizeFlow</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/auth')}
                style={{ backgroundColor: '#06D6A0' }}
                className="hover:bg-yellow-400 transition-colors"
              >
                Comece Agora
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Login
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/contact')}
                className="text-gray-700 hover:bg-gray-50"
              >
                Contato
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-4">
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={() => navigate('/auth')}
                  style={{ backgroundColor: '#06D6A0' }}
                  className="hover:bg-yellow-400 transition-colors w-full"
                >
                  Comece Agora
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/auth')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full"
                >
                  Login
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/contact')}
                  className="text-gray-700 hover:bg-gray-50 w-full"
                >
                  Contato
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F4FDF9' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#2B2D42' }}>
              Transforme suas ideias em um
              <span className="block" style={{ color: '#06D6A0' }}>funil visual profissional</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto font-light">
              Visualize. Construa. Converta.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              style={{ backgroundColor: '#06D6A0' }}
              className="hover:bg-yellow-400 transition-colors text-lg px-8 py-3"
            >
              Comece gratuitamente agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {/* Hero Image */}
            <div className="mt-16 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-2xl p-4">
                <img 
                  src="/lovable-uploads/7c4b2ed5-41bf-433e-9d68-b3e7b35f7ae1.png" 
                  alt="Interface do WiizeFlow mostrando funis visuais profissionais"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#2B2D42' }}>
            Veja como funciona na prática
          </h2>
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-lg text-green-700">Demonstração do produto em vídeo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#2B2D42' }}>
              Pare de perder vendas por não conseguir visualizar seu funil
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sabemos como é frustrante tentar organizar estratégias de marketing sem uma visão clara do processo
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8 text-red-500" />,
                title: "Estratégias desorganizadas",
                description: "Sem uma visão clara do funil, você perde oportunidades de otimização e vendas"
              },
              {
                icon: <Clock className="w-8 h-8 text-red-500" />,
                title: "Tempo perdido em reuniões",
                description: "Horas explicando processos que poderiam ser visualizados em minutos"
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-red-500" />,
                title: "Dificuldade para medir resultados",
                description: "Impossível identificar gargalos sem uma representação visual clara"
              },
              {
                icon: <Users className="w-8 h-8 text-red-500" />,
                title: "Equipe sem alinhamento",
                description: "Cada pessoa entende o processo de forma diferente"
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-red-500" />,
                title: "Crescimento limitado",
                description: "Sem clareza visual, é impossível escalar estratégias de forma eficiente"
              }
            ].map((problem, index) => (
              <Card key={index} className="text-center p-6 border-l-4 border-red-500">
                <div className="flex justify-center mb-4">
                  {problem.icon}
                </div>
                <CardTitle className="mb-4 text-lg">{problem.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {problem.description}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F4FDF9' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#2B2D42' }}>
                WiizeFlow: A primeira ferramenta brasileira para criar funis visuais profissionais
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  O WiizeFlow foi desenvolvido especialmente para profissionais brasileiros que precisam 
                  visualizar, organizar e otimizar seus funis de marketing e vendas.
                </p>
                <p>
                  Nossa plataforma permite que você crie representações visuais claras e profissionais 
                  de qualquer processo, desde a captação de leads até o fechamento de vendas.
                </p>
                <p>
                  Com uma interface intuitiva e elementos pré-configurados, você economiza tempo e 
                  garante que toda sua equipe esteja alinhada com a estratégia.
                </p>
              </div>
            </div>
            <div className="lg:order-first">
              <div className="bg-white rounded-lg shadow-xl p-4">
                <img 
                  src="/lovable-uploads/7c4b2ed5-41bf-433e-9d68-b3e7b35f7ae1.png" 
                  alt="Exemplo de funil visual criado no WiizeFlow"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#2B2D42' }}>
              Por que escolher o WiizeFlow?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" style={{ color: '#06D6A0' }} />,
                title: "Agilidade extrema",
                description: "Crie funis visuais em minutos, não em horas"
              },
              {
                icon: <Eye className="w-8 h-8" style={{ color: '#06D6A0' }} />,
                title: "Controle visual total",
                description: "Veja todo o processo de forma clara e organizada"
              },
              {
                icon: <BarChart3 className="w-8 h-8" style={{ color: '#06D6A0' }} />,
                title: "Rastreamento inteligente",
                description: "Identifique gargalos e oportunidades instantaneamente"
              },
              {
                icon: <Layers className="w-8 h-8" style={{ color: '#06D6A0' }} />,
                title: "Escalabilidade garantida",
                description: "Cresça sem perder a organização"
              },
              {
                icon: <Shield className="w-8 h-8" style={{ color: '#06D6A0' }} />,
                title: "Dados seguros",
                description: "Seus funis protegidos em servidores brasileiros"
              },
              {
                icon: <Users className="w-8 h-8" style={{ color: '#06D6A0' }} />,
                title: "Colaboração em equipe",
                description: "Trabalhe junto com sua equipe em tempo real"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <CardTitle className="mb-4 text-lg">{benefit.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {benefit.description}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFF8E2' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#2B2D42' }}>
              Como funciona em 4 passos simples
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Escolha elementos",
                description: "Selecione os componentes do seu funil na biblioteca",
                icon: <MapPin className="w-6 h-6" />
              },
              {
                step: "2", 
                title: "Arraste e conecte",
                description: "Monte seu funil arrastando elementos e criando conexões",
                icon: <Workflow className="w-6 h-6" />
              },
              {
                step: "3",
                title: "Personalize",
                description: "Adicione textos, cores e detalhes específicos",
                icon: <Eye className="w-6 h-6" />
              },
              {
                step: "4",
                title: "Compartilhe",
                description: "Exporte ou compartilhe com sua equipe",
                icon: <Users className="w-6 h-6" />
              }
            ].map((step, index) => (
              <Card key={index} className="text-center p-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold"
                  style={{ backgroundColor: '#06D6A0' }}
                >
                  {step.step}
                </div>
                <CardTitle className="mb-4 text-lg">{step.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {step.description}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#2B2D42' }}>
              Ideal para profissionais que buscam resultados
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Agências de Marketing",
                description: "Apresente estratégias de forma visual e profissional para seus clientes",
                features: ["Relatórios visuais", "Apresentações impactantes", "Projetos organizados"]
              },
              {
                title: "Produtores Digitais",
                description: "Organize seus lançamentos e campanhas com clareza total",
                features: ["Funis de lançamento", "Estratégias de upsell", "Automações visuais"]
              },
              {
                title: "Consultores e Freelancers",
                description: "Demonstre valor e organize projetos de forma profissional",
                features: ["Propostas visuais", "Metodologias claras", "Diferencial competitivo"]
              }
            ].map((audience, index) => (
              <Card key={index} className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl mb-4">{audience.title}</CardTitle>
                  <CardDescription className="text-gray-600 mb-6">
                    {audience.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {audience.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#2B2D42' }}>
              O que nossos usuários dizem
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                role: "Diretora de Marketing na AgênciaTop",
                content: "O WiizeFlow revolucionou a forma como apresentamos estratégias para nossos clientes. As apresentações ficaram muito mais claras e profissionais.",
                rating: 5
              },
              {
                name: "João Santos",
                role: "Produtor Digital",
                content: "Consigo mapear todo meu funil de lançamento em minutos. A clareza visual me ajudou a identificar gargalos que estavam prejudicando minhas vendas.",
                rating: 5
              },
              {
                name: "Ana Costa",
                role: "Consultora de Negócios",
                content: "Meus clientes ficam impressionados quando apresento as estratégias com o WiizeFlow. É uma ferramenta que demonstra profissionalismo.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#2B2D42' }}>
              WiizeFlow vs Alternativas
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-4 text-left">Funcionalidade</th>
                  <th className="border border-gray-300 p-4 text-center" style={{ backgroundColor: '#F4FDF9' }}>
                    <span className="font-bold" style={{ color: '#06D6A0' }}>WiizeFlow</span>
                  </th>
                  <th className="border border-gray-300 p-4 text-center">Miro</th>
                  <th className="border border-gray-300 p-4 text-center">Notion</th>
                  <th className="border border-gray-300 p-4 text-center">Funnelytics</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Focado em funis", "✅", "❌", "❌", "✅"],
                  ["Interface brasileira", "✅", "❌", "❌", "❌"],
                  ["Elementos pré-configurados", "✅", "❌", "❌", "✅"],
                  ["Preço acessível", "✅", "❌", "✅", "❌"],
                  ["Suporte em português", "✅", "❌", "❌", "❌"],
                  ["Fácil de usar", "✅", "❌", "✅", "❌"]
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-25" : "bg-white"}>
                    <td className="border border-gray-300 p-4 font-medium">{row[0]}</td>
                    <td className="border border-gray-300 p-4 text-center text-2xl">{row[1]}</td>
                    <td className="border border-gray-300 p-4 text-center text-2xl">{row[2]}</td>
                    <td className="border border-gray-300 p-4 text-center text-2xl">{row[3]}</td>
                    <td className="border border-gray-300 p-4 text-center text-2xl">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F4FDF9' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#2B2D42' }}>
              Planos que cabem no seu bolso
            </h2>
            <p className="text-xl text-gray-600">
              Comece grátis e escale conforme seu crescimento
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.highlighted ? 'border-2 shadow-xl scale-105' : ''}`} 
                    style={plan.highlighted ? { borderColor: '#06D6A0' } : {}}>
                {plan.highlighted && (
                  <div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm font-bold"
                    style={{ backgroundColor: '#06D6A0' }}
                  >
                    MAIS POPULAR
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    style={plan.highlighted ? { backgroundColor: '#06D6A0' } : {}}
                    onClick={() => navigate('/auth')}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Risk-Free Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFF8E2' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#2B2D42' }}>
            Risco zero para começar
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            <strong>Sem cartão. Sem compromisso.</strong> Comece gratuitamente e veja como o WiizeFlow pode transformar seu trabalho.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-600">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" style={{ color: '#06D6A0' }} />
              <span>Dados seguros</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" style={{ color: '#06D6A0' }} />
              <span>Configuração em minutos</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" style={{ color: '#06D6A0' }} />
              <span>Suporte brasileiro</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-white" style={{ backgroundColor: '#06D6A0' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para transformar seus funis?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de profissionais que já estão criando funis visuais incríveis com o WiizeFlow.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            style={{ backgroundColor: '#FFD166', color: '#2B2D42' }}
            className="hover:bg-yellow-300 transition-colors text-lg px-8 py-3 font-bold"
          >
            Criar minha conta grátis agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm opacity-75">
            Sem cartão de crédito • Configuração em 2 minutos
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#2B2D42' }}>
              Perguntas Frequentes
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "O WiizeFlow é realmente gratuito?",
                answer: "Sim! Oferecemos um plano gratuito permanente que permite criar até 3 funis com elementos básicos. É perfeito para começar e testar a ferramenta."
              },
              {
                question: "Preciso de conhecimento técnico para usar?",
                answer: "Não! O WiizeFlow foi desenvolvido para ser extremamente intuitivo. Se você sabe usar PowerPoint ou qualquer ferramenta de arrastar e soltar, você consegue usar o WiizeFlow."
              },
              {
                question: "Posso cancelar minha assinatura a qualquer momento?",
                answer: "Claro! Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento e continuar usando o plano gratuito."
              },
              {
                question: "Como funciona o suporte ao cliente?",
                answer: "Oferecemos suporte em português por email para todos os usuários. Usuários pagos têm prioridade e acesso ao suporte por chat."
              },
              {
                question: "Posso exportar meus funis?",
                answer: "Sim! Você pode exportar seus funis em PNG (todos os planos) e PDF (planos pagos). Também é possível compartilhar links para visualização."
              },
              {
                question: "Os dados ficam seguros?",
                answer: "Absolutamente! Utilizamos servidores brasileiros com certificação de segurança e criptografia de dados. Seus funis estão sempre protegidos."
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">WiizeFlow</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                A ferramenta brasileira para criar funis visuais profissionais. 
                Visualize, construa e converta com simplicidade.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Início</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Preços</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contato</Link></li>
                <li><Link to="/auth" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 WiizeFlow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Vendas;
