
import { useCallback, useState, useRef } from 'react';
import { CanvasState, CustomNodeData } from '@/types/canvas';
import { Node, Edge } from '@xyflow/react';

export const useCanvasHistory = () => {
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const currentState = useRef<CanvasState | null>(null);

  const saveToHistory = useCallback((nodes: Node<CustomNodeData>[], edges: Edge[]) => {
    const newState: CanvasState = { nodes: [...nodes], edges: [...edges] };
    
    // Se há um estado atual e é diferente do novo estado
    if (currentState.current && JSON.stringify(currentState.current) === JSON.stringify(newState)) {
      return; // Não salva se o estado é o mesmo
    }

    setHistory(prev => {
      // Remove estados futuros se estamos no meio do histórico
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      
      // Limita o histórico a 50 estados
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setHistoryIndex(prev => {
      const newIndex = Math.min(prev + 1, 49);
      return newIndex;
    });
    
    currentState.current = newState;
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      currentState.current = prevState;
      return prevState;
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      currentState.current = nextState;
      return nextState;
    }
    return null;
  }, [history, historyIndex]);

  const initializeHistory = useCallback((nodes: Node<CustomNodeData>[], edges: Edge[]) => {
    const initialState: CanvasState = { nodes: [...nodes], edges: [...edges] };
    setHistory([initialState]);
    setHistoryIndex(0);
    currentState.current = initialState;
  }, []);

  return {
    saveToHistory,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    setHistoryIndex,
    initializeHistory,
    history
  };
};
