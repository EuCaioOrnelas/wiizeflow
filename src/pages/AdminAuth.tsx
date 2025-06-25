
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Check if user is admin
      if (session.user.email === 'adminwiize@wiizeflow.com.br') {
        navigate('/admin');
        return;
      }

      const { data: adminCheck } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (adminCheck) {
        navigate('/admin');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Check if user is admin
        if (data.user.email === 'adminwiize@wiizeflow.com.br') {
          navigate('/admin');
          return;
        }

        const { data: adminCheck, error: adminError } = await supabase
          .from('admin_users')
          .select('id, role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (adminError) {
          console.error('Error checking admin status:', adminError);
        }

        if (adminCheck) {
          navigate('/admin');
        } else {
          toast({
            title: "Acesso Negado",
            description: "Este usuário não tem permissão para acessar o painel administrativo.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erro no Login",
        description: error.message || "Erro ao fazer login. Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/7f16165c-d306-4571-8b04-5c0136a778b4.png" 
              alt="WiizeFlow Logo" 
              className="w-10 h-10"
            />
            <span className="text-3xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Acesso restrito para administradores
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Login de Administrador</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@wiizeflow.com.br"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Site
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;
