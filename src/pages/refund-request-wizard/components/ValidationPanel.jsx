import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ValidationPanel = ({ 
  validationResults, 
  rejectionRisk, 
  recommendations,
  onFixError,
  onRevalidate 
}) => {
  const [activeTab, setActiveTab] = useState('errors');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const mockValidationResults = {
    errors: [
      {
        id: 'error1',
        type: 'critical',
        category: 'document',
        title: 'CFDI Inválido',
        description: 'El archivo CFDI_Gastos_Enero_2024.xml no tiene una estructura XML válida',
        affectedDocument: 'CFDI_Gastos_Enero_2024.xml',
        solution: 'Vuelve a descargar el CFDI desde el portal del SAT o solicita una nueva versión al emisor',
        autoFixable: false,
        impact: 'high'
      },
      {
        id: 'error2',
        type: 'warning',
        category: 'calculation',
        title: 'Inconsistencia en Montos',
        description: 'El monto declarado no coincide con la suma de los CFDI asociados',
        affectedSection: 'Cálculo del Impuesto',
        solution: 'Revisa los montos ingresados manualmente o verifica que todos los CFDI estén incluidos',
        autoFixable: true,
        impact: 'medium'
      },
      {
        id: 'error3',
        type: 'info',
        category: 'compliance',
        title: 'Documento Opcional Faltante',
        description: 'Se recomienda incluir el Anexo 3 para una revisión más rápida',
        affectedSection: 'Anexos Requeridos',
        solution: 'Genera el Anexo 3 desde la sección de anexos o continúa sin él',
        autoFixable: true,
        impact: 'low'
      }
    ],
    warnings: [
      {
        id: 'warn1',
        title: 'Fecha de Vencimiento Próxima',
        description: 'Algunos documentos vencerán en los próximos 30 días',
        recommendation: 'Considera renovar los documentos antes del envío'
      },
      {
        id: 'warn2',
        title: 'Régimen Fiscal Cambió',
        description: 'Tu régimen fiscal cambió durante el periodo de la devolución',
        recommendation: 'Verifica que los cálculos sean correctos para ambos regímenes'
      }
    ],
    suggestions: [
      {
        id: 'sugg1',
        title: 'Optimización de Deducciones',
        description: 'Podrías incluir deducciones adicionales por $5,000 MXN',
        potentialBenefit: 'Incremento estimado de $800 MXN en la devolución'
      },
      {
        id: 'sugg2',
        title: 'Documentación Complementaria',
        description: 'Agregar estados de cuenta podría acelerar el proceso',
        potentialBenefit: 'Reducción estimada de 15 días en tiempo de procesamiento'
      }
    ]
  };

  const mockRejectionRisk = {
    score: 25,
    level: 'low',
    factors: [
      { factor: 'Documentación completa', impact: 'positive', weight: 30 },
      { factor: 'Historial fiscal limpio', impact: 'positive', weight: 25 },
      { factor: 'Inconsistencias menores', impact: 'negative', weight: 15 },
      { factor: 'Monto dentro del promedio', impact: 'neutral', weight: 10 }
    ],
    recommendations: [
      'Corrige las inconsistencias de montos detectadas',
      'Incluye documentación adicional sugerida',
      'Revisa los cálculos antes del envío'
    ]
  };

  const tabs = [
    { id: 'errors', label: 'Errores', count: mockValidationResults?.errors?.length, icon: 'AlertCircle' },
    { id: 'risk', label: 'Riesgo', icon: 'Shield' },
    { id: 'suggestions', label: 'Sugerencias', count: mockValidationResults?.suggestions?.length, icon: 'Lightbulb' }
  ];

  const getErrorIcon = (type) => {
    switch (type) {
      case 'critical':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      default:
        return 'AlertCircle';
    }
  };

  const getErrorColor = (type) => {
    switch (type) {
      case 'critical':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getErrorBgColor = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-error/10 border-error/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'info':
        return 'bg-primary/10 border-primary/20';
      default:
        return 'bg-muted/50 border-border';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskBgColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-success/10';
      case 'medium':
        return 'bg-warning/10';
      case 'high':
        return 'bg-error/10';
      default:
        return 'bg-muted/50';
    }
  };

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded?.has(itemId)) {
      newExpanded?.delete(itemId);
    } else {
      newExpanded?.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleAutoFix = (errorId) => {
    if (onFixError) {
      onFixError(errorId);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="CheckCircle" size={20} className="mr-2" />
            Validación y Cumplimiento
          </h3>
          <Button variant="outline" size="sm" onClick={onRevalidate}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Revalidar
          </Button>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab?.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
            {tab?.count !== undefined && (
              <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                {tab?.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Errors Tab */}
        {activeTab === 'errors' && (
          <div className="space-y-4">
            {mockValidationResults?.errors?.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
                <h4 className="text-lg font-medium text-foreground mb-2">
                  ¡Todo está en orden!
                </h4>
                <p className="text-muted-foreground">
                  No se encontraron errores en tu solicitud de devolución.
                </p>
              </div>
            ) : (
              mockValidationResults?.errors?.map((error) => (
                <div
                  key={error?.id}
                  className={`border rounded-lg p-4 ${getErrorBgColor(error?.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Icon 
                        name={getErrorIcon(error?.type)} 
                        size={20} 
                        className={`${getErrorColor(error?.type)} mt-0.5`} 
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-foreground">{error?.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            error?.impact === 'high' ? 'bg-error/20 text-error' :
                            error?.impact === 'medium'? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
                          }`}>
                            {error?.impact === 'high' ? 'Alto' : 
                             error?.impact === 'medium' ? 'Medio' : 'Bajo'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {error?.description}
                        </p>
                        
                        {error?.affectedDocument && (
                          <p className="text-xs text-muted-foreground mb-2">
                            Documento: {error?.affectedDocument}
                          </p>
                        )}
                        
                        {error?.affectedSection && (
                          <p className="text-xs text-muted-foreground mb-2">
                            Sección: {error?.affectedSection}
                          </p>
                        )}

                        {expandedItems?.has(error?.id) && (
                          <div className="mt-3 p-3 bg-card/50 rounded border">
                            <h5 className="font-medium text-foreground mb-2">Solución:</h5>
                            <p className="text-sm text-muted-foreground">
                              {error?.solution}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {error?.autoFixable && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAutoFix(error?.id)}
                        >
                          <Icon name="Wrench" size={14} className="mr-1" />
                          Corregir
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(error?.id)}
                      >
                        <Icon 
                          name={expandedItems?.has(error?.id) ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Risk Tab */}
        {activeTab === 'risk' && (
          <div className="space-y-6">
            {/* Risk Score */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getRiskBgColor(mockRejectionRisk?.level)} mb-4`}>
                <span className={`text-2xl font-bold ${getRiskColor(mockRejectionRisk?.level)}`}>
                  {mockRejectionRisk?.score}%
                </span>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Riesgo de Rechazo: {mockRejectionRisk?.level === 'low' ? 'Bajo' : 
                                   mockRejectionRisk?.level === 'medium' ? 'Medio' : 'Alto'}
              </h4>
              <p className="text-muted-foreground">
                Basado en el análisis de tu documentación y historial fiscal
              </p>
            </div>

            {/* Risk Factors */}
            <div>
              <h5 className="font-medium text-foreground mb-3">Factores Analizados:</h5>
              <div className="space-y-2">
                {mockRejectionRisk?.factors?.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={factor?.impact === 'positive' ? 'TrendingUp' : 
                              factor?.impact === 'negative' ? 'TrendingDown' : 'Minus'} 
                        size={16} 
                        className={factor?.impact === 'positive' ? 'text-success' : 
                                  factor?.impact === 'negative' ? 'text-error' : 'text-muted-foreground'} 
                      />
                      <span className="text-sm text-foreground">{factor?.factor}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Peso: {factor?.weight}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h5 className="font-medium text-foreground mb-3">Recomendaciones para Reducir Riesgo:</h5>
              <ul className="space-y-2">
                {mockRejectionRisk?.recommendations?.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Icon name="ArrowRight" size={16} className="text-primary mt-0.5" />
                    <span className="text-sm text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {mockValidationResults?.suggestions?.map((suggestion) => (
              <div key={suggestion?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Lightbulb" size={20} className="text-warning mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{suggestion?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {suggestion?.description}
                    </p>
                    {suggestion?.potentialBenefit && (
                      <div className="bg-success/10 border border-success/20 rounded p-2">
                        <p className="text-sm text-success">
                          <Icon name="TrendingUp" size={14} className="inline mr-1" />
                          {suggestion?.potentialBenefit}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Aplicar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Última validación: {new Date()?.toLocaleString('es-MX')}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} className="mr-2" />
              Exportar Reporte
            </Button>
            <Button variant="default" size="sm">
              <Icon name="CheckCircle" size={16} className="mr-2" />
              Validar Todo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;