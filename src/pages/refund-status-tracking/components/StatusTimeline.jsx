import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusTimeline = ({ timeline, isVisible }) => {
  if (!isVisible) return null;

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'submitted':
        return 'Upload';
      case 'received':
        return 'CheckCircle';
      case 'under_review':
        return 'Search';
      case 'document_validated':
        return 'FileCheck';
      case 'approved':
        return 'ThumbsUp';
      case 'deposited':
        return 'Banknote';
      case 'rejected':
        return 'XCircle';
      case 'action_required':
        return 'AlertTriangle';
      case 'system_update':
        return 'RefreshCw';
      default:
        return 'Circle';
    }
  };

  const getTimelineColor = (type) => {
    switch (type) {
      case 'submitted': case'received':
        return 'text-primary bg-primary';
      case 'under_review': case'document_validated':
        return 'text-warning bg-warning';
      case 'approved': case'deposited':
        return 'text-success bg-success';
      case 'rejected':
        return 'text-error bg-error';
      case 'action_required':
        return 'text-warning bg-warning';
      case 'system_update':
        return 'text-muted-foreground bg-muted-foreground';
      default:
        return 'text-muted-foreground bg-muted-foreground';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date?.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: date?.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Historial de Estados
        </h3>
        <Icon name="Clock" size={20} className="text-muted-foreground" />
      </div>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {timeline?.map((event, index) => {
            const { date, time } = formatDateTime(event?.timestamp);
            const colorClasses = getTimelineColor(event?.type);
            
            return (
              <div key={event?.id} className="relative flex items-start space-x-4">
                {/* Timeline Icon */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${colorClasses?.replace('text-', 'bg-')?.replace('bg-bg-', 'bg-')} text-white`}>
                  <Icon name={getTimelineIcon(event?.type)} size={20} />
                </div>
                {/* Event Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {event?.title}
                    </h4>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{date}</p>
                      <p className="text-xs text-muted-foreground">{time}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {event?.description}
                  </p>

                  {/* SAT Reference or Additional Info */}
                  {event?.reference && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Icon name="Hash" size={14} className="text-muted-foreground" />
                      <span className="text-xs font-mono text-muted-foreground">
                        {event?.reference}
                      </span>
                    </div>
                  )}

                  {/* System Updates */}
                  {event?.systemUpdate && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                      <Icon name="Info" size={12} className="inline mr-1" />
                      {event?.systemUpdate}
                    </div>
                  )}

                  {/* Action Required */}
                  {event?.actionRequired && (
                    <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded">
                      <div className="flex items-center space-x-2">
                        <Icon name="AlertTriangle" size={14} className="text-warning" />
                        <span className="text-xs font-medium text-warning">
                          Acción Requerida
                        </span>
                      </div>
                      <p className="text-xs text-warning mt-1">
                        {event?.actionRequired}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusTimeline;