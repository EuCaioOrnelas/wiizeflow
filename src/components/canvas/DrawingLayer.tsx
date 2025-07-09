import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useReactFlow } from '@xyflow/react';

export interface DrawingPath {
  id: string;
  path: string;
  color: string;
  strokeWidth: number;
  timestamp: number;
}

export interface DrawingPoint {
  x: number;
  y: number;
}

interface DrawingLayerProps {
  isDrawingMode: boolean;
  drawingColor: string;
  strokeWidth: number;
  drawings: DrawingPath[];
  onDrawingComplete: (drawing: DrawingPath) => void;
  onClearDrawings: () => void;
}

export const DrawingLayer = ({
  isDrawingMode,
  drawingColor,
  strokeWidth,
  drawings,
  onDrawingComplete,
}: DrawingLayerProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<DrawingPoint[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const { screenToFlowPosition, getViewport } = useReactFlow();

  const startDrawing = useCallback((event: React.MouseEvent) => {
    console.log('DrawingLayer startDrawing called, isDrawingMode:', isDrawingMode);
    
    if (!isDrawingMode) {
      console.log('Drawing mode not active, returning');
      return;
    }
    
    // Verificar se o clique foi em um elemento de controle (botões, popups, etc)
    const target = event.target as HTMLElement;
    console.log('Click target:', target, 'tag:', target.tagName);
    
    if (target.closest('[data-radix-popper-content-wrapper]') || 
        target.closest('button') || 
        target.closest('[role="dialog"]') ||
        target.closest('.drawing-controls') ||
        target.closest('[data-testid="rf__controls"]') ||
        target.closest('.react-flow__minimap')) {
      console.log('Click on control element, ignoring');
      return;
    }
    
    console.log('Starting drawing...');
    event.preventDefault();
    event.stopPropagation();
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) {
      console.log('No SVG rect available');
      return;
    }

    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    
    console.log('Drawing point:', point, 'SVG rect:', rect);

    setIsDrawing(true);
    setCurrentPath([point]);
  }, [isDrawingMode]);

  const continueDrawing = useCallback((event: React.MouseEvent) => {
    if (!isDrawingMode || !isDrawing) return;
    
    event.preventDefault();
    event.stopPropagation();

    const continueRect = svgRef.current?.getBoundingClientRect();
    if (!continueRect) return;

    const point = {
      x: event.clientX - continueRect.left,
      y: event.clientY - continueRect.top,
    };

    console.log('Continue drawing point:', point);
    setCurrentPath(prev => [...prev, point]);
  }, [isDrawingMode, isDrawing]);

  const stopDrawing = useCallback(() => {
    console.log('Stop drawing called, isDrawing:', isDrawing, 'currentPath length:', currentPath.length);
    
    if (!isDrawingMode || !isDrawing || currentPath.length < 2) {
      console.log('Not enough points or not drawing, clearing state');
      setIsDrawing(false);
      setCurrentPath([]);
      return;
    }

    // Convert points to SVG path
    const pathData = currentPath.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${path} L ${point.x} ${point.y}`;
    }, '');

    const newDrawing: DrawingPath = {
      id: `drawing-${Date.now()}-${Math.random()}`,
      path: pathData,
      color: drawingColor,
      strokeWidth,
      timestamp: Date.now(),
    };

    console.log('Creating new drawing:', newDrawing);
    onDrawingComplete(newDrawing);
    setIsDrawing(false);
    setCurrentPath([]);
  }, [isDrawingMode, isDrawing, currentPath, drawingColor, strokeWidth, onDrawingComplete]);

  // Convert current path to SVG path string
  const currentPathString = useMemo(() => {
    const pathString = currentPath.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${path} L ${point.x} ${point.y}`;
    }, '');
    console.log('Current path string:', pathString, 'from points:', currentPath);
    return pathString;
  }, [currentPath]);

  return (
    <div 
      className={`absolute inset-0 ${
        isDrawingMode ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
      }`}
      style={{ zIndex: 5 }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        onMouseDown={startDrawing}
        onMouseMove={continueDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ 
          cursor: isDrawingMode ? 'crosshair' : 'default',
        }}
      >
        
        {/* Existing drawings */}
        {drawings.map((drawing) => (
          <path
            key={drawing.id}
            d={drawing.path}
            stroke={drawing.color}
            strokeWidth={drawing.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none"
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
            }}
          />
        ))}
        
        {/* Current drawing */}
        {isDrawing && currentPath.length > 0 && (
          <path
            d={currentPathString}
            stroke={drawingColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
            }}
          />
        )}
      </svg>
    </div>
  );
};
