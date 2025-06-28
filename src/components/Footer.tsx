
import { Mail, MessageCircle, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/7f16165c-d306-4571-8b04-5c0136a778b4.png" 
                alt="WiizeFlow Logo" 
                className="w-8 h-8"
              />
              <span className="text-2xl font-bold">WiizeFlow</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Crie funis de vendas profissionais de forma simples e intuitiva. 
              Aumente suas conversões com nossa plataforma poderosa e fácil de usar.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:contato@wiizeflow.com.br" className="text-gray-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="tel:+5511999999999" className="text-gray-300 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Início</a></li>
              <li><a href="/pricing" className="text-gray-300 hover:text-white transition-colors">Preços</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contato</a></li>
              <li><a href="/auth" className="text-gray-300 hover:text-white transition-colors">Login</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 WiizeFlow. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Desenvolvido com ❤️ para empreendedores brasileiros
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
