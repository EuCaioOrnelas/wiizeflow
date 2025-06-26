
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  LogOut,
  Crown,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { DeleteFunnelDialog } from "@/components/DeleteFunnelDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface Funnel {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Dashboard = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [deleteFunnelId, setDeleteFunnelId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: funnelsData, error } = await supabase
            .from('funnels')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching funnels:', error);
            toast({
              title: "Erro",
              description: "Erro ao carregar funis.",
              variant: "destructive",
            });
          } else {
            setFunnels(funnelsData || []);
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Erro",
          description: "Erro inesperado ao carregar dados.",
          variant: "destructive",
        });
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate('/auth');
      }
    });
  }, [navigate, toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredFunnels = funnels.filter(funnel =>
    funnel.name.toLowerCase().includes(search.toLowerCase())
  );

  const createNewFunnel = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    const newFunnel = {
      name: "Novo Funil",
      user_id: user.id,
      canvas_data: {
        nodes: [],
        edges: [],
      },
    };

    try {
      const { data, error } = await supabase
        .from('funnels')
        .insert([newFunnel])
        .select()
        .single();

      if (error) {
        console.error('Error creating funnel:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar novo funil.",
          variant: "destructive",
        });
      } else {
        setFunnels(prevFunnels => [data, ...prevFunnels]);
        navigate(`/builder/${data.id}`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar funil.",
        variant: "destructive",
      });
    }
  };

  const editFunnel = (id: string) => {
    navigate(`/builder/${id}`);
  };

  const confirmDeleteFunnel = (id: string) => {
    setDeleteFunnelId(id);
    setIsDeleteDialogOpen(true);
  };

  const cancelDeleteFunnel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteFunnelId(null);
  };

  const deleteFunnel = async () => {
    if (!deleteFunnelId) return;

    try {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', deleteFunnelId);

      if (error) {
        console.error('Error deleting funnel:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir funil.",
          variant: "destructive",
        });
      } else {
        setFunnels(prevFunnels =>
          prevFunnels.filter(funnel => funnel.id !== deleteFunnelId)
        );
        toast({
          title: "Sucesso",
          description: "Funil excluído com sucesso.",
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir funil.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteFunnelId(null);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro",
        description: "Erro ao sair.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Carregando seus funis...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Aguarde enquanto seus funis são carregados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">WiizeFlow</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => window.location.href = '/pricing'}>
              Preços
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2 h-auto">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => navigate('/account')}>
                  <User className="w-4 h-4 mr-2" />
                  Conta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search and Create Funnel */}
        <div className="flex justify-between items-center mb-6">
          <Input
            type="search"
            placeholder="Buscar funil..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Button onClick={createNewFunnel}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Funil
          </Button>
        </div>

        {/* Funnels List */}
        {filteredFunnels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFunnels.map(funnel => (
              <Card key={funnel.id} className="bg-white dark:bg-gray-800 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {funnel.name}
                  </CardTitle>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Criado em: {new Date(funnel.created_at).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => editFunnel(funnel.id)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-2 h-auto">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => confirmDeleteFunnel(funnel.id)} className="text-red-500">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center dark:text-gray-400">
            Nenhum funil encontrado. Crie um novo funil para começar!
          </div>
        )}
      </div>

      {/* Delete Funnel Dialog */}
      <DeleteFunnelDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={deleteFunnel}
        onClose={cancelDeleteFunnel}
        funnelName={
          deleteFunnelId
            ? funnels.find(funnel => funnel.id === deleteFunnelId)?.name || ""
            : ""
        }
        isDeleting={false}
      />
    </div>
  );
};

export default Dashboard;
