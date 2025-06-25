
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Eye, EyeOff } from "lucide-react";

interface CreateUserDialogProps {
  onCreateUser: (email: string, password: string, name: string, planType: string, subscriptionPeriod: string) => Promise<{ success: boolean; error?: string; userId?: string }>;
}

export const CreateUserDialog = ({ onCreateUser }: CreateUserDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    planType: "free",
    subscriptionPeriod: "monthly"
  });

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.name) {
      return;
    }

    setLoading(true);

    try {
      const result = await onCreateUser(
        formData.email,
        formData.password,
        formData.name,
        formData.planType,
        formData.subscriptionPeriod
      );

      if (result.success) {
        setFormData({
          email: "",
          password: "",
          name: "",
          planType: "free",
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
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Usuário</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha do usuário"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                    className="pr-20"
                  />
                  <div className="absolute right-0 top-0 h-full flex">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="px-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generatePassword}
                  className="text-xs"
                >
                  Gerar Senha Aleatória
                </Button>
              </div>

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

              {formData.planType !== 'free' && (
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
              )}
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !formData.email || !formData.password || !formData.name}
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
