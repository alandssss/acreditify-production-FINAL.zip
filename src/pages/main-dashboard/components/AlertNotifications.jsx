import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertNotifications = ({ alerts, onDismiss }) => {
  const [expandedAlert, setExpandedAlert] = useState(null);

  if (!alerts || alerts?.length === 0) return null;

  const getAlertIcon = (type) => {
    switch (type) {
      case 'document_expiry':
        return 'Calendar';
      case 'regulatory_update':
        return 'Shield';
      case 'action_required':
        return 'AlertTriangle';
      case 'deadline':
        return 'Clock';
      case 'success':
        return 'CheckCircle';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error/10 border-error/20 text-error';
      case 'medium':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'low':
        return 'bg-primary/10 border-primary/20 text-primary';
      default:
        return 'bg-muted border-border text-foreground';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Alta Prioridad';
      case 'medium':
        return 'Prioridad Media';
      case 'low':
        return 'Baja Prioridad';
      default:
        return '';
    }
  };

  const toggleExpanded = (alertId) => {
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Notificaciones</h3>
      {alerts?.map((alert) => (
        <div
          key={alert?.id}
          className={`border rounded-lg p-4 ${getAlertColor(alert?.priority)} animate-fade-in`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <Icon name={getAlertIcon(alert?.type)} size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground">{alert?.title}</h4>
                    {alert?.priority !== 'low' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-current/20">
                        {getPriorityText(alert?.priority)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert?.message}</p>
                  
                  {alert?.deadline && (
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Icon name="Clock" size={14} className="mr-1" />
                      Vence: {new Date(alert.deadline)?.toLocaleDateString('es-MX')}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {alert?.details && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(alert?.id)}
                    >
                      <Icon 
                        name={expandedAlert === alert?.id ? "ChevronUp" : "ChevronDown"} 
                        size={16} 
                      />
                    </Button>
                  )}
                  
                  {alert?.actionLabel && (
                    <Button variant="outline" size="sm">
                      {alert?.actionLabel}
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss?.(alert?.id)}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Expanded Details */}
              {expandedAlert === alert?.id && alert?.details && (
                <div className="mt-4 pt-4 border-t border-current/20 animate-fade-in">
                  <div className="text-sm text-foreground space-y-2">
                    {alert?.details?.map((detail, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Icon name="ArrowRight" size={14} className="mt-0.5 text-muted-foreground" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertNotifications;