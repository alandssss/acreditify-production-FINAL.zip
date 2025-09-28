import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceRulesList = ({ rules, category, onFixIssue }) => {
  const [expandedRules, setExpandedRules] = useState(new Set());

  const toggleRule = (ruleId) => {
    setExpandedRules(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(ruleId)) {
        newSet?.delete(ruleId);
      } else {
        newSet?.add(ruleId);
      }
      return newSet;
    });
  };

  const getRuleIcon = (status) => {
    switch (status) {
      case 'passed':
        return 'CheckCircle';
      case 'failed':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      default:
        return 'Circle';
    }
  };

  const getRuleColor = (status) => {
    switch (status) {
      case 'passed':
        return 'text-success';
      case 'failed':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  if (!rules || rules?.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
        <p className="text-muted-foreground">Todas las reglas de {category} han sido validadas correctamente</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rules?.map((rule) => (
        <div key={rule?.id} className="bg-card border rounded-lg">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleRule(rule?.id)}
          >
            <div className="flex items-center space-x-3 flex-1">
              <Icon 
                name={getRuleIcon(rule?.status)} 
                size={20} 
                className={getRuleColor(rule?.status)} 
              />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{rule?.title}</h4>
                <p className="text-sm text-muted-foreground">{rule?.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {rule?.status === 'failed' && (
                <span className="px-2 py-1 bg-error/10 text-error text-xs rounded-full">
                  Crítico
                </span>
              )}
              {rule?.status === 'warning' && (
                <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">
                  Advertencia
                </span>
              )}
              <Icon 
                name={expandedRules?.has(rule?.id) ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-muted-foreground" 
              />
            </div>
          </div>

          {expandedRules?.has(rule?.id) && (
            <div className="border-t border-border p-4 space-y-4">
              {rule?.details && (
                <div>
                  <h5 className="font-medium text-sm mb-2">Detalles del problema:</h5>
                  <p className="text-sm text-muted-foreground">{rule?.details}</p>
                </div>
              )}

              {rule?.solution && (
                <div>
                  <h5 className="font-medium text-sm mb-2">Solución recomendada:</h5>
                  <p className="text-sm text-muted-foreground">{rule?.solution}</p>
                </div>
              )}

              {rule?.regulation && (
                <div>
                  <h5 className="font-medium text-sm mb-2">Referencia normativa:</h5>
                  <p className="text-sm text-muted-foreground">{rule?.regulation}</p>
                </div>
              )}

              {rule?.affectedDocuments && rule?.affectedDocuments?.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm mb-2">Documentos afectados:</h5>
                  <div className="space-y-1">
                    {rule?.affectedDocuments?.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Icon name="FileText" size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(rule?.status === 'failed' || rule?.status === 'warning') && (
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFixIssue(rule?.id)}
                  >
                    <Icon name="Tool" size={16} className="mr-2" />
                    Corregir
                  </Button>
                  {rule?.canIgnore && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Ignore rule:', rule?.id)}
                    >
                      <Icon name="EyeOff" size={16} className="mr-2" />
                      Ignorar
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ComplianceRulesList;