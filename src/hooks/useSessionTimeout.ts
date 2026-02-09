import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export const useSessionTimeout = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!user) return;
    timerRef.current = setTimeout(async () => {
      toast({ title: 'Session expired', description: 'You were logged out due to inactivity.' });
      await signOut();
      window.location.href = '/login';
    }, TIMEOUT_MS);
  }, [user, signOut, toast]);

  useEffect(() => {
    if (!user) return;
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, resetTimer]);
};
