import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="hover:bg-green-50 border-green-200"
          >
            Voltar ao Início
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e usar o WiizeFlow, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-700 leading-relaxed">
              O WiizeFlow é uma plataforma online que permite aos usuários criar e gerenciar funis de vendas visuais 
              para planejamento de estratégias de marketing. O serviço inclui ferramentas de design visual, 
              templates e funcionalidades de colaboração.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Conta do Usuário</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>Para usar o WiizeFlow, você deve:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer informações precisas e atualizadas durante o registro</li>
                <li>Manter a segurança de sua conta e senha</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                <li>Ser responsável por todas as atividades em sua conta</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Planos e Pagamentos</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>O WiizeFlow oferece diferentes planos de assinatura:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Plano Free: Acesso limitado com até 2 funis</li>
                <li>Planos pagos: Diferentes níveis de acesso com recursos expandidos</li>
                <li>Pagamentos são processados mensalmente via Stripe</li>
                <li>Cancelamento pode ser feito a qualquer momento</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Uso Aceitável</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>Você concorda em não usar o WiizeFlow para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Atividades ilegais ou que violem direitos de terceiros</li>
                <li>Distribuir spam, malware ou conteúdo malicioso</li>
                <li>Tentar acessar contas de outros usuários</li>
                <li>Sobrecarregar nossos sistemas ou interferir no funcionamento</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              O WiizeFlow e todo seu conteúdo, incluindo mas não limitado a software, texto, imagens e logos, 
              são propriedade da empresa e estão protegidos por leis de direitos autorais. 
              Você mantém os direitos sobre o conteúdo que criar usando nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed">
              O WiizeFlow é fornecido "como está" sem garantias de qualquer tipo. 
              Não seremos responsáveis por danos indiretos, incidentais ou consequenciais 
              decorrentes do uso ou incapacidade de usar nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Modificações dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Reservamos o direito de modificar estes termos a qualquer momento. 
              As alterações entrarão em vigor imediatamente após a publicação. 
              O uso continuado do serviço constitui aceitação dos termos modificados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contato</h2>
            <p className="text-gray-700 leading-relaxed">
              Para dúvidas sobre estes Termos de Uso, entre em contato conosco em: 
              <a href="mailto:contato@wiizeflow.com" className="text-green-600 hover:text-green-700 ml-1">
                contato@wiizeflow.com
              </a>
            </p>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
