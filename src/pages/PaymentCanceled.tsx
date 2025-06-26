
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, Target, ArrowLeft } from "lucide-react";

const PaymentCanceled = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
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

      {/* Canceled Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Pagamento Cancelado
            </h1>
            <p className="text-xl text-gray-600">
              Não se preocupe! Você pode tentar novamente a qualquer momento.
            </p>
          </div>

          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-orange-600">O que aconteceu?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <p className="text-gray-600">
                Seu pagamento foi cancelado e nenhuma cobrança foi feita no seu cartão.
                Isso pode ter acontecido por diversos motivos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Você decidiu não finalizar a compra</li>
                <li>Houve algum problema técnico</li>
                <li>Você quer revisar os planos disponíveis</li>
              </ul>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              💡 Que tal começar com o plano gratuito?
            </h3>
            <p className="text-blue-700 mb-4">
              Você pode experimentar o WiizeFlow gratuitamente e fazer upgrade depois!
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Começar Grátis
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/pricing'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Ver Planos Novamente
            </Button>
            <Button 
              onClick={() => window.location.href = '/sales'}
              variant="outline"
              className="px-8 py-3"
            >
              Saber Mais Sobre o WiizeFlow
            </Button>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🤝 Precisa de Ajuda para Decidir?
            </h3>
            <p className="text-gray-700 mb-4">
              Nossa equipe pode ajudar você a escolher o melhor plano!
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Email:</strong> vendas@wiizeflow.com</p>
              <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentCanceled;
