
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AccountLimitStatus {
  canCreateAccount: boolean;
  accountCount: number;
  loading: boolean;
}

export const useAccountLimiting = () => {
  const [limitStatus, setLimitStatus] = useState<AccountLimitStatus>({
    canCreateAccount: true,
    accountCount: 0,
    loading: true
  });

  useEffect(() => {
    checkAccountLimit();
    setFingerprint();
  }, []);

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP:', error);
      return 'unknown';
    }
  };

  const setFingerprint = () => {
    const existingFingerprint = localStorage.getItem('account_fingerprint');
    if (!existingFingerprint) {
      const fingerprint = generateFingerprint();
      localStorage.setItem('account_fingerprint', fingerprint);
    }
  };

  const generateFingerprint = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Fingerprint test', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).slice(0, 32);
  };

  const checkAccountLimit = async () => {
    try {
      const clientIP = await getClientIP();
      
      const { data, error } = await supabase.rpc('check_ip_account_limit', {
        client_ip: clientIP
      });

      if (error) {
        console.error('Error checking account limit:', error);
        setLimitStatus({
          canCreateAccount: true,
          accountCount: 0,
          loading: false
        });
        return;
      }

      const accountCount = data || 0;
      const canCreateAccount = accountCount < 3; // Máximo 3 contas por IP em 30 dias

      setLimitStatus({
        canCreateAccount,
        accountCount,
        loading: false
      });

    } catch (error) {
      console.error('Error in checkAccountLimit:', error);
      setLimitStatus({
        canCreateAccount: true,
        accountCount: 0,
        loading: false
      });
    }
  };

  const trackAccountCreation = async (email: string, userId?: string) => {
    try {
      const clientIP = await getClientIP();
      const fingerprint = localStorage.getItem('account_fingerprint') || generateFingerprint();

      const { error } = await supabase
        .from('account_creation_tracking')
        .insert({
          ip_address: clientIP,
          email,
          fingerprint,
          user_id: userId
        });

      if (error) {
        console.error('Error tracking account creation:', error);
      }
    } catch (error) {
      console.error('Error in trackAccountCreation:', error);
    }
  };

  return {
    ...limitStatus,
    trackAccountCreation,
    checkAccountLimit
  };
};
