
import { useState } from 'react';
import { Node } from '@xyflow/react';
import { CustomNodeData } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp } from 'lucide-react';

interface MetricsCalculatorProps {
  nodes: Node<CustomNodeData>[];
  currentNodeId: string;
}

export const MetricsCalculator = ({ nodes, currentNodeId }: MetricsCalculatorProps) => {
  const [selectedNode1, setSelectedNode1] = useState<string>('');
  const [selectedNode2, setSelectedNode2] = useState<string>('');
  const [operation, setOperation] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  // Filtrar apenas nós que têm métricas definidas
  const nodesWithMetrics = nodes.filter(node => 
    node.data.content?.metrics && 
    !isNaN(parseFloat(node.data.content.metrics))
  );

  const extractNumber = (metrics: string): number => {
    const match = metrics.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const calculate = () => {
    if (!selectedNode1 || !selectedNode2 || !operation) return;

    const node1 = nodesWithMetrics.find(n => n.id === selectedNode1);
    const node2 = nodesWithMetrics.find(n => n.id === selectedNode2);

    if (!node1?.data.content?.metrics || !node2?.data.content?.metrics) return;

    const value1 = extractNumber(node1.data.content.metrics);
    const value2 = extractNumber(node2.data.content.metrics);

    let calculatedResult: number;

    switch (operation) {
      case 'average':
        calculatedResult = (value1 + value2) / 2;
        break;
      case 'multiply':
        calculatedResult = value1 * value2;
        break;
      case 'divide':
        calculatedResult = value2 !== 0 ? value1 / value2 : 0;
        break;
      case 'percentage':
        calculatedResult = value2 !== 0 ? (value1 / value2) * 100 : 0;
        break;
      default:
        calculatedResult = 0;
    }

    setResult(calculatedResult);
  };

  const formatResult = () => {
    if (result === null) return '';
    
    switch (operation) {
      case 'percentage':
        return `${result.toFixed(2)}%`;
      default:
        return result.toFixed(2);
    }
  };

  if (nodesWithMetrics.length < 2) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Calculadora de Métricas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">
            Adicione métricas a pelo menos 2 elementos para usar a calculadora.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Calculadora de Métricas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Elemento 1</Label>
            <Select value={selectedNode1} onValueChange={setSelectedNode1}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {nodesWithMetrics.map(node => (
                  <SelectItem key={node.id} value={node.id} className="text-xs">
                    {node.data.label} ({extractNumber(node.data.content?.metrics || '')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Elemento 2</Label>
            <Select value={selectedNode2} onValueChange={setSelectedNode2}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {nodesWithMetrics.map(node => (
                  <SelectItem key={node.id} value={node.id} className="text-xs">
                    {node.data.label} ({extractNumber(node.data.content?.metrics || '')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs">Operação</Label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Tipo de cálculo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="average" className="text-xs">Média</SelectItem>
              <SelectItem value="multiply" className="text-xs">Multiplicação</SelectItem>
              <SelectItem value="divide" className="text-xs">Divisão</SelectItem>
              <SelectItem value="percentage" className="text-xs">Porcentagem (Taxa de Conversão)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={calculate} 
          size="sm" 
          className="w-full text-xs"
          disabled={!selectedNode1 || !selectedNode2 || !operation}
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          Calcular
        </Button>

        {result !== null && (
          <div className="bg-blue-50 p-2 rounded border text-center">
            <Label className="text-xs text-gray-600">Resultado:</Label>
            <div className="text-sm font-semibold text-blue-700">
              {formatResult()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
