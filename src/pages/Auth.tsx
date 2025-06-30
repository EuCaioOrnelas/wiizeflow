import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Eye, EyeOff, CheckCircle, XCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const { toast } = useToast();

  // Validação de senha forte
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  useEffect(() => {
    // Verificar se há parâmetros de confirmação na URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const type = urlParams.get('type');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      console.error('Auth error from URL:', error, errorDescription);
      toast({
        title: "Erro de confirmação",
        description: errorDescription || "Ocorreu um erro durante a confirmação do email.",
        variant: "destructive",
      });
      // Limpar a URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token && type === 'signup') {
      console.log('Email confirmation detected, processing...');
      // Aguardar um pouco para o token ser processado
      setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            toast({
              title: "Email confirmado!",
              description: "Sua conta foi confirmada com sucesso. Redirecionando...",
            });
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1500);
          } else {
            toast({
              title: "Email confirmado!",
              description: "Sua conta foi confirmada. Agora você pode fazer login.",
            });
            setIsLogin(true);
            setEmailConfirmationSent(false);
          }
        });
      }, 1000);
      
      // Limpar a URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'Session:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in successfully');
          
          // Verificar se o perfil existe, se não, criar
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error checking profile:', profileError);
            }

            if (!profile) {
              console.log('Creating user profile...');
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário'
                });

              if (insertError) {
                console.error('Error creating profile:', insertError);
                toast({
                  title: "Aviso",
                  description: "Conta criada, mas houve um problema ao configurar o perfil. Tente novamente.",
                  variant: "destructive",
                });
                return;
              }
            }

            toast({
              title: "Login realizado!",
              description: "Redirecionando para o dashboard...",
            });
            
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1000);
          } catch (error) {
            console.error('Unexpected error handling profile:', error);
            toast({
              title: "Login realizado!",
              description: "Redirecionando para o dashboard...",
            });
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1000);
          }
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Existing session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('Existing session found, redirecting to dashboard');
        window.location.href = '/dashboard';
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login for:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Erro de Login",
            description: "Email ou senha incorretos. Verifique suas credenciais e tente novamente.",
            variant: "destructive",
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email não confirmado",
            description: "Verifique seu email e clique no link de confirmação antes de fazer login.",
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

      console.log('Login successful');
      
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast({
        title: "Senha inválida",
        description: "Por favor, atenda a todos os requisitos de senha.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting signup for:', email);
      
      // Usar a URL de produção diretamente
      const redirectUrl = 'https://wiizeflow.vcom.br/auth';
      
      console.log('Using redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes('User already registered')) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está registrado. Tente fazer login ou use outro email.",
            variant: "destructive",
          });
        } else if (error.message.includes('Password should be at least')) {
          toast({
            title: "Senha muito fraca",
            description: "A senha deve atender aos requisitos de segurança.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      console.log('Signup successful:', data);
      
      if (data.user && !data.session) {
        // Usuário criado mas precisa confirmar email
        setEmailConfirmationSent(true);
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar sua conta. Após confirmar, você poderá fazer login.",
        });
      } else if (data.session) {
        // Usuário criado e já logado (email confirmation desabilitado)
        toast({
          title: "Conta criada com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
      }
      
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira seu email para reenviar a confirmação.",
        variant: "destructive",
      });
      return;
    }

    setResendingEmail(true);

    try {
      const redirectUrl = 'https://wiizeflow.vcom.br/auth';

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('Resend error:', error);
        toast({
          title: "Erro ao reenviar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email reenviado!",
          description: "Verifique sua caixa de entrada e spam.",
        });
      }
    } catch (error: any) {
      console.error('Unexpected resend error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao reenviar o email.",
        variant: "destructive",
      });
    } finally {
      setResendingEmail(false);
    }
  };

  if (emailConfirmationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6" style={{
        background: 'linear-gradient(to bottom right, rgb(240, 253, 250), rgb(255, 255, 255), rgb(209, 250, 229))'
      }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Target className="w-10 h-10" style={{ color: 'rgb(6, 214, 160)' }} />
              <span className="text-3xl font-bold text-gray-900">WiizeFlow</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Confirme seu email
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600" style={{ color: 'rgb(6, 214, 160)' }}>
                <Mail className="w-16 h-16 mx-auto mb-4" />
                Email de confirmação enviado!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Enviamos um email de confirmação para <strong>{email}</strong>
              </p>
              <p className="text-gray-600">
                Clique no link no email para confirmar sua conta e depois retorne aqui para fazer login.
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleResendConfirmation}
                  disabled={resendingEmail}
                  variant="outline"
                  className="w-full"
                >
                  {resendingEmail ? 'Reenviando...' : 'Reenviar email de confirmação'}
                </Button>

                <Button 
                  onClick={() => {
                    setEmailConfirmationSent(false);
                    setIsLogin(true);
                    setEmail("");
                    setPassword("");
                    setName("");
                  }}
                  className="w-full"
                  style={{ backgroundColor: 'rgb(6, 214, 160)' }}
                >
                  Voltar para login
                </Button>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Não recebeu o email? Verifique sua caixa de spam ou use o botão "Reenviar" acima.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6" style={{
      background: 'linear-gradient(to bottom right, rgb(240, 253, 250), rgb(255, 255, 255), rgb(209, 250, 229))'
    }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Target className="w-10 h-10" style={{ color: 'rgb(6, 214, 160)' }} />
            <span className="text-3xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Fazer Login' : 'Criar Conta Gratuita'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Acesse sua conta e continue criando seus funis' 
              : 'Comece gratuitamente e transforme suas ideias em estratégias visuais'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? 'Entrar na sua conta' : 'Criar conta gratuita'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
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
                    placeholder="Sua senha"
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
                
                {!isLogin && password && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Requisitos da senha:</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {passwordValidation.minLength ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'rgb(6, 214, 160)' }} />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`} style={passwordValidation.minLength ? { color: 'rgb(6, 214, 160)' } : {}}>
                          Mínimo 8 caracteres
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasUpperCase ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'rgb(6, 214, 160)' }} />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'}`} style={passwordValidation.hasUpperCase ? { color: 'rgb(6, 214, 160)' } : {}}>
                          Pelo menos 1 letra maiúscula
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasLowerCase ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'rgb(6, 214, 160)' }} />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-600'}`} style={passwordValidation.hasLowerCase ? { color: 'rgb(6, 214, 160)' } : {}}>
                          Pelo menos 1 letra minúscula
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasNumber ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'rgb(6, 214, 160)' }} />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`} style={passwordValidation.hasNumber ? { color: 'rgb(6, 214, 160)' } : {}}>
                          Pelo menos 1 número
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasSpecialChar ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'rgb(6, 214, 160)' }} />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`} style={passwordValidation.hasSpecialChar ? { color: 'rgb(6, 214, 160)' } : {}}>
                          Pelo menos 1 caractere especial (!@#$%^&*)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                style={{ backgroundColor: 'rgb(6, 214, 160)' }}
                disabled={loading || (!isLogin && !isPasswordValid)}
              >
                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta Gratuita')}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                  setName("");
                  setEmailConfirmationSent(false);
                }}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
                style={{ color: 'rgb(6, 214, 160)' }}
              >
                {isLogin 
                  ? 'Não tem conta? Criar conta gratuita' 
                  : 'Já tem conta? Fazer login'
                }
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Voltar para página inicial
              </button>
            </div>
          </CardContent>
        </Card>

        {!isLogin && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ao criar uma conta, você concorda com nossos{' '}
              <a href="/terms" className="text-green-600 hover:text-green-700" style={{ color: 'rgb(6, 214, 160)' }}>
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="/privacy" className="text-green-600 hover:text-green-700" style={{ color: 'rgb(6, 214, 160)' }}>
                Política de Privacidade
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
