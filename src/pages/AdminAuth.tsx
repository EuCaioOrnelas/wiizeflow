
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já está logado como admin
    const checkAdminAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Verificar se é o email admin específico
        if (session.user.email === 'adminwiize@wiizeflow.com.br') {
          navigate('/admin');
          return;
        }
        
        // Verificar se está na tabela admin_users
        const { data: adminCheck } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
          
        if (adminCheck) {
          navigate('/admin');
        }
      }
    };
    
    checkAdminAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Admin login attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Admin login error:', error);
        toast({
          title: "Erro de Login",
          description: "Credenciais inválidas ou você não tem permissão de administrador.",
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        console.log('Admin login successful for:', data.user.email);
        
        // Verificar se é admin
        if (data.user.email === 'adminwiize@wiizeflow.com.br') {
          toast({
            title: "Login realizado!",
            description: "Redirecionando para o painel administrativo...",
          });
          navigate('/admin');
          return;
        }
        
        // Verificar se está na tabela admin_users
        const { data: adminCheck, error: adminError } = await supabase
          .from('admin_users')
          .select('id, role')
          .eq('user_id', data.user.id)
          .single();
          
        if (adminError || !adminCheck) {
          console.log('User is not an admin');
          await supabase.auth.signOut();
          toast({
            title: "Acesso Negado",
            description: "Você não tem permissão para acessar o painel administrativo.",
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Login realizado!",
          description: "Redirecionando para o painel administrativo...",
        });
        navigate('/admin');
      }
      
    } catch (error: any) {
      console.error('Unexpected admin login error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/7f16165c-d306-4571-8b04-5c0136a778b4.png" 
              alt="WiizeFlow Logo" 
              className="w-10 h-10"
            />
            <Crown className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Acesso restrito para administradores
          </p>
        </div>

        <Card className="shadow-xl border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <CardTitle className="text-center flex items-center justify-center space-x-2">
              <Crown className="w-5 h-5" />
              <span>Login Administrativo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email do Administrador</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@wiizeflow.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha administrativa"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Acessar Painel Admin'}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Site
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Este painel é restrito apenas para administradores autorizados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
