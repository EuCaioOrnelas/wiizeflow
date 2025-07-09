import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Settings,
  GitBranch,
  Workflow
} from 'lucide-react';

type EdgeType = 'default' | 'straight';

interface DrawingControlsProps {
  // Edge controls only
  currentEdgeType: EdgeType;
  onEdgeTypeChange: (type: EdgeType) => void;
  onApplyEdgeTypeToAll: () => void;
}

export const DrawingControls = ({
  currentEdgeType,
  onEdgeTypeChange,
  onApplyEdgeTypeToAll,
}: DrawingControlsProps) => {

  return (
    <div className="drawing-controls bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 flex items-center gap-4" style={{ zIndex: 1000 }}>
      
      {/* Connections Popup - Smaller and more discrete */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/20 text-xs"
          >
            <Workflow className="w-3 h-3" />
            <span className="font-medium">Conexões</span>
            <div className="text-xs bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full">
              {currentEdgeType === 'default' ? 'Curva' : 'Reta'}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl" style={{ zIndex: 1001, position: 'relative' }}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <GitBranch className="w-3 h-3 text-emerald-600" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Conexões</h4>
            </div>
            
            {/* Edge Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Tipo:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onEdgeTypeChange('default')}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    currentEdgeType === 'default'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <svg width="20" height="10" viewBox="0 0 20 10" className="text-emerald-500">
                      <path
                        d="M2 5 Q 10 2 18 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                    <span className="text-xs font-medium">Curva</span>
                  </div>
                </button>
                
                <button
                  onClick={() => onEdgeTypeChange('straight')}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    currentEdgeType === 'straight'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <svg width="20" height="10" viewBox="0 0 20 10" className="text-emerald-500">
                      <line
                        x1="2"
                        y1="5"
                        x2="18"
                        y2="5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span className="text-xs font-medium">Reta</span>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Apply to All Button */}
            <Button
              onClick={onApplyEdgeTypeToAll}
              size="sm"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-7 shadow-none"
            >
              <Settings className="w-3 h-3 mr-1" />
              <span className="text-xs">Aplicar a Todas</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};