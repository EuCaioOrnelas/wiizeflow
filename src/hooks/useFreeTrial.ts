
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

interface UseTrialReturn {
  isExpired: boolean;
  daysRemaining: number;
  expiresAt: Date | null;
  loading: boolean;
}

export const useFreeTrial = (user: User | null, profile: any): UseTrialReturn => {
  const [isExpired, setIsExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) {
      setLoading(true);
      return;
    }

    console.log('🔄 useFreeTrial: Checking trial status for user:', user.email);
    console.log('📋 Profile data:', {
      planType: profile.plan_type,
      freeTrialExpiresAt: profile.free_trial_expires_at,
      subscriptionStatus: profile.subscription_status
    });

    try {
      // Se não é plano gratuito, não há teste gratuito para verificar
      if (profile.plan_type !== 'free') {
        console.log('✅ User has paid plan, no trial to check');
        setIsExpired(false);
        setDaysRemaining(0);
        setExpiresAt(null);
        setLoading(false);
        return;
      }

      // Se não tem data de expiração do trial, não está expirado
      if (!profile.free_trial_expires_at) {
        console.log('⚠️ No trial expiration date set, assuming not expired');
        setIsExpired(false);
        setDaysRemaining(30);
        setExpiresAt(null);
        setLoading(false);
        return;
      }

      const expirationDate = new Date(profile.free_trial_expires_at);
      const now = new Date();
      const timeDiff = expirationDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      console.log('📅 Trial calculation:', {
        expirationDate: expirationDate.toISOString(),
        now: now.toISOString(),
        timeDiff,
        daysDiff
      });

      setExpiresAt(expirationDate);
      setDaysRemaining(Math.max(0, daysDiff));
      
      // Considerar expirado se passou da data ou se restam 0 dias
      const expired = daysDiff <= 0;
      setIsExpired(expired);

      console.log('🎯 Trial status:', {
        isExpired: expired,
        daysRemaining: Math.max(0, daysDiff),
        expiresAt: expirationDate
      });

    } catch (error) {
      console.error('❌ Error calculating trial status:', error);
      // Em caso de erro, assumir que não está expirado para não bloquear o usuário
      setIsExpired(false);
      setDaysRemaining(0);
      setExpiresAt(null);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  return {
    isExpired,
    daysRemaining,
    expiresAt,
    loading
  };
};
