import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskAssessmentPanel = ({ riskScore, factors, recommendations }) => {
  const getRiskLevel = () => {
    if (riskScore >= 80) return { level: 'Alto', color: 'text-error', bgColor: 'bg-error/10' };
    if (riskScore >= 50) return { level: 'Medio', color: 'text-warning', bgColor: 'bg-warning/10' };
    return { level: 'Bajo', color: 'text-success', bgColor: 'bg-success/10' };
  };

  const risk = getRiskLevel();

  const getFactorIcon = (impact) => {
    switch (impact) {
      case 'high':
        return 'AlertCircle';
      case 'medium':
        return 'AlertTriangle';
      case 'low':
        return 'Info';
      default:
        return 'Circle';
    }
  };

  const getFactorColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Evaluación de Riesgo</h3>
        <div className={`px-4 py-2 rounded-full ${risk?.bgColor}`}>
          <span className={`font-semibold ${risk?.color}`}>
            Riesgo {risk?.level}: {riskScore}%
          </span>
        </div>
      </div>
      {/* Risk Score Visualization */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Probabilidad de rechazo</span>
          <span className="font-medium">{riskScore}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              riskScore >= 80 ? 'bg-error' : 
              riskScore >= 50 ? 'bg-warning' : 'bg-success'
            }`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Bajo</span>
          <span>Medio</span>
          <span>Alto</span>
        </div>
      </div>
      {/* Risk Factors */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Factores de Riesgo</h4>
        <div className="space-y-3">
          {factors?.map((factor, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Icon 
                name={getFactorIcon(factor?.impact)} 
                size={18} 
                className={`mt-0.5 ${getFactorColor(factor?.impact)}`} 
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{factor?.title}</p>
                <p className="text-sm text-muted-foreground">{factor?.description}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    factor?.impact === 'high' ? 'bg-error/10 text-error' :
                    factor?.impact === 'medium'? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                  }`}>
                    Impacto {factor?.impact === 'high' ? 'Alto' : factor?.impact === 'medium' ? 'Medio' : 'Bajo'}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    +{factor?.riskIncrease}% riesgo
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recommendations */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Recomendaciones</h4>
        <div className="space-y-2">
          {recommendations?.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground">{recommendation?.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{recommendation?.description}</p>
                {recommendation?.potentialReduction && (
                  <span className="text-xs text-success font-medium">
                    Reducción potencial: -{recommendation?.potentialReduction}% riesgo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentPanel;