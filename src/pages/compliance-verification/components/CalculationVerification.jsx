import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalculationVerification = ({ calculations, deductions }) => {
  const [expandedCalculations, setExpandedCalculations] = useState(new Set());
  const [showFormulas, setShowFormulas] = useState(false);

  const toggleCalculation = (calcId) => {
    setExpandedCalculations(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(calcId)) {
        newSet?.delete(calcId);
      } else {
        newSet?.add(calcId);
      }
      return newSet;
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  const getCalculationStatus = (calculation) => {
    if (calculation?.verified) return 'verified';
    if (calculation?.hasErrors) return 'error';
    if (calculation?.hasWarnings) return 'warning';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      default:
        return 'Calculator';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tax Calculations */}
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Verificación de Cálculos</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFormulas(!showFormulas)}
            >
              <Icon name="Formula" size={16} className="mr-2" />
              {showFormulas ? 'Ocultar' : 'Mostrar'} Fórmulas
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {calculations?.map((calc) => {
            const status = getCalculationStatus(calc);
            const isExpanded = expandedCalculations?.has(calc?.id);

            return (
              <div key={calc?.id} className="border rounded-lg">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleCalculation(calc?.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getStatusIcon(status)} 
                      size={20} 
                      className={getStatusColor(status)} 
                    />
                    <div>
                      <h4 className="font-medium text-foreground">{calc?.type}</h4>
                      <p className="text-sm text-muted-foreground">{calc?.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatCurrency(calc?.amount)}</p>
                      <p className="text-xs text-muted-foreground">Calculado</p>
                    </div>
                    <Icon 
                      name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-border p-4 space-y-4">
                    {/* Calculation Breakdown */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Desglose del Cálculo</h5>
                        <div className="space-y-2">
                          {calc?.breakdown?.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{item?.label}:</span>
                              <span className="text-foreground font-medium">{formatCurrency(item?.value)}</span>
                            </div>
                          ))}
                          <div className="border-t border-border pt-2 flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>{formatCurrency(calc?.amount)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Parámetros Utilizados</h5>
                        <div className="space-y-2">
                          {calc?.parameters?.map((param, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{param?.name}:</span>
                              <span className="text-foreground">{param?.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Formula Display */}
                    {showFormulas && calc?.formula && (
                      <div>
                        <h5 className="font-medium text-sm mb-2">Fórmula Aplicada</h5>
                        <div className="bg-muted/30 rounded p-3 font-mono text-sm">
                          {calc?.formula}
                        </div>
                      </div>
                    )}

                    {/* Validation Results */}
                    {calc?.validationResults && (
                      <div>
                        <h5 className="font-medium text-sm mb-2">Resultados de Validación</h5>
                        <div className="space-y-2">
                          {calc?.validationResults?.map((result, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <Icon 
                                name={result?.status === 'pass' ? 'Check' : result?.status === 'fail' ? 'X' : 'AlertTriangle'} 
                                size={16} 
                                className={
                                  result?.status === 'pass' ? 'text-success' : 
                                  result?.status === 'fail' ? 'text-error' : 'text-warning'
                                } 
                              />
                              <span className="text-sm text-foreground">{result?.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Deductions Verification */}
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Verificación de Deducciones</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Validación de deducciones aplicables según normativa SAT
          </p>
        </div>

        <div className="p-4">
          <div className="grid gap-4">
            {deductions?.map((deduction, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={deduction?.valid ? 'CheckCircle' : deduction?.hasIssues ? 'AlertTriangle' : 'XCircle'} 
                    size={18} 
                    className={
                      deduction?.valid ? 'text-success' : deduction?.hasIssues ?'text-warning' : 'text-error'
                    } 
                  />
                  <div>
                    <p className="font-medium text-sm text-foreground">{deduction?.concept}</p>
                    <p className="text-xs text-muted-foreground">{deduction?.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatCurrency(deduction?.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {deduction?.percentage}% deducible
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Deductions Summary */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">Total Deducciones Válidas:</span>
              <span className="font-bold text-lg text-foreground">
                {formatCurrency(deductions?.reduce((sum, d) => sum + (d?.valid ? d?.amount : 0), 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationVerification;