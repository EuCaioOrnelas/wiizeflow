import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  Edit, 
  Trash2, 
  LogOut, 
  User, 
  Crown,
  CreditCard,
  Settings,
  Target
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DeleteFunnelDialog } from "@/components/DeleteFunnelDialog";

interface Funnel {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [userName, setUserName] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [funnelToDelete, setFunnelToDelete] = useState<Funnel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const MAX_FUNNELS_FREE = 3;

  useEffect(() => {
    loadUserData();
    loadFunnels();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      // Carregar dados do perfil do usuário
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('name, plan_type')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setUserName(profileData.name || 'Usuário');
      setUserPlan(profileData.plan_type || 'free');
      
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadFunnels = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      const { data: funnelsData, error } = await supabase
        .from('funnels')
        .select('id, name, created_at, updated_at')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading funnels:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar funis.",
          variant: "destructive",
        });
        return;
      }

      setFunnels(funnelsData || []);
    } catch (error) {
      console.error('Error loading funnels:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFunnel = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      // Verificar limite de funis para usuários gratuitos
      if (userPlan === 'free' && funnels.length >= MAX_FUNNELS_FREE) {
        toast({
          title: "Limite atingido",
          description: `Usuários do plano gratuito podem criar até ${MAX_FUNNELS_FREE} funis. Faça upgrade para criar mais.`,
          variant: "destructive",
        });
        return;
      }

      const { data: newFunnel, error } = await supabase
        .from('funnels')
        .insert({
          name: `Novo Funil ${funnels.length + 1}`,
          user_id: session.user.id,
          canvas_data: { nodes: [], edges: [] }
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating funnel:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar funil.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Funil criado!",
        description: "Seu novo funil foi criado com sucesso.",
      });

      // Navegar para o editor do funil criado
      navigate(`/builder/${newFunnel.id}`);
      
    } catch (error) {
      console.error('Error creating funnel:', error);
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao criar funil.",
        variant: "destructive",
      });
    }
  };

  const deleteFunnel = async (funnelId: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', funnelId);

      if (error) {
        console.error('Error deleting funnel:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar funil.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Funil deletado!",
        description: "O funil foi deletado com sucesso.",
      });

      // Recarregar lista de funis
      loadFunnels();
      
    } catch (error) {
      console.error('Error deleting funnel:', error);
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao deletar funil.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlanBadge = () => {
    switch (userPlan) {
      case 'monthly':
        return <Badge className="bg-blue-100 text-blue-800">Mensal</Badge>;
      case 'annual':
        return <Badge className="bg-yellow-100 text-yellow-800">Anual</Badge>;
      default:
        return <Badge variant="secondary">Gratuito</Badge>;
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/7f16165c-d306-4571-8b04-5c0136a778b4.png" 
                alt="WiizeFlow Logo" 
                className="w-8 h-8"
              />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">WiizeFlow</span>
            </div>
            {getPlanBadge()}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Olá, {userName}!
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Conta
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/account')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                {userPlan === 'free' && (
                  <DropdownMenuItem onClick={handleUpgrade}>
                    <Crown className="w-4 h-4 mr-2" />
                    Fazer Upgrade
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/pricing')}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Ver Planos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Meus Funis
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {userPlan === 'free' 
                ? `${funnels.length}/${MAX_FUNNELS_FREE} funis criados (plano gratuito)`
                : `${funnels.length} funis criados`
              }
            </p>
          </div>
          
          <Button 
            onClick={createFunnel}
            className="bg-green-600 hover:bg-green-700"
            disabled={userPlan === 'free' && funnels.length >= MAX_FUNNELS_FREE}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Funil
          </Button>
        </div>

        {/* Upgrade Notice */}
        {userPlan === 'free' && funnels.length >= MAX_FUNNELS_FREE && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Limite de funis atingido
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Faça upgrade para criar funis ilimitados e desbloquear recursos avançados.
                  </p>
                </div>
              </div>
              <Button onClick={handleUpgrade} className="bg-yellow-600 hover:bg-yellow-700">
                Ver Planos
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Funnels Grid */}
        {funnels.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum funil criado ainda
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Crie seu primeiro funil para começar a visualizar suas estratégias de marketing.
              </p>
              <Button 
                onClick={createFunnel}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Funil
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funnels.map((funnel) => (
              <Card key={funnel.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/builder/${funnel.id}`)}
                  >
                    <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                      {funnel.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Atualizado em {formatDate(funnel.updated_at)}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/builder/${funnel.id}`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setFunnelToDelete(funnel);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                
                <CardContent 
                  className="cursor-pointer"
                  onClick={() => navigate(`/builder/${funnel.id}`)}
                >
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clique para editar
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteFunnelDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setFunnelToDelete(null);
        }}
        onConfirm={() => {
          if (funnelToDelete) {
            deleteFunnel(funnelToDelete.id);
            setIsDeleteDialogOpen(false);
            setFunnelToDelete(null);
          }
        }}
        funnelName={funnelToDelete?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
