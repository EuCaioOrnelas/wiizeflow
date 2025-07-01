import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from '@supabase/supabase-js';
import { InfiniteCanvas } from "@/components/canvas/InfiniteCanvas";
import { Node, Edge } from "@xyflow/react";
import { CustomNodeData } from "@/types/canvas";
import { FunnelDashboard } from "@/components/canvas/FunnelDashboard";

interface Funnel {
  id: string;
  name: string;
  canvas_data: any;
  user_id: string;
}

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  const loadUserProfile = useCallback(async (userId: string, retryCount = 0) => {
    try {
      console.log('Loading user profile for ID:', userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        
        // Se o perfil não existe, tentar criar um
        if (profileError.code === 'PGRST116' && retryCount < 2) {
          console.log('Profile not found, attempting to create...');
          
          // Buscar dados do usuário autenticado
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser) {
            // Criar perfil manualmente
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: authUser.id,
                email: authUser.email,
                name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || 'Usuário',
                plan_type: 'free',
                funnel_count: 0,
                free_trial_started_at: new Date().toISOString(),
                free_trial_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
              throw createError;
            } else {
              console.log('Profile created successfully:', newProfile);
              return newProfile;
            }
          }
        }
        
        throw profileError;
      }

      console.log('Profile loaded:', profileData);
      return profileData;
      
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      
      if (retryCount < 2) {
        console.log(`Retrying profile load (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loadUserProfile(userId, retryCount + 1);
      } else {
        throw error;
      }
    }
  }, []);

  const loadFunnelData = useCallback(async (funnelId: string) => {
    try {
      console.log('Loading funnel data for ID:', funnelId);
      
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', funnelId)
        .single();

      if (funnelError) {
        console.error('Error fetching funnel:', funnelError);
        toast({
          title: "Erro",
          description: "Erro ao carregar funil.",
          variant: "destructive",
        });
        return;
      }

      if (!funnelData) {
        console.log('Funnel not found');
        setFunnel(null);
        return;
      }

      console.log('Funnel data loaded:', funnelData);
      setFunnel(funnelData);

    } catch (error) {
      console.error('Error loading funnel data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do funil.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveCanvasData = async (canvasData: { nodes: Node<CustomNodeData>[]; edges: Edge[] }) => {
    if (!funnel) return;

    try {
      const { error } = await supabase
        .from('funnels')
        .update({
          canvas_data: canvasData as any
        })
        .eq('id', funnel.id);

      if (error) {
        console.error('Error saving canvas data:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar dados do funil.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: "Dados do funil salvos com sucesso.",
      });

    } catch (error) {
      console.error('Error during save:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar funil.",
        variant: "destructive",
      });
    }
  };

  const handleFunnelNameChange = async (newName: string) => {
    if (!funnel) return;

    try {
      const { error } = await supabase
        .from('funnels')
        .update({ name: newName })
        .eq('id', funnel.id);

      if (error) {
        console.error('Error updating funnel name:', error);
        return;
      }

      setFunnel(prev => prev ? { ...prev, name: newName } : null);
    } catch (error) {
      console.error('Error updating funnel name:', error);
    }
  };

  const handleOpenDashboard = () => {
    console.log('Opening dashboard...');
    setShowDashboard(true);
  };

  useEffect(() => {
    const initializeBuilder = async () => {
      try {
        console.log('Initializing builder...');
        
        // Verificar sessão existente primeiro
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          navigate('/auth');
          return;
        }

        if (!currentSession?.user) {
          console.log('No active session, redirecting to auth');
          navigate('/auth');
          return;
        }

        console.log('Session found for user:', currentSession.user.email);
        setUser(currentSession.user);
        
        // Carregar dados do usuário com retry
        try {
          const profileData = await loadUserProfile(currentSession.user.id);
          setProfile(profileData);

          // Verificar se o trial expirou e redirecionar silenciosamente
          if (profileData.plan_type === 'free' && profileData.free_trial_expires_at) {
            const expiresAt = new Date(profileData.free_trial_expires_at);
            const now = new Date();
            
            if (expiresAt.getTime() <= now.getTime()) {
              console.log('Trial expired, redirecting to trial-expired page');
              navigate('/trial-expired');
              return;
            }
          }

          // Carregar dados do funil
          if (id) {
            await loadFunnelData(id);
          }

        } catch (profileError) {
          console.error('Failed to load user profile after retries:', profileError);
          toast({
            title: "Erro",
            description: "Erro ao carregar perfil do usuário. Tente fazer login novamente.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

      } catch (error) {
        console.error('Error initializing builder:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    initializeBuilder();
  }, [id, navigate, toast, loadFunnelData, loadUserProfile]);

  // Preparar dados iniciais do canvas
  const initialCanvasData = useMemo(() => {
    if (!funnel?.canvas_data) {
      return { nodes: [], edges: [] };
    }

    const canvasData = funnel.canvas_data;
    if (canvasData && typeof canvasData === 'object') {
      return {
        nodes: (canvasData as any).nodes || [],
        edges: (canvasData as any).edges || []
      };
    }

    return { nodes: [], edges: [] };
  }, [funnel?.canvas_data]);

  if (loading || !user || !profile) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (!funnel) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Funil não encontrado</h2>
          <p className="text-gray-600 mb-4">O funil que você está procurando não existe ou foi removido.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      <InfiniteCanvas
        funnelId={funnel.id}
        funnelName={funnel.name}
        onFunnelNameChange={handleFunnelNameChange}
        initialCanvasData={initialCanvasData}
        onSave={saveCanvasData}
        onOpenDashboard={handleOpenDashboard}
      />
      
      {showDashboard && (
        <FunnelDashboard
          isOpen={showDashboard}
          onClose={() => setShowDashboard(false)}
          funnelId={funnel.id}
          funnelName={funnel.name}
        />
      )}
    </div>
  );
};

export default Builder;
