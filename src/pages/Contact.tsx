import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Mail, MessageSquare, Phone, MapPin, Clock, Users, Shield, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEmailSupport = () => {
    window.location.href = 'mailto:wiizeflow@gmail.com?subject=Solicitação de Suporte - WiizeFlow';
  };

  const handleWhatsApp = () => {
    const whatsappUrl = 'https://wa.me/5544991487211?text=Olá! Preciso de ajuda com o WiizeFlow.';
    window.open(whatsappUrl, '_blank');
  };

  const faqs = [
    {
      question: "Como começar a usar o WiizeFlow?",
      answer: "É muito simples! Crie sua conta gratuita, escolha um template ou comece do zero, e use nosso editor visual para criar seu primeiro funil. Todo o processo leva menos de 30 minutos."
    },
    {
      question: "Preciso ter conhecimento técnico para usar a plataforma?",
      answer: "Absolutamente não! O WiizeFlow foi desenvolvido para ser usado por qualquer pessoa. Nosso editor visual funciona com arrastar e soltar, sem necessidade de conhecimento em programação ou design."
    },
    {
      question: "Quantos funis posso criar no plano gratuito?",
      answer: "No plano gratuito você pode criar até 2 funis completos. Para funis ilimitados e todos os recursos premium, você pode assinar um de nossos planos pagos."
    },
    {
      question: "Como funciona a integração com outras ferramentas?",
      answer: "Nos planos pagos, oferecemos integrações com as principais ferramentas de marketing como Mailchimp, RD Station, HubSpot, Google Analytics e muito mais. A configuração é simples e não requer conhecimento técnico."
    },
    {
      question: "Posso exportar meus funis?",
      answer: "Sim! Você pode exportar seus funis em alta qualidade como PDF, PNG ou compartilhar online com um link. Todos os planos incluem essa funcionalidade."
    },
    {
      question: "Oferece suporte em português?",
      answer: "Sim! Nosso suporte é 100% em português brasileiro. Temos uma equipe especializada que pode ajudar via email, chat ou videochamada, dependendo do seu plano."
    },
    {
      question: "Como funciona a garantia de 30 dias?",
      answer: "Se você não ficar satisfeito ou não aumentar suas conversões em 30 dias, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocacia."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim! Você pode cancelar sua assinatura a qualquer momento diretamente na plataforma. Não há contratos ou taxas de cancelamento."
    },
    {
      question: "Comprei sem ter conta, como acesso meus benefícios?",
      answer: "Muito simples! Crie sua conta usando o mesmo email que você usou na compra. O sistema reconhecerá automaticamente sua assinatura e ativará todos os benefícios premium."
    },
    {
      question: "Vocês oferecem treinamento ou consultoria?",
      answer: "Sim! No plano anual oferecemos 1 hora de consultoria personalizada por mês. Também temos uma base de conhecimento completa com tutoriais e melhores práticas."
    },
    {
      question: "Os templates são customizáveis?",
      answer: "Completamente! Todos os nossos templates podem ser 100% personalizados. Você pode alterar cores, textos, fluxos, adicionar ou remover etapas conforme sua estratégia."
    },
    {
      question: "Como funciona o histórico de versões?",
      answer: "Nos planos pagos, salvamos automaticamente todas as versões dos seus funis. Você pode voltar para qualquer versão anterior a qualquer momento, sem perder seu trabalho."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => window.location.href = '/'}>
              Início
            </Button>
            <Button variant="ghost" onClick={() => window.location.href = '/dashboard'}>
              Dashboard
            </Button>
            <Button 
              className="bg-[rgb(6,214,160)] hover:bg-[rgb(5,195,148)] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              onClick={() => window.location.href = '/auth'}
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Como Podemos Ajudar Você?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Nossa equipe está pronta para responder suas dúvidas e ajudar você a ter sucesso com o WiizeFlow.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardHeader>
                <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Suporte por Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Envie suas dúvidas por email e nossa equipe responderá em até 24 horas.
                </p>
                <Button 
                  onClick={handleEmailSupport} 
                  className="w-full bg-[rgb(6,214,160)] hover:bg-[rgb(5,195,148)] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  Enviar Email
                </Button>
              </CardContent>
            </Card>

            {user && (
              <Card className="shadow-lg hover:shadow-xl transition-shadow text-center border-2 border-green-500">
                <CardHeader>
                  <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-green-700">WhatsApp VIP</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Suporte prioritário via WhatsApp para usuários logados.
                  </p>
                  <Button 
                    onClick={handleWhatsApp} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                  >
                    Abrir WhatsApp
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardHeader>
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Horário de Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Segunda a Sexta:</strong> 9h às 18h</p>
                  <p><strong>Sábados:</strong> 9h às 14h</p>
                  <p><strong>Domingos:</strong> Fechado</p>
                  <p className="text-sm text-purple-600 mt-4">
                    Fuso horário: Brasília (GMT-3)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-xl p-8 mb-16">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Email Geral</h3>
                <p className="text-gray-600">wiizeflow@gmail.com</p>
              </div>
              <div>
                <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Vendas</h3>
                <p className="text-gray-600">wiizeflow@gmail.com</p>
              </div>
              <div>
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Suporte Técnico</h3>
                <p className="text-gray-600">wiizeflow@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Encontre respostas para as dúvidas mais comuns sobre o WiizeFlow
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-blue-50 p-8 rounded-xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Não encontrou sua resposta?
              </h3>
              <p className="text-blue-700 mb-6">
                Nossa equipe de suporte está pronta para ajudar você com qualquer dúvida específica.
              </p>
              <Button 
                onClick={handleEmailSupport} 
                size="lg" 
                className="bg-[rgb(6,214,160)] hover:bg-[rgb(5,195,148)] text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                Falar com Suporte
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Por que Escolher o WiizeFlow?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">5.000+ Clientes Satisfeitos</h3>
              <p className="text-gray-600">
                Milhares de empresários já transformaram seus negócios com nossa plataforma.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Suporte Rápido</h3>
              <p className="text-gray-600">
                Resposta em até 24h por email e suporte imediato via WhatsApp para usuários logados.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Seguro</h3>
              <p className="text-gray-600">
                Seus dados estão protegidos com a mais alta segurança e garantia de 30 dias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">WiizeFlow</span>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                A primeira plataforma brasileira para criar funis de vendas visuais e profissionais.
              </p>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <strong>Vendas:</strong> wiizeflow@gmail.com
                </p>
                <p className="text-gray-300">
                  <strong>Suporte:</strong> wiizeflow@gmail.com
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
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
