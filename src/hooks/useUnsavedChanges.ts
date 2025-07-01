
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseUnsavedChangesProps {
  hasUnsavedChanges: boolean;
  onSave: () => Promise<void> | void;
}

export const useUnsavedChanges = ({ hasUnsavedChanges, onSave }: UseUnsavedChangesProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const blockingRef = useRef<boolean>(false);

  // Handle browser back/forward and page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Deseja salvá-las antes de sair?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const navigateWithGuard = useCallback((path: string) => {
    if (hasUnsavedChanges && !blockingRef.current) {
      setPendingNavigation(path);
      setShowSaveDialog(true);
      return;
    }
    navigate(path);
  }, [hasUnsavedChanges, navigate]);

  const handleSaveAndNavigate = useCallback(async () => {
    try {
      await onSave();
      setShowSaveDialog(false);
      if (pendingNavigation) {
        blockingRef.current = true;
        navigate(pendingNavigation);
        setPendingNavigation(null);
        // Reset blocking after navigation
        setTimeout(() => {
          blockingRef.current = false;
        }, 100);
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  }, [onSave, navigate, pendingNavigation]);

  const handleDiscardAndNavigate = useCallback(() => {
    setShowSaveDialog(false);
    if (pendingNavigation) {
      blockingRef.current = true;
      navigate(pendingNavigation);
      setPendingNavigation(null);
      // Reset blocking after navigation
      setTimeout(() => {
        blockingRef.current = false;
      }, 100);
    }
  }, [navigate, pendingNavigation]);

  const handleCancelNavigation = useCallback(() => {
    setShowSaveDialog(false);
    setPendingNavigation(null);
  }, []);

  return {
    showSaveDialog,
    navigateWithGuard,
    handleSaveAndNavigate,
    handleDiscardAndNavigate,
    handleCancelNavigation,
  };
};
