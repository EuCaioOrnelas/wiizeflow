
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkCookieConsent = async () => {
      try {
        // Verificar se o usuário está logado
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Usuário logado - verificar no banco de dados
          const { data: profile } = await supabase
            .from('profiles')
            .select('cookies_accepted')
            .eq('id', session.user.id)
            .single();

          if (profile?.cookies_accepted) {
            setShowBanner(false);
            return;
          }

          // Se não aceitou no banco, verificar localStorage para sincronizar
          const localConsent = localStorage.getItem('cookiesAccepted');
          if (localConsent === 'true') {
            // Sincronizar com o banco
            await supabase
              .from('profiles')
              .update({ cookies_accepted: true })
              .eq('id', session.user.id);
            setShowBanner(false);
            return;
          }
        } else {
          // Usuário não logado - verificar apenas localStorage
          const localConsent = localStorage.getItem('cookiesAccepted');
          if (localConsent === 'true') {
            setShowBanner(false);
            return;
          }
        }

        // Se chegou até aqui, mostrar o banner
        setShowBanner(true);
      } catch (error) {
        console.error('Erro ao verificar consentimento de cookies:', error);
        // Em caso de erro, não mostrar o banner para não afetar a experiência
        setShowBanner(false);
      }
    };

    checkCookieConsent();
  }, []);

  const handleAcceptCookies = async () => {
    setIsLoading(true);
    
    try {
      // Salvar no localStorage
      localStorage.setItem('cookiesAccepted', 'true');

      // Se o usuário estiver logado, salvar também no banco
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('profiles')
          .update({ cookies_accepted: true })
          .eq('id', session.user.id);
      }

      setShowBanner(false);
    } catch (error) {
      console.error('Erro ao aceitar cookies:', error);
      toast({
        title: "Erro",
        description: "Houve um problema ao salvar suas preferências.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-6xl mx-auto">
          <p className="text-sm text-gray-700 text-center sm:text-left">
            🍪 Usamos cookies para melhorar sua experiência.
          </p>
          <Button
            onClick={handleAcceptCookies}
            disabled={isLoading}
            className="bg-[rgb(6,214,160)] hover:bg-[#FFD166] text-white hover:text-[#2B2D42] font-medium px-6 py-2 rounded-lg transition-colors min-w-[100px]"
          >
            {isLoading ? "..." : "Aceitar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
