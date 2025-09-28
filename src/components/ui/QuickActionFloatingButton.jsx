import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionFloatingButton = ({ isVisible = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  if (!isVisible) return null;

  const getContextualActions = () => {
    const path = location?.pathname;
    
    switch (path) {
      case '/document-upload-manager':
        return [
          { label: 'Subir Documento', icon: 'Upload', action: 'upload' },
          { label: 'Escanear QR', icon: 'QrCode', action: 'scan' },
          { label: 'Guardar Borrador', icon: 'Save', action: 'save' }
        ];
      
      case '/refund-request-wizard':
        return [
          { label: 'Continuar', icon: 'ArrowRight', action: 'continue', primary: true },
          { label: 'Guardar Borrador', icon: 'Save', action: 'save' },
          { label: 'Ayuda', icon: 'HelpCircle', action: 'help' }
        ];
      
      case '/compliance-verification':
        return [
          { label: 'Validar Todo', icon: 'CheckCircle', action: 'validate', primary: true },
          { label: 'Ver Errores', icon: 'AlertCircle', action: 'errors' },
          { label: 'Exportar Reporte', icon: 'Download', action: 'export' }
        ];
      
      case '/submission-preparation':
        return [
          { label: 'Enviar Solicitud', icon: 'Send', action: 'submit', primary: true },
          { label: 'Vista Previa', icon: 'Eye', action: 'preview' },
          { label: 'Guardar Borrador', icon: 'Save', action: 'save' }
        ];
      
      case '/refund-status-tracking':
        return [
          { label: 'Actualizar Estado', icon: 'RefreshCw', action: 'refresh', primary: true },
          { label: 'Descargar Comprobante', icon: 'Download', action: 'download' },
          { label: 'Contactar Soporte', icon: 'MessageCircle', action: 'support' }
        ];
      
      default:
        return [
          { label: 'Nueva Solicitud', icon: 'Plus', action: 'new', primary: true },
          { label: 'Ver Documentos', icon: 'FileText', action: 'documents' },
          { label: 'Seguimiento', icon: 'Search', action: 'tracking' }
        ];
    }
  };

  const actions = getContextualActions();
  const primaryAction = actions?.find(action => action?.primary) || actions?.[0];
  const secondaryActions = actions?.filter(action => !action?.primary);

  const handleActionClick = (actionType) => {
    // Handle different action types
    switch (actionType) {
      case 'upload':
        // Trigger file upload
        console.log('Upload document');
        break;
      case 'continue':
        // Continue wizard
        console.log('Continue wizard');
        break;
      case 'save':
        // Save draft
        console.log('Save draft');
        break;
      case 'submit':
        // Submit form
        console.log('Submit form');
        break;
      case 'refresh':
        // Refresh status
        console.log('Refresh status');
        break;
      case 'new':
        // Navigate to new request
        window.location.href = '/refund-request-wizard';
        break;
      case 'documents':
        // Navigate to documents
        window.location.href = '/document-upload-manager';
        break;
      case 'tracking':
        // Navigate to tracking
        window.location.href = '/refund-status-tracking';
        break;
      default:
        console.log('Action:', actionType);
    }
    
    setIsExpanded(false);
  };

  return (
    <div className="md:hidden fixed bottom-6 right-6 z-120">
      {/* Secondary Actions */}
      {isExpanded && secondaryActions?.length > 0 && (
        <div className="absolute bottom-16 right-0 space-y-3 mb-2">
          {secondaryActions?.map((action, index) => (
            <div
              key={action?.action}
              className="flex items-center justify-end space-x-3 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="bg-card text-foreground px-3 py-1 rounded-lg text-sm font-medium shadow-md border border-border">
                {action?.label}
              </span>
              <Button
                variant="secondary"
                size="icon"
                className="w-12 h-12 rounded-full shadow-lg"
                onClick={() => handleActionClick(action?.action)}
              >
                <Icon name={action?.icon} size={20} />
              </Button>
            </div>
          ))}
        </div>
      )}
      {/* Primary Action Button */}
      <div className="relative">
        <Button
          variant="default"
          size="icon"
          className="floating-action-btn w-14 h-14"
          onClick={() => {
            if (secondaryActions?.length > 0) {
              setIsExpanded(!isExpanded);
            } else {
              handleActionClick(primaryAction?.action);
            }
          }}
        >
          <Icon 
            name={isExpanded ? "X" : primaryAction?.icon} 
            size={24} 
            className={isExpanded ? "transition-transform duration-200 rotate-90" : ""}
          />
        </Button>

        {/* Action Label */}
        {!isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-card text-foreground px-3 py-1 rounded-lg text-sm font-medium shadow-md border border-border whitespace-nowrap">
              {primaryAction?.label}
            </span>
          </div>
        )}
      </div>
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default QuickActionFloatingButton;