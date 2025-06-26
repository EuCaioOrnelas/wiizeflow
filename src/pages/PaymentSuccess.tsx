
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, TrendingUp, AlertCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
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

      {/* Success Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Pagamento Realizado com Sucesso! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              Obrigado por escolher o WiizeFlow! Seu pagamento foi processado com sucesso.
            </p>
          </div>

          {/* Destaque sobre acesso */}
          <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-200">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  🔑 IMPORTANTE: Como Acessar Seus Benefícios
                </h3>
                <div className="text-blue-800 space-y-2">
                  <p><strong>✅ Já tem conta no WiizeFlow?</strong></p>
                  <p className="ml-4">Faça login com o mesmo email usado na compra para ativar automaticamente seus benefícios premium.</p>
                  
                  <p className="mt-3"><strong>✅ Ainda não tem conta?</strong></p>
                  <p className="ml-4">Crie sua conta usando o mesmo email da compra para ter acesso imediato a todos os recursos premium.</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-600">Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">Acesse sua Conta</h3>
                  <p className="text-gray-600">Use o mesmo email da compra para fazer login ou criar sua conta</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">Crie seu Primeiro Funil</h3>
                  <p className="text-gray-600">Use nossos templates profissionais ou comece do zero</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">Otimize e Exporte</h3>
                  <p className="text-gray-600">Analise, otimize e exporte seus funis em alta qualidade</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {sessionId && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                <strong>ID da Sessão:</strong> {sessionId}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Guarde este número para referência futura
              </p>
            </div>
          )}

          <div className="bg-yellow-50 p-6 rounded-lg mb-8 border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              📧 Lembre-se: Use o Email da Compra
            </h3>
            <p className="text-yellow-700 mb-2">
              Para ter acesso automático aos seus benefícios premium, é essencial usar o mesmo email da compra ao fazer login ou criar sua conta.
            </p>
            <p className="text-sm text-yellow-600">
              Se usar um email diferente, não conseguiremos reconhecer sua assinatura automaticamente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Fazer Login / Criar Conta
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              className="px-8 py-3"
            >
              Ir para o Dashboard
            </Button>
          </div>

          <div className="mt-8 bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎯 Precisa de Ajuda?
            </h3>
            <p className="text-green-700 mb-4">
              Nossa equipe está pronta para ajudar você a começar!
            </p>
            <div className="space-y-2 text-sm text-green-600">
              <p><strong>Email:</strong> suporte@wiizeflow.com</p>
              <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentSuccess;
