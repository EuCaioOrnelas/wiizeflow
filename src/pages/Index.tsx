
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  BarChart3, 
  Zap, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Download,
  Palette,
  Share2,
  Crown
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  useSEO({
    title: "WiizeFlow - Crie Funis de Vendas Visuais que Convertem 300% Mais",
    description: "A primeira ferramenta brasileira para criar funis de vendas visuais profissionais. Drag-and-drop intuitivo, templates prontos, análises detalhadas. +5.000 empresários já aumentaram suas vendas. Teste grátis!",
    keywords: "funil de vendas, marketing digital, conversão, CRM, automação de vendas, estratégia de vendas, landing page, lead generation"
  });

  const testimonials = [
    {
      name: "João Silva",
      company: "Agência Digital XPTO",
      testimonial: "WiizeFlow revolucionou a forma como planejamos nossos funis. Aumento de 40% nas conversões em 3 meses!",
      stars: 5,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      name: "Maria Oliveira",
      company: "Consultoria Vendas Online",
      testimonial: "Com WiizeFlow, meus clientes visualizam o funil completo e entendem a estratégia. Resultados incríveis!",
      stars: 4,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b2933e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      name: "Carlos Pereira",
      company: "E-commerce Moda & Acessórios",
      testimonial: "A interface intuitiva e os templates me economizaram horas de trabalho. Recomendo a todos!",
      stars: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd8b401e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    }
  ];

  const features = [
    {
      title: "Arraste e Solte Simplificado",
      description: "Crie funis complexos com facilidade, sem necessidade de habilidades técnicas.",
      icon: Palette
    },
    {
      title: "Templates Prontos para Usar",
      description: "Comece com modelos testados e comprovados, adaptáveis a qualquer nicho.",
      icon: Download
    },
    {
      title: "Colaboração em Tempo Real",
      description: "Trabalhe em equipe, compartilhe ideias e otimize funis em conjunto.",
      icon: Share2
    },
    {
      title: "Análises e Métricas Detalhadas",
      description: "Acompanhe cada etapa do funil, identifique gargalos e maximize conversões.",
      icon: BarChart3
    }
  ];

  const ctaFeatures = [
    {
      title: "Aumente suas vendas em até 300%",
      description: "Nossa ferramenta foi desenhada para otimizar cada etapa do seu funil, resultando em um aumento significativo nas suas conversões.",
      icon: Zap
    },
    {
      title: "Economize tempo e recursos",
      description: "Com WiizeFlow, você automatiza tarefas, elimina processos manuais e foca no que realmente importa: o crescimento do seu negócio.",
      icon: BarChart3
    },
    {
      title: "Tenha uma visão clara do seu negócio",
      description: "Visualize todo o seu funil de vendas em um só lugar, tome decisões estratégicas e impulsione seus resultados.",
      icon: BarChart3
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => window.location.href = '/pricing'}>
              Preços
            </Button>
            <Button variant="ghost" onClick={() => window.location.href = '/contact'}>
              Contato
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/auth'}>
              Entrar
            </Button>
            <Button onClick={() => window.location.href = '/auth'}>
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Crie Funis de Vendas Visuais que Convertem 300% Mais
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          A primeira ferramenta brasileira para criar funis de vendas visuais profissionais. Arraste e solte intuitivo, templates prontos, análises detalhadas. +5.000 empresários já aumentaram suas vendas.
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.location.href = '/auth'}>
          <Play className="w-5 h-5 mr-2" />
          Começar Teste Grátis
        </Button>
        <p className="mt-4 text-sm text-gray-500">
          7 dias de teste grátis • Sem necessidade de cartão de crédito
        </p>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="flex items-center justify-center text-4xl font-extrabold text-blue-600 mb-2">
              +5.000
            </div>
            <p className="text-gray-700 font-medium">
              Empresários já utilizam
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center text-4xl font-extrabold text-green-600 mb-2">
              3x
            </div>
            <p className="text-gray-700 font-medium">
              Mais conversões em vendas
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center text-4xl font-extrabold text-orange-600 mb-2">
              90%
            </div>
            <p className="text-gray-700 font-medium">
              De aprovação dos clientes
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Funcionalidades que Impulsionam Seus Resultados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                  <span>{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            O que Nossos Clientes Estão Dizendo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-sm font-semibold">{testimonial.name}</CardTitle>
                      <p className="text-gray-500 text-xs">{testimonial.company}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm italic mb-3">
                    "{testimonial.testimonial}"
                  </p>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">
          Pronto para Aumentar Suas Vendas?
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Descubra como o WiizeFlow pode transformar sua estratégia de vendas e impulsionar seus resultados.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          {ctaFeatures.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => window.location.href = '/pricing'}>
          Ver Nossos Planos
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">WiizeFlow</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            A ferramenta ideal para criar funis de vendas visuais e aumentar suas conversões.
          </p>
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} WiizeFlow. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
