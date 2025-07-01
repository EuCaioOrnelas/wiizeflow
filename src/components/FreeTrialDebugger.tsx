
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from '@supabase/supabase-js';

export const FreeTrialDebugger = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    try {
      // Verificar sessão atual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        setDebugInfo(prev => ({ ...prev, sessionError: sessionError.message }));
        setLoading(false);
        return;
      }

      if (!session?.user) {
        setDebugInfo(prev => ({ ...prev, sessionStatus: 'No active session' }));
        setLoading(false);
        return;
      }

      setUser(session.user);
      setDebugInfo(prev => ({ 
        ...prev, 
        sessionStatus: 'Active session found',
        userId: session.user.id,
        userEmail: session.user.email
      }));

      // Carregar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        setDebugInfo(prev => ({ ...prev, profileError: profileError.message }));
        setLoading(false);
        return;
      }

      setProfile(profileData);
      
      // Calcular status do trial
      const now = new Date();
      const expiresAt = profileData?.free_trial_expires_at ? new Date(profileData.free_trial_expires_at) : null;
      const timeDiff = expiresAt ? expiresAt.getTime() - now.getTime() : null;
      const daysRemaining = timeDiff ? Math.ceil(timeDiff / (1000 * 3600 * 24)) : null;
      const isExpired = timeDiff ? timeDiff <= 0 : false;

      setDebugInfo(prev => ({
        ...prev,
        profileLoaded: true,
        planType: profileData.plan_type,
        freeTrialStartedAt: profileData.free_trial_started_at,
        freeTrialExpiresAt: profileData.free_trial_expires_at,
        currentTime: now.toISOString(),
        timeDiff: timeDiff,
        daysRemaining: daysRemaining,
        isExpired: isExpired,
        shouldRedirect: isExpired && profileData.plan_type === 'free'
      }));

    } catch (error: any) {
      console.error('Debug error:', error);
      setDebugInfo(prev => ({ ...prev, unexpectedError: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const forceExpireTrial = async () => {
    if (!user) return;

    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { error } = await supabase
        .from('profiles')
        .update({ 
          free_trial_expires_at: yesterday.toISOString(),
          free_trial_started_at: new Date(Date.now() - (31 * 24 * 60 * 60 * 1000)).toISOString() // 31 dias atrás
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error forcing expiration:', error);
        return;
      }

      await loadDebugInfo();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const resetTrial = async () => {
    if (!user) return;

    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const { error } = await supabase
        .from('profiles')
        .update({ 
          free_trial_expires_at: futureDate.toISOString(),
          free_trial_started_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error resetting trial:', error);
        return;
      }

      await loadDebugInfo();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const testRedirection = () => {
    navigate('/trial-expired');
  };

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Carregando informações de debug...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔍 Free Trial Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Status da Sessão */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">📋 Status da Sessão</h3>
          <div className="space-y-1 text-sm">
            <div><strong>Status:</strong> {debugInfo.sessionStatus || 'Unknown'}</div>
            {debugInfo.userId && <div><strong>User ID:</strong> {debugInfo.userId}</div>}
            {debugInfo.userEmail && <div><strong>Email:</strong> {debugInfo.userEmail}</div>}
            {debugInfo.sessionError && <div className="text-red-600"><strong>Erro:</strong> {debugInfo.sessionError}</div>}
          </div>
        </div>

        {/* Status do Perfil */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">👤 Status do Perfil</h3>
          <div className="space-y-1 text-sm">
            <div><strong>Perfil Carregado:</strong> {debugInfo.profileLoaded ? 'Sim' : 'Não'}</div>
            {debugInfo.planType && <div><strong>Tipo de Plano:</strong> {debugInfo.planType}</div>}
            {debugInfo.freeTrialStartedAt && <div><strong>Trial Iniciado:</strong> {new Date(debugInfo.freeTrialStartedAt).toLocaleString('pt-BR')}</div>}
            {debugInfo.freeTrialExpiresAt && <div><strong>Trial Expira:</strong> {new Date(debugInfo.freeTrialExpiresAt).toLocaleString('pt-BR')}</div>}
            {debugInfo.profileError && <div className="text-red-600"><strong>Erro:</strong> {debugInfo.profileError}</div>}
          </div>
        </div>

        {/* Cálculos do Trial */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">⏰ Cálculos do Free Trial</h3>
          <div className="space-y-1 text-sm">
            <div><strong>Hora Atual:</strong> {debugInfo.currentTime && new Date(debugInfo.currentTime).toLocaleString('pt-BR')}</div>
            <div><strong>Diferença de Tempo (ms):</strong> {debugInfo.timeDiff}</div>
            <div><strong>Dias Restantes:</strong> {debugInfo.daysRemaining}</div>
            <div><strong>Está Expirado:</strong> <span className={debugInfo.isExpired ? 'text-red-600 font-bold' : 'text-green-600'}>{debugInfo.isExpired ? 'SIM' : 'NÃO'}</span></div>
            <div><strong>Deve Redirecionar:</strong> <span className={debugInfo.shouldRedirect ? 'text-red-600 font-bold' : 'text-green-600'}>{debugInfo.shouldRedirect ? 'SIM' : 'NÃO'}</span></div>
          </div>
        </div>

        {/* Ações de Teste */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">🧪 Ações de Teste</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={forceExpireTrial} variant="destructive" size="sm">
              Forçar Expiração do Trial
            </Button>
            <Button onClick={resetTrial} variant="outline" size="sm">
              Resetar Trial (30 dias)
            </Button>
            <Button onClick={testRedirection} variant="secondary" size="sm">
              Testar Redirecionamento
            </Button>
            <Button onClick={loadDebugInfo} variant="outline" size="sm">
              Recarregar Info
            </Button>
          </div>
        </div>

        {/* Informações de Erro */}
        {debugInfo.unexpectedError && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-red-800">❌ Erro Inesperado</h3>
            <div className="text-sm text-red-700">{debugInfo.unexpectedError}</div>
          </div>
        )}

        {/* JSON Raw para Debug */}
        <details className="bg-gray-100 p-4 rounded-lg">
          <summary className="font-semibold cursor-pointer">🔍 Dados Raw (JSON)</summary>
          <pre className="mt-2 text-xs overflow-auto bg-white p-2 rounded border">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>

      </CardContent>
    </Card>
  );
};
