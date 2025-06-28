import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Target, LogOut, Camera, CreditCard, Upload, MessageCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import Footer from "@/components/Footer";

const Account = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          window.location.href = '/auth';
        } else {
          // Carregar perfil do usuário
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        window.location.href = '/auth';
      } else {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
      setNewName(data.name || '');
      setAvatarUrl(data.avatar_url || '');
      
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('funnels');
    localStorage.removeItem('userPlan');
    window.location.href = '/';
  };

  const handleSaveProfile = async () => {
    if (!newName.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: newName.trim() })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível salvar as alterações.",
          variant: "destructive",
        });
        return;
      }

      setProfile({ ...profile, name: newName.trim() });
      setIsEditing(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos de senha.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password change error:', error);
        toast({
          title: "Erro",
          description: error.message || "Não foi possível alterar a senha.",
          variant: "destructive",
        });
        return;
      }

      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: "Senha alterada",
        description: "Sua senha foi atualizada com sucesso.",
      });
    } catch (error: any) {
      console.error('Password change error:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar a senha.",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);
    
    try {
      // Delete old avatar if exists
      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      setProfile({ ...profile, avatar_url: publicUrl });
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi alterada com sucesso.",
      });

    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar a foto de perfil.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/#pricing-section';
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'text-gray-600 bg-gray-100';
      case 'monthly': return 'text-blue-600 bg-blue-100';
      case 'annual': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'free': return 'Gratuito';
      case 'monthly': return 'Mensal';
      case 'annual': return 'Anual';
      default: return 'Gratuito';
    }
  };

  const getSupportInfo = () => {
    if (profile?.plan_type === 'monthly' || profile?.plan_type === 'annual') {
      return {
        type: 'premium',
        title: 'Suporte Premium',
        description: 'WhatsApp e Email',
        contact: '+55 (11) 99999-9999',
        email: 'support@wiizeflow.com.br',
        icon: MessageCircle
      };
    } else {
      return {
        type: 'free',
        title: 'Suporte Gratuito',
        description: 'Email apenas',
        contact: null,
        email: 'support@wiizeflow.com.br',
        icon: Mail
      };
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Target className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>;
  }

  if (!user || !profile) {
    return <div>Carregando...</div>;
  }

  const supportInfo = getSupportInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/7f16165c-d306-4571-8b04-5c0136a778b4.png" 
              alt="WiizeFlow Logo" 
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              Painel
            </Button>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Minha Conta</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-lg">
                      {profile.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                    >
                      {uploadingPhoto ? (
                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 mr-2" />
                      )}
                      {uploadingPhoto ? 'Enviando...' : 'Alterar Foto'}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    {isEditing ? (
                      <div className="flex space-x-2 mt-1">
                        <Input
                          id="name"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                        <Button onClick={handleSaveProfile} size="sm" className="bg-green-600 hover:bg-green-700">Salvar</Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-900">{profile.name || 'Nome não definido'}</span>
                        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email || ''} disabled className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="password">Alterar Senha</Label>
                    <div className="space-y-3 mt-1">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirmar nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button 
                        onClick={handleChangePassword} 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        disabled={changingPassword}
                      >
                        {changingPassword ? 'Alterando...' : 'Alterar Senha'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Plan Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Plano Atual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(profile.plan_type)}`}>
                    {getPlanName(profile.plan_type)}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <span className="text-lg font-semibold text-green-600">Ativo</span>
                  </div>

                  <Button onClick={handleUpgrade} className="w-full bg-green-600 hover:bg-green-700">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {profile.plan_type === 'free' ? 'Fazer Upgrade' : 'Gerenciar Plano'}
                  </Button>
                </CardContent>
              </Card>

              {/* Support Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <supportInfo.icon className="w-5 h-5 mr-2" />
                    {supportInfo.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{supportInfo.description}</p>
                  
                  {supportInfo.contact && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">WhatsApp:</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(`https://wa.me/5511999999999?text=Olá, preciso de suporte técnico.`, '_blank')}
                      >
                        {supportInfo.contact}
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Email:</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(`mailto:${supportInfo.email}?subject=Suporte WiizeFlow`, '_blank')}
                    >
                      {supportInfo.email}
                    </Button>
                  </div>

                  {profile.plan_type === 'free' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700 text-center">
                        Upgrade para ter suporte prioritário via WhatsApp
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
