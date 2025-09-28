import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityTimeline = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'document_upload':
        return 'Upload';
      case 'status_change':
        return 'RefreshCw';
      case 'notification':
        return 'Bell';
      case 'approval':
        return 'CheckCircle';
      case 'rejection':
        return 'XCircle';
      case 'submission':
        return 'Send';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'document_upload':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'status_change':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'notification':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'approval':
        return 'bg-success/10 text-success border-success/20';
      case 'rejection':
        return 'bg-error/10 text-error border-error/20';
      case 'submission':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    
    return activityDate?.toLocaleDateString('es-MX');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Actividad Reciente</h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          Ver Todo
        </button>
      </div>
      <div className="space-y-4">
        {activities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay actividad reciente</p>
          </div>
        ) : (
          activities?.map((activity, index) => (
            <div key={activity?.id} className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity?.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{activity?.description}</p>
                    {activity?.folio && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Folio: {activity?.folio}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-4">
                    {formatTimeAgo(activity?.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;