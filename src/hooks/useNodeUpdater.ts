
import { useCallback } from 'react';
import { CustomNodeData } from '@/types/canvas';

interface UseNodeUpdaterProps {
  onUpdateNode?: (nodeId: string, updates: Partial<CustomNodeData>) => void;
}

export const useNodeUpdater = ({ onUpdateNode }: UseNodeUpdaterProps) => {
  const updateNodeData = useCallback((nodeId: string, updates: Partial<CustomNodeData>) => {
    if (onUpdateNode && Object.keys(updates).length > 0) {
      onUpdateNode(nodeId, updates);
    }
  }, [onUpdateNode]);

  return {
    updateNodeData,
  };
};
