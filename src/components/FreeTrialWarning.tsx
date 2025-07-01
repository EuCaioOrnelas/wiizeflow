
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FreeTrialWarningProps {
  daysRemaining: number;
  expiresAt: Date | null;
}

export const FreeTrialWarning = ({ daysRemaining, expiresAt }: FreeTrialWarningProps) => {
  const navigate = useNavigate();

  if (daysRemaining < 0) return null;

  const getWarningColor = () => {
    if (daysRemaining <= 3) return "bg-red-50 border-red-200 text-red-800";
    if (daysRemaining <= 7) return "bg-orange-50 border-orange-200 text-orange-800";
    return "bg-blue-50 border-blue-200 text-blue-800";
  };

  const getIconColor = () => {
    if (daysRemaining <= 3) return "text-red-600";
    if (daysRemaining <= 7) return "text-orange-600";
    return "text-blue-600";
  };

  return (
    <Card className={`mb-6 ${getWarningColor()} border`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className={`w-5 h-5 ${getIconColor()}`} />
            <div>
              <h3 className="font-semibold text-sm">
                Teste Gratuito - {daysRemaining === 1 ? '1 dia restante' : `${daysRemaining} dias restantes`}
              </h3>
              {expiresAt && (
                <p className="text-xs opacity-75 mt-1">
                  Expira em {expiresAt.toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/pricing')}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            style={{ backgroundColor: 'rgb(6, 214, 160)' }}
          >
            <Crown className="w-4 h-4 mr-1" />
            Fazer Upgrade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
