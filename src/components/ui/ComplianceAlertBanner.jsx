import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ComplianceAlertBanner = ({ 
  alerts = [], 
  isVisible = false,
  onDismiss = null 
}) => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  if (!isVisible || alerts?.length === 0) return null;

  const visibleAlerts = alerts?.filter(alert => !dismissedAlerts?.has(alert?.id));

  if (visibleAlerts?.length === 0) return null;

  const handleDismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    if (onDismiss) {
      onDismiss(alertId);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return 'AlertCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      case 'regulatory':
        return 'Shield';
      case 'deadline':
        return 'Clock';
      default:
        return 'Bell';
    }
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-error/10 border-error/20 text-error';
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'info':
        return 'bg-primary/10 border-primary/20 text-primary';
      case 'regulatory':
        return 'bg-accent/10 border-accent/20 text-accent';
      case 'deadline':
        return 'bg-warning/10 border-warning/20 text-warning';
      default:
        return 'bg-muted/50 border-border text-foreground';
    }
  };

  return (
    <div className="space-y-2 px-6 py-4 bg-background border-b border-border">
      {visibleAlerts?.map((alert) => (
        <div
          key={alert?.id}
          className={`compliance-alert ${getAlertStyles(alert?.type)}`}
        >
          <div className="flex items-start space-x-3">
            <Icon 
              name={getAlertIcon(alert?.type)} 
              size={20} 
              className="flex-shrink-0 mt-0.5" 
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{alert?.title}</h4>
                  <p className="text-sm opacity-90 mb-2">{alert?.message}</p>
                  
                  {alert?.details && (
                    <div className="text-xs opacity-75 space-y-1">
                      {alert?.details?.map((detail, index) => (
                        <p key={index}>• {detail}</p>
                      ))}
                    </div>
                  )}
                  
                  {alert?.deadline && (
                    <div className="flex items-center mt-2 text-xs opacity-75">
                      <Icon name="Clock" size={14} className="mr-1" />
                      Vencimiento: {alert?.deadline}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {alert?.actionLabel && alert?.actionUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => window.location.href = alert?.actionUrl}
                    >
                      {alert?.actionLabel}
                    </Button>
                  )}
                  
                  {alert?.dismissible !== false && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissAlert(alert?.id)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {visibleAlerts?.length > 1 && (
        <div className="flex justify-end pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const allIds = visibleAlerts?.map(alert => alert?.id);
              setDismissedAlerts(prev => new Set([...prev, ...allIds]));
              if (onDismiss) {
                allIds?.forEach(id => onDismiss(id));
              }
            }}
            className="text-xs"
          >
            Descartar todas
          </Button>
        </div>
      )}
    </div>
  );
};

export default ComplianceAlertBanner;