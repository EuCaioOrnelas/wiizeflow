import { Mail, MessageCircle, Phone, Target } from "lucide-react";

const Footer = () => {
  return (
    // Rodapé principal com fundo escuro
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        {/* Grid principal do rodapé com 4 colunas em desktop */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* Seção da logo e descrição - ocupa 2 colunas */}
          <div className="md:col-span-2">
            {/* Logo e nome da empresa */}
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-8 h-8 text-[rgb(6,214,160)]" />
              <span className="text-2xl font-bold">WiizeFlow</span>
            </div>

            {/* Descrição da empresa */}
            <p className="text-gray-300 mb-6 max-w-md">
              Crie funis de vendas profissionais de forma simples e intuitiva.
              Aumente suas conversões com nossa plataforma poderosa e fácil de
              usar.
            </p>

            {/* Links de contato social */}
            <div className="flex space-x-4">
              <a
                href="mailto:wiizeflow@gmail.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/5544991487211"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="tel:+5544991487211"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Seção de links rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Preços
                </a>
              </li>
              <li>
                <a
                  href="/auth"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Seção de links legais */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/terms"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória e informações de copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright com ano automático */}
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} WiizeFlow. Todos os direitos
              reservados.
            </p>
            {/* Mensagem de desenvolvimento */}
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Desenvolvido pela Click Wiize
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
