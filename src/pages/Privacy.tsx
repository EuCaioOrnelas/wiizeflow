import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

const Privacy = () => {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informações que Coletamos</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>Coletamos informações que você nos fornece diretamente, incluindo:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nome, email e informações de perfil ao criar uma conta</li>
                <li>Conteúdo que você cria usando nossa plataforma (funis, designs, etc.)</li>
                <li>Informações de pagamento processadas pelo Stripe</li>
                <li>Comunicações conosco via email ou suporte</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Como Usamos Suas Informações</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>Usamos suas informações para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar pagamentos e gerenciar assinaturas</li>
                <li>Enviar comunicações importantes sobre o serviço</li>
                <li>Oferecer suporte ao cliente</li>
                <li>Analisar uso da plataforma para melhorias</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Compartilhamento de Informações</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>Não vendemos ou alugamos suas informações pessoais. Podemos compartilhar informações apenas:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Com prestadores de serviços confiáveis (como Stripe para pagamentos)</li>
                <li>Quando exigido por lei ou processo legal</li>
                <li>Para proteger nossos direitos ou segurança dos usuários</li>
                <li>Com seu consentimento explícito</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Segurança dos Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações 
              contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia 
              de dados em trânsito e em repouso, controles de acesso e monitoramento regular.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies e Tecnologias Similares</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>Usamos cookies e tecnologias similares para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manter você logado na plataforma</li>
                <li>Lembrar suas preferências</li>
                <li>Analisar uso e performance do site</li>
                <li>Personalizar sua experiência</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Seus Direitos</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>Você tem o direito de:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acessar e atualizar suas informações pessoais</li>
                <li>Solicitar exclusão de sua conta e dados</li>
                <li>Exportar seus dados criados na plataforma</li>
                <li>Optar por não receber comunicações de marketing</li>
                <li>Solicitar correção de informações incorretas</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Retenção de Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos 
              descritos nesta política, a menos que um período de retenção mais longo seja exigido ou 
              permitido por lei. Dados de contas inativas podem ser excluídos após um período de inatividade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Menores de Idade</h2>
            <p className="text-gray-700 leading-relaxed">
              Nosso serviço não é destinado a menores de 18 anos. Não coletamos conscientemente 
              informações pessoais de menores. Se tomarmos conhecimento de que coletamos informações 
              de um menor, tomaremos medidas para excluir essas informações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Alterações na Política</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre 
              mudanças significativas por email ou através de aviso em nossa plataforma. 
              Recomendamos revisar esta política regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contato</h2>
            <p className="text-gray-700 leading-relaxed">
              Para dúvidas sobre esta Política de Privacidade ou para exercer seus direitos, 
              entre em contato conosco em: 
              <a href="mailto:privacidade@wiizeflow.com" className="text-green-600 hover:text-green-700 ml-1">
                privacidade@wiizeflow.com
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

export default Privacy;
