
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowRight, 
  Check, 
  X, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  Clock, 
  Shield,
  Star,
  Play,
  Eye,
  BarChart3,
  Menu,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";

const Vendas = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useSEO({
    title: "WiizeFlow - Crie Funis Visuais e Aumente Sua Conversão",
    description: "Transforme suas ideias em funis visuais profissionais com WiizeFlow. Visualize, construa e converta com nossa ferramenta brasileira de automação de marketing.",
    keywords: "funis visuais, ferramenta de funil, automação de marketing, wiizeflow, mapas mentais, conversão, marketing digital",
    ogTitle: "WiizeFlow - A Ferramenta Visual de Funis Mais Completa do Brasil",
    ogDescription: "Crie funis visuais profissionais em minutos. Aumente suas conversões com a ferramenta brasileira mais intuitiva do mercado.",
    canonicalUrl: `${window.location.origin}/vendas`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "WiizeFlow",
      "description": "Ferramenta brasileira para criação de funis visuais e automação de marketing",
      "url": `${window.location.origin}/vendas`,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser"
    }
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Fixa */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#06D6A0] to-[#FFD166] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="font-bold text-xl text-[#2B2D42]">WiizeFlow</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                asChild
                className="bg-[#06D6A0] hover:bg-[#FFD166] text-white px-6 py-2 transition-colors duration-300"
              >
                <Link to="/auth">Comece Agora</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/contact">Contato</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" onClick={toggleMobileMenu}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-3 space-y-3">
              <Button 
                asChild
                className="w-full bg-[#06D6A0] hover:bg-[#FFD166] text-white transition-colors duration-300"
              >
                <Link to="/auth">Comece Agora</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/auth">Login</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/contact">Contato</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#F4FDF9] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#2B2D42] mb-6 leading-tight">
              Transforme suas ideias em um 
              <span className="text-[#06D6A0]"> funil visual</span> profissional
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              <strong>Visualize. Construa. Converta.</strong>
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              A ferramenta brasileira mais intuitiva para criar funis de vendas visuais, 
              mapear jornadas do cliente e otimizar suas conversões em tempo real.
            </p>
            <Button 
              asChild
              size="lg"
              className="bg-[#06D6A0] hover:bg-[#FFD166] text-white px-8 py-4 text-lg transition-colors duration-300"
            >
              <Link to="/auth" className="flex items-center space-x-2">
                <span>Comece gratuitamente agora</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Demonstração Visual */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2B2D42] mb-4">
              Veja como funciona na prática
            </h2>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <img 
                src="/lovable-uploads/7f77a8bd-91c0-46a2-a244-4df731ee2329.png" 
                alt="Interface do WiizeFlow mostrando criação de funis visuais" 
                className="w-full rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  size="lg" 
                  className="bg-[#06D6A0] hover:bg-[#FFD166] text-white rounded-full p-4 transition-colors duration-300"
                >
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problemas que Resolve */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
              Cansado de perder vendas por não saber onde estão os gargalos?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Funis Invisíveis",
                description: "Você não consegue visualizar onde seus leads estão travando no processo de vendas"
              },
              {
                icon: Target,
                title: "Baixa Conversão",
                description: "Suas campanhas geram tráfego, mas as vendas não acompanham o investimento"
              },
              {
                icon: BarChart3,
                title: "Sem Métricas Claras",
                description: "Difícil de mensurar ROI e identificar quais etapas precisam ser otimizadas"
              },
              {
                icon: Clock,
                title: "Tempo Perdido",
                description: "Horas criando relatórios e tentando entender a jornada do cliente"
              },
              {
                icon: Users,
                title: "Equipe Desalinhada",
                description: "Marketing e vendas trabalham sem uma visão unificada do processo"
              }
            ].map((problem, index) => (
              <Card key={index} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <problem.icon className="h-12 w-12 text-red-500 mb-4" />
                  <CardTitle className="text-xl text-[#2B2D42]">{problem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {problem.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solução - O que é o WiizeFlow */}
      <section className="py-16 bg-[#F4FDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
                O WiizeFlow é a solução brasileira para 
                <span className="text-[#06D6A0]"> visualizar e otimizar</span> seus funis
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Desenvolvido especialmente para o mercado brasileiro, o WiizeFlow é uma ferramenta 
                visual que permite criar, mapear e otimizar funis de vendas de forma intuitiva e profissional.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Com nossa interface drag-and-drop, você consegue visualizar toda a jornada do seu cliente, 
                identificar gargalos e otimizar cada etapa para maximizar suas conversões.
              </p>
              <Button 
                asChild
                size="lg"
                className="bg-[#06D6A0] hover:bg-[#FFD166] text-white transition-colors duration-300"
              >
                <Link to="/auth" className="flex items-center space-x-2">
                  <span>Teste grátis por 14 dias</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div>
              <img 
                src="/lovable-uploads/97063a3d-4857-4e77-8ecc-c7c2aa270dfc.png" 
                alt="Editor de conteúdo do WiizeFlow mostrando facilidade de uso" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Principais */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
              Por que escolher o WiizeFlow?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Rapidez na Criação",
                description: "Crie funis profissionais em minutos, não em horas"
              },
              {
                icon: Eye,
                title: "Visualização Clara",
                description: "Veja toda a jornada do cliente em uma única tela"
              },
              {
                icon: Target,
                title: "Otimização Contínua",
                description: "Identifique gargalos e otimize em tempo real"
              },
              {
                icon: TrendingUp,
                title: "Aumento de Conversão",
                description: "Clientes relatam até 40% de aumento nas vendas"
              },
              {
                icon: Users,
                title: "Colaboração em Equipe",
                description: "Mantenha marketing e vendas alinhados"
              },
              {
                icon: Shield,
                title: "Dados Seguros",
                description: "Hospedagem brasileira com total segurança"
              },
              {
                icon: Clock,
                title: "Economia de Tempo",
                description: "Reduza 80% do tempo em análises e relatórios"
              },
              {
                icon: BarChart3,
                title: "Métricas Precisas",
                description: "Acompanhe KPIs e ROI de forma automatizada"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <benefit.icon className="h-12 w-12 text-[#06D6A0] mx-auto mb-4" />
                  <CardTitle className="text-lg text-[#2B2D42]">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 bg-[#FFF8E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
              Como funciona em 4 passos simples
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Cadastre-se Grátis",
                description: "Crie sua conta em menos de 1 minuto sem cartão de crédito"
              },
              {
                step: "2",
                title: "Monte seu Funil",
                description: "Use nossa interface drag-and-drop para criar seu funil visual"
              },
              {
                step: "3",
                title: "Configure as Etapas",
                description: "Defina cada ponto de contato da jornada do seu cliente"
              },
              {
                step: "4",
                title: "Otimize e Converta",
                description: "Analise métricas e otimize para maximizar conversões"
              }
            ].map((step, index) => (
              <Card key={index} className="relative text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-[#06D6A0] text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-xl text-[#2B2D42]">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Casos de Uso */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
              Ideal para diferentes tipos de negócio
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Agências de Marketing",
                description: "Crie funis para múltiplos clientes, apresente propostas visuais e comprove resultados com dados precisos.",
                features: ["Templates profissionais", "Relatórios automatizados", "Gestão multi-cliente"]
              },
              {
                title: "Produtores Digitais",
                description: "Mapeie a jornada dos seus leads desde o primeiro contato até a venda do seu produto digital.",
                features: ["Funis de lançamento", "Sequências de e-mail", "Páginas de checkout"]
              },
              {
                title: "Freelancers e Consultores",
                description: "Organize seu processo comercial e demonstre profissionalismo para conquistar novos clientes.",
                features: ["Gestão de prospects", "Processo de vendas", "Follow-up automatizado"]
              }
            ].map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-[#2B2D42]">{useCase.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-[#06D6A0]" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
              O que nossos clientes estão dizendo
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ana Silva",
                role: "Diretora de Marketing",
                company: "Digital Growth",
                testimonial: "O WiizeFlow revolucionou nossa forma de trabalhar. Conseguimos aumentar a conversão dos nossos clientes em 35% no primeiro mês.",
                rating: 5
              },
              {
                name: "Carlos Santos",
                role: "Produtor Digital",
                company: "Império Online",
                testimonial: "Finalmente uma ferramenta brasileira que entende nossas necessidades. Interface intuitiva e suporte em português!",
                rating: 5
              },
              {
                name: "Mariana Costa",
                role: "Consultora",
                company: "Freelancer",
                testimonial: "Economizo 5 horas por semana desde que comecei a usar. Meus clientes ficam impressionados com a clareza dos relatórios.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardHeader>
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-600 italic">
                    "{testimonial.testimonial}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold text-[#2B2D42]">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-[#06D6A0]">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparativo */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
              Por que escolher WiizeFlow ao invés de...
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-[#F4FDF9]">
                  <th className="px-6 py-4 text-left text-[#2B2D42] font-semibold">Funcionalidade</th>
                  <th className="px-6 py-4 text-center text-[#06D6A0] font-semibold">WiizeFlow</th>
                  <th className="px-6 py-4 text-center text-gray-600 font-semibold">Miro</th>
                  <th className="px-6 py-4 text-center text-gray-600 font-semibold">Notion</th>
                  <th className="px-6 py-4 text-center text-gray-600 font-semibold">Funnelytics</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Específico para funis", true, false, false, true],
                  ["Interface em Português", true, false, true, false],
                  ["Suporte brasileiro", true, false, false, false],
                  ["Templates prontos", true, true, false, true],
                  ["Análise de conversão", true, false, false, true],
                  ["Preço acessível", true, false, true, false],
                  ["Facilidade de uso", true, false, true, false]
                ].map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-6 py-4 text-[#2B2D42] font-medium">{row[0]}</td>
                    <td className="px-6 py-4 text-center">
                      {row[1] ? <Check className="h-5 w-5 text-[#06D6A0] mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row[2] ? <Check className="h-5 w-5 text-gray-400 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row[3] ? <Check className="h-5 w-5 text-gray-400 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row[4] ? <Check className="h-5 w-5 text-gray-400 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Planos e Preços */}
      <section className="py-16 bg-[#F4FDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
              Escolha o plano ideal para você
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Plano Gratuito */}
            <Card className="relative bg-white hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-[#2B2D42]">Gratuito</CardTitle>
                <div className="text-4xl font-bold text-[#2B2D42]">
                  R$ 0
                  <span className="text-lg text-gray-600 font-normal">/mês</span>
                </div>
                <CardDescription>Perfeito para começar</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Até 3 funis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Templates básicos</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Suporte por email</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth">Começar Grátis</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Plano Mensal */}
            <Card className="relative bg-white hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-[#2B2D42]">Mensal</CardTitle>
                <div className="text-4xl font-bold text-[#2B2D42]">
                  R$ 47
                  <span className="text-lg text-gray-600 font-normal">/mês</span>
                </div>
                <CardDescription>Para profissionais</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Funis ilimitados</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Todos os templates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Análises avançadas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-[#06D6A0] hover:bg-[#FFD166]">
                  <Link to="/auth">Assinar Mensal</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Plano Anual - Destacado */}
            <Card className="relative bg-white border-2 border-[#06D6A0] hover:shadow-lg transition-shadow duration-300">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#06D6A0] text-white px-4 py-1">Mais Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-[#2B2D42]">Anual</CardTitle>
                <div className="text-4xl font-bold text-[#2B2D42]">
                  R$ 37
                  <span className="text-lg text-gray-600 font-normal">/mês</span>
                </div>
                <div className="text-sm text-[#06D6A0] font-semibold">
                  Economize R$ 120/ano
                </div>
                <CardDescription>Melhor custo-benefício</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Funis ilimitados</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Todos os templates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Análises avançadas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Suporte prioritário</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#06D6A0]" />
                    <span>Treinamentos exclusivos</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-[#FFD166] hover:bg-[#06D6A0] text-black hover:text-white">
                  <Link to="/auth">Assinar Anual</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section className="py-16 bg-[#FFF8E2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <Shield className="h-16 w-16 text-[#06D6A0] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#2B2D42] mb-4">
              Garantia de Risco Zero
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              <strong>Sem cartão de crédito. Sem compromisso.</strong>
            </p>
            <p className="text-gray-600">
              Teste o WiizeFlow por 14 dias completamente grátis. Se não ficar satisfeito, 
              cancele a qualquer momento sem pagar nada.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-[#06D6A0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para transformar seus resultados?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Junte-se a centenas de profissionais que já estão aumentando suas conversões com o WiizeFlow
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-[#FFD166] hover:bg-white text-black px-8 py-4 text-lg transition-colors duration-300"
          >
            <Link to="/auth" className="flex items-center space-x-2">
              <span>Começar agora gratuitamente</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <p className="text-white mt-4 opacity-75">
            Sem cartão • Sem compromisso • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
              Perguntas Frequentes
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold text-[#2B2D42]">
                O que é um funil visual e por que eu preciso de um?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Um funil visual é uma representação gráfica da jornada do seu cliente, desde o primeiro contato até a conversão. Com ele, você consegue identificar exatamente onde seus prospects estão abandonando o processo e otimizar cada etapa para aumentar suas vendas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold text-[#2B2D42]">
                Preciso de conhecimento técnico para usar o WiizeFlow?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Não! O WiizeFlow foi desenvolvido para ser extremamente intuitivo. Nossa interface drag-and-drop permite que qualquer pessoa crie funis profissionais, mesmo sem conhecimento técnico. Além disso, oferecemos templates prontos e tutoriais em português.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold text-[#2B2D42]">
                Posso integrar com outras ferramentas que já uso?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Sim! O WiizeFlow se integra com as principais ferramentas do mercado brasileiro, incluindo sistemas de CRM, plataformas de e-mail marketing, ferramentas de automação e muito mais. Nossa API permite integrações personalizadas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold text-[#2B2D42]">
                Como funciona o período de teste gratuito?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Você tem 14 dias para testar todas as funcionalidades do WiizeFlow gratuitamente, sem precisar informar cartão de crédito. Após o período, você pode escolher continuar com um dos nossos planos pagos ou usar a versão gratuita limitada.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold text-[#2B2D42]">
                Meus dados ficam seguros?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Absolutamente! Utilizamos criptografia de ponta e hospedagem em servidores brasileiros que seguem a LGPD. Seus dados nunca são compartilhados com terceiros e você tem total controle sobre suas informações.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold text-[#2B2D42]">
                Posso cancelar a qualquer momento?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Sim, não há fidelidade. Você pode cancelar sua assinatura a qualquer momento diretamente na plataforma, sem burocracias ou taxas de cancelamento.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-[#2B2D42] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#06D6A0] to-[#FFD166] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="font-bold text-xl">WiizeFlow</span>
              </div>
              <p className="text-gray-300 mb-4">
                A ferramenta brasileira para criar funis visuais e aumentar suas conversões.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-[#06D6A0] transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-300 hover:text-[#06D6A0] transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-gray-300 hover:text-[#06D6A0] transition-colors">
                  YouTube
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2">
                <li><Link to="/pricing" className="text-gray-300 hover:text-[#06D6A0] transition-colors">Preços</Link></li>
                <li><Link to="/auth" className="text-gray-300 hover:text-[#06D6A0] transition-colors">Teste Grátis</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-[#06D6A0] transition-colors">Templates</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[#06D6A0] transition-colors">Integrações</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-[#06D6A0] transition-colors">Sobre</a></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-[#06D6A0] transition-colors">Contato</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-[#06D6A0] transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[#06D6A0] transition-colors">Carreiras</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-300 hover:text-[#06D6A0] transition-colors">Política de Privacidade</Link></li>
                <li><Link to="/terms" className="text-gray-300 hover:text-[#06D6A0] transition-colors">Termos de Uso</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-[#06D6A0] transition-colors">LGPD</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[#06D6A0] transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 WiizeFlow. Todos os direitos reservados. Feito com ❤️ no Brasil.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Vendas;
