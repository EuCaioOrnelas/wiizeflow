import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Eye, EyeOff, CheckCircle, XCircle, Mail, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAccountLimiting } from "@/hooks/useAccountLimiting";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Hook para controle de limite de contas
  const { canCreateAccount, accountCount, loading: limitLoading, trackAccountCreation } = useAccountLimiting();

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
    // Verificar parâmetros de confirmação na URL
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
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token && type === 'signup') {
      console.log('Email confirmation detected');
      toast({
        title: "Email confirmado!",
        description: "Sua conta foi confirmada com sucesso.",
      });
      setIsLogin(true);
      setEmailConfirmationSent(false);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Verificar sessão existente
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      console.log('Checking existing session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        return;
      }

      if (session?.user) {
        console.log('Existing session found, user:', session.user.email);
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('Attempting login for:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        let errorMessage = "Erro desconhecido";
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou senha incorretos. Verifique suas credenciais e tente novamente.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Verifique seu email e clique no link de confirmação antes de fazer login.";
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: "Erro de Login",
          description: errorMessage,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!data.user || !data.session) {
        console.error('Login returned no user or session');
        toast({
          title: "Erro de Login",
          description: "Não foi possível fazer login. Tente novamente.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('Login successful for:', data.user.email);
      
      // Redirecionar imediatamente após login bem-sucedido
      navigate('/dashboard', { replace: true });
      
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isPasswordValid) {
      toast({
        title: "Senha inválida",
        description: "Por favor, atenda a todos os requisitos de senha.",
        variant: "destructive",
      });
      return;
    }

    if (!canCreateAccount) {
      toast({
        title: "Limite de contas atingido",
        description: `Você já criou ${accountCount} contas recentemente. Tente novamente mais tarde.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('Attempting signup for:', email);

    try {
      const redirectUrl = window.location.origin + '/auth';
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name.trim()
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        
        let errorMessage = "Erro desconhecido";
        if (error.message.includes('User already registered')) {
          errorMessage = "Este email já está registrado. Tente fazer login ou use outro email.";
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = "A senha deve atender aos requisitos de segurança.";
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: "Erro no cadastro",
          description: errorMessage,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('Signup successful:', data);
      
      // Rastrear criação da conta
      await trackAccountCreation(email.trim(), data.user?.id);
      
      if (data.user && !data.session) {
        setEmailConfirmationSent(true);
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar sua conta.",
        });
      } else if (data.user && data.session) {
        // Login automático após cadastro
        console.log('Auto-login successful, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
      
      setLoading(false);
      
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email || email.trim() === "") {
      toast({
        title: "Email necessário",
        description: "Por favor, insira seu email para reenviar a confirmação.",
        variant: "destructive",
      });
      return;
    }

    setResendingEmail(true);
    console.log('Attempting to resend confirmation email to:', email.trim());

    try {
      const redirectUrl = `${window.location.origin}/auth`;
      console.log('Using redirect URL:', redirectUrl);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('Resend error:', error);
        
        let errorMessage = "Erro desconhecido";
        if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = "Limite de envio excedido. Aguarde alguns minutos antes de tentar novamente.";
        } else if (error.message.includes('User not found')) {
          errorMessage = "Email não encontrado. Verifique se o email está correto ou crie uma nova conta.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Email ainda não foi confirmado. Verifique sua caixa de entrada.";
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: "Erro ao reenviar",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Email resent successfully');
        toast({
          title: "Email reenviado!",
          description: "Verifique sua caixa de entrada e pasta de spam.",
        });
      }
    } catch (error: any) {
      console.error('Unexpected resend error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao reenviar o email. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setResendingEmail(false);
    }
  };

  if (emailConfirmationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
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

        {/* Account Limit Warning */}
        {!isLogin && !limitLoading && !canCreateAccount && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800 text-sm">
                    Limite de contas atingido
                  </h3>
                  <p className="text-red-700 text-xs mt-1">
                    Você já criou {accountCount} contas recentemente. Entre em contato conosco para mais informações.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                    required={!isLogin}
                    disabled={loading}
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
                  disabled={loading}
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
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
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
                        <span className={`text-sm ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                          Mínimo 8 caracteres
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasUpperCase ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'rgb(6, 214, 160)' }} />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                          Pelo menos 1 letra maiúscula
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasLowerCase ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'rgb(6, 214, 160)' }} />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                          Pelo menos 1 letra minúscula
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasNumber ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'rgb(6, 214, 160)' }} />
                        ) : (
                          <XCircle className="w-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                          Pelo menos 1 número
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasSpecialChar ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'rgb(6, 214, 160)' }} />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
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
                disabled={loading || (!isLogin && (!isPasswordValid || !canCreateAccount))}
              >
                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta Gratuita')}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => {
                  if (!loading) {
                    setIsLogin(!isLogin);
                    setEmail("");
                    setPassword("");
                    setName("");
                    setEmailConfirmationSent(false);
                    setLoading(false);
                  }
                }}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
                style={{ color: 'rgb(6, 214, 160)' }}
                disabled={loading}
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
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700 text-sm"
                disabled={loading}
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
