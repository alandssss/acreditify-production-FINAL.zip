import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RefundApplicationCard = ({ application, onViewDetails, onDownloadReceipt }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'under_review':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'approved':
        return 'text-success bg-success/10 border-success/20';
      case 'deposited':
        return 'text-success bg-success/10 border-success/20';
      case 'rejected':
        return 'text-error bg-error/10 border-error/20';
      case 'requires_action':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return 'Upload';
      case 'under_review':
        return 'Clock';
      case 'approved':
        return 'CheckCircle';
      case 'deposited':
        return 'Banknote';
      case 'rejected':
        return 'XCircle';
      case 'requires_action':
        return 'AlertTriangle';
      default:
        return 'FileText';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'submitted':
        return 'Enviada';
      case 'under_review':
        return 'En Revisión';
      case 'approved':
        return 'Aprobada';
      case 'deposited':
        return 'Depositada';
      case 'rejected':
        return 'Rechazada';
      case 'requires_action':
        return 'Requiere Acción';
      default:
        return 'Desconocido';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'submitted':
        return 25;
      case 'under_review':
        return 50;
      case 'approved':
        return 75;
      case 'deposited':
        return 100;
      case 'rejected':
        return 0;
      case 'requires_action':
        return 40;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">
              Solicitud #{application?.id}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(application?.status)}`}>
              <Icon name={getStatusIcon(application?.status)} size={14} className="mr-1" />
              {getStatusText(application?.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Tipo de Devolución</p>
              <p className="font-medium text-foreground">{application?.refundType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monto Solicitado</p>
              <p className="font-semibold text-lg text-foreground">
                {formatCurrency(application?.requestedAmount)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha de Envío</p>
              <p className="font-medium text-foreground">
                {formatDate(application?.submissionDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(application?.id)}
          >
            <Icon name="Eye" size={16} />
          </Button>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Progreso</span>
          <span className="text-sm font-medium text-foreground">
            {getProgressPercentage(application?.status)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              application?.status === 'rejected' ? 'bg-error' : 'bg-primary'
            }`}
            style={{ width: `${getProgressPercentage(application?.status)}%` }}
          />
        </div>
      </div>
      {/* SAT Reference */}
      {application?.satReference && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Referencia SAT</p>
            <p className="font-mono text-sm font-medium text-foreground">
              {application?.satReference}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard?.writeText(application?.satReference)}
          >
            <Icon name="Copy" size={16} />
          </Button>
        </div>
      )}
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* Estimated Timeline */}
          {application?.estimatedCompletion && (
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Fecha Estimada de Finalización
                </span>
              </div>
              <span className="text-sm font-semibold text-primary">
                {formatDate(application?.estimatedCompletion)}
              </span>
            </div>
          )}

          {/* Document Status */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Estado de Documentos
            </h4>
            <div className="space-y-2">
              {application?.documents?.map((doc) => (
                <div key={doc?.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={doc?.status === 'validated' ? 'CheckCircle' : doc?.status === 'rejected' ? 'XCircle' : 'Clock'} 
                      size={16} 
                      className={
                        doc?.status === 'validated' ? 'text-success' : 
                        doc?.status === 'rejected' ? 'text-error' : 'text-warning'
                      } 
                    />
                    <span className="text-sm text-foreground">{doc?.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {doc?.status === 'validated' ? 'Validado' : 
                     doc?.status === 'rejected' ? 'Rechazado' : 'Procesando'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(application?.id)}
            >
              <Icon name="FileText" size={16} className="mr-2" />
              Ver Detalles
            </Button>
            
            {application?.status === 'deposited' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownloadReceipt(application?.id)}
              >
                <Icon name="Download" size={16} className="mr-2" />
                Descargar Comprobante
              </Button>
            )}
            
            {application?.status === 'requires_action' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => window.location.href = `/refund-request-wizard?edit=${application?.id}`}
              >
                <Icon name="Edit" size={16} className="mr-2" />
                Corregir Solicitud
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundApplicationCard;