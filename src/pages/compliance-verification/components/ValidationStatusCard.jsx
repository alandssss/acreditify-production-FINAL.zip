import React from 'react';
import Icon from '../../../components/AppIcon';

const ValidationStatusCard = ({ 
  title, 
  status, 
  count, 
  totalCount, 
  description, 
  icon, 
  onClick 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-success bg-success/10 border-success/20';
      case 'error':
        return 'text-error bg-error/10 border-error/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'processing':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-muted-foreground bg-muted/50 border-border';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'AlertCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'processing':
        return 'Loader';
      default:
        return icon || 'FileText';
    }
  };

  const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

  return (
    <div 
      className={`bg-card border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${getStatusColor()}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Icon 
            name={getStatusIcon()} 
            size={24} 
            className={status === 'processing' ? 'animate-spin' : ''} 
          />
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{count}</p>
          {totalCount > 0 && (
            <p className="text-xs text-muted-foreground">de {totalCount}</p>
          )}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      
      {totalCount > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progreso</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                status === 'success' ? 'bg-success' : 
                status === 'error' ? 'bg-error' : 
                status === 'warning' ? 'bg-warning' : 'bg-primary'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationStatusCard;