import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Target, LogOut, Edit3, User, CreditCard, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom";
import { DeleteFunnelDialog } from "@/components/DeleteFunnelDialog";
import NotificationBell from "@/components/NotificationBell";

interface Funnel {
  id: string;
  name: string;
  canvas_data: any;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingFunnel, setCreatingFunnel] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [funnelToDelete, setFunnelToDelete] = useState<Funnel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingFunnelId, setEditingFunnelId] = useState<string | null>(null);
  const [editingFunnelName, setEditingFunnelName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth');
        } else {
          loadUserData(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/auth');
      } else {
        loadUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserData = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        toast({
          title: "Erro",
          description: "Erro ao carregar perfil do usuário.",
          variant: "destructive",
        });
        return;
      }

      setProfile(profileData);

      const { data: funnelsData, error: funnelsError } = await supabase
        .from('funnels')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (funnelsError) {
        console.error('Error loading funnels:', funnelsError);
        toast({
          title: "Erro",
          description: "Erro ao carregar funis.",
          variant: "destructive",
        });
        return;
      }

      setFunnels(funnelsData || []);

    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do usuário.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const createNewFunnel = async () => {
    if (!user || !profile) return;

    const funnelLimit = profile.plan_type === 'free' ? 2 : 'unlimited';
    const isLimitReached = funnelLimit === 2 && funnels.length >= 2;
    
    if (isLimitReached) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite do seu plano gratuito. Faça upgrade para continuar criando funis.",
        variant: "destructive",
      });
      return;
    }

    setCreatingFunnel(true);

    try {
      const { data: newFunnel, error } = await supabase
        .from('funnels')
        .insert({
          user_id: user.id,
          name: `Funil ${funnels.length + 1}`,
          canvas_data: { nodes: [], edges: [] }
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating funnel:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar novo funil.",
          variant: "destructive",
        });
        return;
      }

      setFunnels(prev => [newFunnel, ...prev]);

      toast({
        title: "Sucesso!",
        description: "Novo funil criado com sucesso.",
      });

      navigate(`/builder/${newFunnel.id}`);

    } catch (error) {
      console.error('Error creating funnel:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar funil.",
        variant: "destructive",
      });
    } finally {
      setCreatingFunnel(false);
    }
  };

  const handleDeleteFunnel = (funnel: Funnel) => {
    setFunnelToDelete(funnel);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteFunnel = async () => {
    if (!funnelToDelete || !user) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', funnelToDelete.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting funnel:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir funil.",
          variant: "destructive",
        });
        return;
      }

      setFunnels(prev => prev.filter(f => f.id !== funnelToDelete.id));

      toast({
        title: "Funil excluído!",
        description: `O funil "${funnelToDelete.name}" foi excluído permanentemente.`,
      });

      setDeleteDialogOpen(false);
      setFunnelToDelete(null);

    } catch (error) {
      console.error('Error deleting funnel:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir funil.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openFunnel = (funnelId: string) => {
    navigate(`/builder/${funnelId}`);
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const handleAccount = () => {
    navigate('/account');
  };

  const startEditingFunnelName = (funnel: Funnel) => {
    setEditingFunnelId(funnel.id);
    setEditingFunnelName(funnel.name);
  };

  const cancelEditingFunnelName = () => {
    setEditingFunnelId(null);
    setEditingFunnelName("");
  };

  const saveFunnelName = async (funnelId: string) => {
    if (!user || !editingFunnelName.trim()) return;

    setIsUpdatingName(true);

    try {
      const { error } = await supabase
        .from('funnels')
        .update({ name: editingFunnelName.trim() })
        .eq('id', funnelId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating funnel name:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar nome do funil.",
          variant: "destructive",
        });
        return;
      }

      setFunnels(prev => prev.map(f => 
        f.id === funnelId ? { ...f, name: editingFunnelName.trim() } : f
      ));

      toast({
        title: "Nome atualizado!",
        description: "O nome do funil foi atualizado com sucesso.",
      });

      setEditingFunnelId(null);
      setEditingFunnelName("");

    } catch (error) {
      console.error('Error updating funnel name:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar nome do funil.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingName(false);
    }
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

  const getFunnelLimit = () => {
    return profile?.plan_type === 'free' ? 2 : 'Ilimitados';
  };

  const getRemainingFunnels = () => {
    if (profile?.plan_type !== 'free') {
      return "∞";
    }
    return Math.max(0, 2 - funnels.length);
  };

  const getProgressPercentage = () => {
    if (profile?.plan_type !== 'free') {
      return 0;
    }
    return (funnels.length / 2) * 100;
  };

  const isAtLimit = () => {
    return profile?.plan_type === 'free' && funnels.length >= 2;
  };

  const hasTemplateAccess = () => {
    return profile?.plan_type !== 'free';
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

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white border-b transition-colors duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-green-600" style={{ color: 'rgb(6, 214, 160)' }} />
            <span className="text-2xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(profile.plan_type)}`}>
              Plano {getPlanName(profile.plan_type)}
            </div>
            <span className="text-gray-600">Olá, {profile.name || user.email}!</span>
            <NotificationBell />
            <Button variant="outline" onClick={handleAccount} size="sm">
              <User className="w-4 h-4 mr-2" />
              Conta
            </Button>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Usage Stats - 3 cards layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Funis Criados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{funnels.length}</span>
                <span className="text-sm text-gray-500">de {getFunnelLimit()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${getProgressPercentage()}%`,
                    backgroundColor: 'rgb(6, 214, 160)'
                  }}
                ></div>
              </div>
              {isAtLimit() && (
                <p className="text-xs text-orange-600 mt-2">Limite atingido</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Plano Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{getPlanName(profile.plan_type)}</span>
                <Button onClick={handleUpgrade} size="sm" variant="outline">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-xl font-bold">
                {hasTemplateAccess() ? 'Disponível' : 'Bloqueado'}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {hasTemplateAccess() ? 'Acesso completo' : 'Upgrade para usar'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Funis</h1>
            <p className="text-gray-600">Crie e gerencie seus funis de vendas</p>
          </div>
          
          <Button 
            onClick={createNewFunnel} 
            className={`${isAtLimit() ? 'bg-gray-400 cursor-not-allowed' : ''}`}
            style={!isAtLimit() ? { backgroundColor: 'rgb(6, 214, 160)' } : {}}
            disabled={isAtLimit() || creatingFunnel}
          >
            <Plus className="w-5 h-5 mr-2" />
            {creatingFunnel ? 'Criando...' : 'Novo Funil'}
          </Button>
        </div>

        {profile.plan_type === 'free' && (
          <div className="bg-gradient-to-r from-blue-500 to-green-600 text-white p-6 rounded-lg mb-8" style={{
            background: 'linear-gradient(to right, rgb(59, 130, 246), rgb(6, 214, 160))'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🚀 Desbloqueie todo o potencial</h3>
                <p className="mb-2">Com os planos pagos você tem:</p>
                <ul className="text-sm space-y-1">
                  <li>• Funis ilimitados</li>
                  <li>• Acesso a todos os templates</li>
                  <li>• Suporte prioritário</li>
                  <li>• Análises detalhadas</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-4 rounded-lg mb-3">
                  <div className="text-2xl font-bold">R$ 47</div>
                  <div className="text-sm">por mês</div>
                </div>
                <Button onClick={handleUpgrade} variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Ver Planos
                </Button>
              </div>
            </div>
          </div>
        )}

        {isAtLimit() && (
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Limite de funis atingido!</h3>
                <p>Você atingiu o limite do plano {getPlanName(profile.plan_type)}. Faça upgrade para continuar criando funis!</p>
              </div>
              <Button onClick={handleUpgrade} variant="secondary">
                Fazer Upgrade
              </Button>
            </div>
          </div>
        )}

        {funnels.length === 0 ? (
          <div className="text-center py-16">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum funil criado ainda
            </h3>
            <p className="text-gray-500 mb-6">
              Comece criando seu primeiro funil de vendas
            </p>
            <Button 
              onClick={createNewFunnel}
              style={{ backgroundColor: 'rgb(6, 214, 160)' }}
              disabled={creatingFunnel}
            >
              <Plus className="w-5 h-5 mr-2" />
              {creatingFunnel ? 'Criando...' : 'Criar Primeiro Funil'}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funnels.map((funnel) => (
              <Card key={funnel.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {editingFunnelId === funnel.id ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <Input
                          value={editingFunnelName}
                          onChange={(e) => setEditingFunnelName(e.target.value)}
                          className="flex-1"
                          autoFocus
                          disabled={isUpdatingName}
                        />
                        <Button
                          size="sm"
                          onClick={() => saveFunnelName(funnel.id)}
                          disabled={isUpdatingName || !editingFunnelName.trim()}
                          style={{ backgroundColor: 'rgb(6, 214, 160)' }}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditingFunnelName}
                          disabled={isUpdatingName}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span>{funnel.name}</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingFunnelName(funnel);
                            }}
                            className="p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFunnel(funnel);
                            }}
                            className="p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Criado em {new Date(funnel.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    {funnel.canvas_data?.nodes?.length || 0} blocos
                  </p>
                  <Button 
                    onClick={() => openFunnel(funnel.id)}
                    className="w-full"
                    style={{ backgroundColor: 'rgb(6, 214, 160)' }}
                    variant="outline"
                  >
                    Abrir Funil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteFunnelDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setFunnelToDelete(null);
        }}
        onConfirm={confirmDeleteFunnel}
        funnelName={funnelToDelete?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
