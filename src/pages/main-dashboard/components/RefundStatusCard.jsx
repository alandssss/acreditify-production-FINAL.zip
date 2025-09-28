import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RefundStatusCard = ({ refund }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-success';
      case 'processing':
        return 'text-primary';
      case 'pending':
        return 'text-warning';
      case 'rejected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return 'CheckCircle';
      case 'processing':
        return 'Clock';
      case 'pending':
        return 'AlertCircle';
      case 'rejected':
        return 'XCircle';
      default:
        return 'FileText';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Aprobada';
      case 'processing':
        return 'En Proceso';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazada';
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

  const calculateProgress = (status) => {
    switch (status) {
      case 'pending':
        return 25;
      case 'processing':
        return 65;
      case 'approved':
        return 100;
      case 'rejected':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${getStatusColor(refund?.status)}`}>
            <Icon name={getStatusIcon(refund?.status)} size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{refund?.type}</h3>
            <p className="text-sm text-muted-foreground">Folio: {refund?.folio}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(refund?.status)} bg-current/10`}>
          {getStatusText(refund?.status)}
        </span>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Monto Solicitado</span>
          <span className="font-semibold text-foreground">{formatCurrency(refund?.amount)}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progreso</span>
            <span className="text-sm font-medium">{calculateProgress(refund?.status)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                refund?.status === 'approved' ? 'bg-success' :
                refund?.status === 'rejected' ? 'bg-error' : 'bg-primary'
              }`}
              style={{ width: `${calculateProgress(refund?.status)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Fecha de Solicitud</span>
          <span className="text-foreground">{new Date(refund.submissionDate)?.toLocaleDateString('es-MX')}</span>
        </div>

        {refund?.estimatedDate && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Fecha Estimada</span>
            <span className="text-foreground">{new Date(refund.estimatedDate)?.toLocaleDateString('es-MX')}</span>
          </div>
        )}
      </div>
      <div className="mt-6 flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Icon name="Eye" size={16} className="mr-2" />
          Ver Detalles
        </Button>
        {refund?.status === 'pending' && (
          <Button variant="default" size="sm" className="flex-1">
            <Icon name="Upload" size={16} className="mr-2" />
            Completar
          </Button>
        )}
      </div>
    </div>
  );
};

export default RefundStatusCard;