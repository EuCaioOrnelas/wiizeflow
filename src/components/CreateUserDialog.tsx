
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";

// Interface para as propriedades do componente
interface CreateUserDialogProps {
  onCreateUser: (
    email: string, 
    password: string, 
    name: string, 
    planType: string, 
    subscriptionPeriod: string
  ) => Promise<{ success: boolean; error?: string }>;
}

/**
 * Componente de diálogo para criação de novos usuários
 * 
 * Funcionalidades:
 * - Formulário completo para dados do usuário
 * - Seleção de tipo de plano e período
 * - Validação de campos obrigatórios
 * - Feedback visual durante criação
 * - Reset automático após sucesso
 */
export const CreateUserDialog = ({ onCreateUser }: CreateUserDialogProps) => {
  // Estados para controlar o diálogo e o carregamento
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado para armazenar dados do formulário
  const [formData, setFormData] = useState({
    email: "",               // Email do usuário
    password: "",            // Senha do usuário
    name: "",               // Nome completo
    planType: "monthly",    // Tipo de plano (free, monthly, annual)
    subscriptionPeriod: "monthly" // Período da assinatura
  });

  /**
   * Manipula o submit do formulário de criação
   * @param e - Evento do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chamar função de criação passada como prop
      const result = await onCreateUser(
        formData.email,
        formData.password,
        formData.name,
        formData.planType,
        formData.subscriptionPeriod
      );

      // Se sucesso, resetar formulário e fechar diálogo
      if (result.success) {
        setFormData({
          email: "",
          password: "",
          name: "",
          planType: "monthly",
          subscriptionPeriod: "monthly"
        });
        setIsOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Botão trigger para abrir o diálogo */}
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Usuário</span>
        </Button>
      </DialogTrigger>
      
      {/* Conteúdo do diálogo */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            {/* Formulário de criação de usuário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo: Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nome do usuário"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Campo: E-mail */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              {/* Campo: Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Senha do usuário"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8} // Mínimo de 8 caracteres
                />
              </div>

              {/* Select: Tipo de Plano */}
              <div className="space-y-2">
                <Label htmlFor="planType">Tipo de Plano</Label>
                <Select value={formData.planType} onValueChange={(value) => setFormData({ ...formData, planType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Gratuito</SelectItem>
                    <SelectItem value="monthly">Mensal - R$ 47,00/mês</SelectItem>
                    <SelectItem value="annual">Anual - R$ 397,00/ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select: Período de Acesso */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionPeriod">Período de Acesso</Label>
                <Select value={formData.subscriptionPeriod} onValueChange={(value) => setFormData({ ...formData, subscriptionPeriod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">1 Mês</SelectItem>
                    <SelectItem value="annual">1 Ano</SelectItem>
                    <SelectItem value="lifetime">Vitalício</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Botões de ação */}
              <div className="flex space-x-2 pt-4">
                {/* Botão Cancelar */}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                
                {/* Botão Criar (com estado de carregamento) */}
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Criando...' : 'Criar Usuário'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
