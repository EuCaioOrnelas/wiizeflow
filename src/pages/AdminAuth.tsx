
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Eye, EyeOff, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Verificar se o usuário é admin pelo email
          if (session.user.email === 'adminwiize@wiizeflow.com.br') {
            console.log('Admin user logged in, redirecting to admin dashboard');
            navigate('/admin');
            return;
          }

          // Tentar verificar se o usuário é admin na tabela
          try {
            const { data: adminCheck } = await supabase
              .from('admin_users')
              .select('id')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (adminCheck) {
              navigate('/admin');
            } else {
              // Usuário não é admin, fazer logout
              await supabase.auth.signOut();
              toast({
                title: "Acesso Negado",
                description: "Apenas administradores podem acessar esta área.",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error('Error checking admin status:', error);
            
            // Se houver erro mas é o email admin, permitir acesso
            if (session.user.email === 'adminwiize@wiizeflow.com.br') {
              navigate('/admin');
            } else {
              await supabase.auth.signOut();
              toast({
                title: "Erro",
                description: "Erro ao verificar permissões de administrador.",
                variant: "destructive",
              });
            }
          }
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Existing session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Verificar se o usuário é admin pelo email primeiro
        if (session.user.email === 'adminwiize@wiizeflow.com.br') {
          navigate('/admin');
          return;
        }

        try {
          const { data: adminCheck } = await supabase
            .from('admin_users')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (adminCheck) {
            navigate('/admin');
          } else {
            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error('Error checking existing session admin status:', error);
          if (session.user.email !== 'adminwiize@wiizeflow.com.br') {
            await supabase.auth.signOut();
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login result:', data, error);

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Erro de Login",
            description: "Email ou senha incorretos. Verifique suas credenciais e tente novamente.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro de Login",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      console.log('Login successful for:', data.user?.email);
      
      // A verificação de admin será feita no useEffect através do onAuthStateChange
      
    } catch (error: any) {
      console.error('Unexpected login error:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <Target className="w-10 h-10 text-green-600" />
              <Shield className="w-5 h-5 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-3xl font-bold text-white">WiizeFlow</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Acesso Administrativo
          </h1>
          <p className="text-gray-400">
            Área restrita para administradores
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-white flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5 text-yellow-500" />
              <span>Login de Administrador</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@wiizeflow.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha administrativa"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
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
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Entrar como Admin'}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gray-300 text-sm"
              >
                Voltar para página inicial
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Apenas usuários com privilégios administrativos podem acessar esta área
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
