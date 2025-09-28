import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const DocumentStatusIndicator = ({ 
  isVisible = false, 
  uploadProgress = 0, 
  validationStatus = 'idle', 
  errorCount = 0,
  successCount = 0,
  totalDocuments = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'uploading':
        return 'Upload';
      case 'processing':
        return 'Loader';
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'AlertCircle';
      case 'warning':
        return 'AlertTriangle';
      default:
        return 'FileText';
    }
  };

  const getStatusColor = () => {
    switch (validationStatus) {
      case 'uploading': case'processing':
        return 'text-primary';
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusMessage = () => {
    switch (validationStatus) {
      case 'uploading':
        return `Subiendo... ${uploadProgress}%`;
      case 'processing':
        return 'Procesando documentos...';
      case 'success':
        return `${successCount} documentos validados`;
      case 'error':
        return `${errorCount} errores encontrados`;
      case 'warning':
        return 'Revisión requerida';
      default:
        return `${totalDocuments} documentos`;
    }
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:block document-status-indicator">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon()} 
              size={20} 
              className={`${getStatusColor()} ${validationStatus === 'processing' ? 'animate-spin' : ''}`} 
            />
            <span className="font-medium text-sm">Estado de Documentos</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-foreground">{getStatusMessage()}</p>
          
          {validationStatus === 'uploading' && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {isExpanded && (
            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-success">Válidos: {successCount}</span>
                <span className="text-error">Errores: {errorCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total: {totalDocuments}</span>
                <span className="text-muted-foreground">
                  {Math.round((successCount / Math.max(totalDocuments, 1)) * 100)}% completo
                </span>
              </div>
            </div>
          )}
        </div>

        {errorCount > 0 && (
          <Button variant="outline" size="sm" className="w-full mt-3">
            <Icon name="AlertCircle" size={16} className="mr-2" />
            Ver Errores
          </Button>
        )}
      </div>

      {/* Mobile Version - Bottom Sheet */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-120 bg-card border-t border-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon 
                name={getStatusIcon()} 
                size={18} 
                className={`${getStatusColor()} ${validationStatus === 'processing' ? 'animate-spin' : ''}`} 
              />
              <div>
                <p className="text-sm font-medium">{getStatusMessage()}</p>
                {validationStatus === 'uploading' && (
                  <div className="w-32 bg-muted rounded-full h-1 mt-1">
                    <div 
                      className="bg-primary h-1 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Icon name="ChevronUp" size={16} />
            </Button>
          </div>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-success">{successCount}</p>
                  <p className="text-xs text-muted-foreground">Válidos</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-error">{errorCount}</p>
                  <p className="text-xs text-muted-foreground">Errores</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{totalDocuments}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
              
              {errorCount > 0 && (
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Icon name="AlertCircle" size={16} className="mr-2" />
                  Revisar Errores
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentStatusIndicator;