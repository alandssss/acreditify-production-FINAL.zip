import React from 'react';
import Icon from '../../../components/AppIcon';

const ApplicationSummaryCard = ({ applicationData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })?.format(new Date(date));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Resumen de Solicitud</h3>
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <span className="text-sm text-success font-medium">Listo para Envío</span>
        </div>
      </div>
      <div className="space-y-6">
        {/* Refund Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Montos de Devolución</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{formatCurrency(applicationData?.refunds?.iva)}</p>
              <p className="text-sm text-muted-foreground">IVA (16%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{formatCurrency(applicationData?.refunds?.isr)}</p>
              <p className="text-sm text-muted-foreground">ISR (30%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{formatCurrency(applicationData?.refunds?.total)}</p>
              <p className="text-sm text-muted-foreground">Total Estimado</p>
            </div>
          </div>
        </div>

        {/* Taxpayer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">Información del Contribuyente</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">RFC:</span>
                <span className="font-medium">{applicationData?.taxpayer?.rfc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre:</span>
                <span className="font-medium">{applicationData?.taxpayer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Régimen:</span>
                <span className="font-medium">{applicationData?.taxpayer?.regime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ejercicio:</span>
                <span className="font-medium">{applicationData?.taxYear}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3">Datos Bancarios</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">CLABE:</span>
                <span className="font-medium font-mono">{applicationData?.bankAccount?.clabe}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Banco:</span>
                <span className="font-medium">{applicationData?.bankAccount?.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Titular:</span>
                <span className="font-medium">{applicationData?.bankAccount?.holder}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Detalles de la Solicitud</h4>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Folio Interno:</span>
                <span className="font-medium font-mono">{applicationData?.internalReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de Preparación:</span>
                <span className="font-medium">{formatDate(applicationData?.preparationDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo de Solicitud:</span>
                <span className="font-medium">{applicationData?.requestType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="font-medium text-success">Validado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSummaryCard;