import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RefundTypeSelector = ({ 
  selectedType, 
  onTypeSelect, 
  eligibilityResults,
  estimatedAmounts 
}) => {
  const refundTypes = [
    {
      id: 'iva',
      name: 'IVA',
      title: 'Impuesto al Valor Agregado',
      description: 'Devolución de IVA pagado en exceso por actividades empresariales',
      icon: 'Calculator',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      requirements: [
        'Actividad empresarial registrada',
        'CFDI de gastos deducibles',
        'Declaraciones mensuales al corriente'
      ],
      scenarios: ['Empresarial', 'Profesional independiente', 'Arrendamiento']
    },
    {
      id: 'isr',
      name: 'ISR',
      title: 'Impuesto Sobre la Renta',
      description: 'Devolución de ISR retenido en exceso por salarios o actividades profesionales',
      icon: 'Briefcase',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      requirements: [
        'Constancia de retenciones',
        'Comprobantes de ingresos',
        'Declaración anual presentada'
      ],
      scenarios: ['Salarios', 'Honorarios', 'Arrendamiento', 'Enajenación de bienes']
    },
    {
      id: 'ieps',
      name: 'IEPS',
      title: 'Impuesto Especial sobre Producción y Servicios',
      description: 'Devolución de IEPS para productos específicos y actividades comerciales',
      icon: 'Package',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      requirements: [
        'Registro como contribuyente IEPS',
        'Comprobantes de productos gravados',
        'Inventarios actualizados'
      ],
      scenarios: ['Combustibles', 'Bebidas alcohólicas', 'Tabacos', 'Alimentos no básicos']
    }
  ];

  const getEligibilityStatus = (typeId) => {
    const result = eligibilityResults?.[typeId];
    if (!result) return { status: 'pending', message: 'Evaluando elegibilidad...' };
    
    if (result?.eligible) {
      return { 
        status: 'eligible', 
        message: `Elegible - Estimado: $${result?.estimatedAmount?.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN` 
      };
    } else {
      return { 
        status: 'not-eligible', 
        message: result?.reason || 'No elegible para este tipo de devolución' 
      };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'eligible':
        return 'CheckCircle';
      case 'not-eligible':
        return 'XCircle';
      default:
        return 'Clock';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'eligible':
        return 'text-success';
      case 'not-eligible':
        return 'text-error';
      default:
        return 'text-warning';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Selecciona el Tipo de Devolución
        </h2>
        <p className="text-muted-foreground">
          Elige el impuesto que deseas solicitar en devolución. Evaluaremos tu elegibilidad automáticamente.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {refundTypes?.map((type) => {
          const eligibility = getEligibilityStatus(type?.id);
          const isSelected = selectedType === type?.id;
          
          return (
            <div
              key={type?.id}
              className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? `${type?.borderColor} ${type?.bgColor} shadow-md` 
                  : 'border-border bg-card hover:border-primary/30'
              }`}
              onClick={() => onTypeSelect(type?.id)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={16} color="white" />
                  </div>
                </div>
              )}
              {/* Type Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-lg ${type?.bgColor} flex items-center justify-center`}>
                  <Icon name={type?.icon} size={24} className={type?.color} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{type?.name}</h3>
                  <p className="text-sm text-muted-foreground">{type?.title}</p>
                </div>
              </div>
              {/* Description */}
              <p className="text-sm text-foreground mb-4">
                {type?.description}
              </p>
              {/* Eligibility Status */}
              <div className={`flex items-center space-x-2 mb-4 p-3 rounded-lg ${
                eligibility?.status === 'eligible' ? 'bg-success/10' :
                eligibility?.status === 'not-eligible' ? 'bg-error/10' : 'bg-warning/10'
              }`}>
                <Icon 
                  name={getStatusIcon(eligibility?.status)} 
                  size={16} 
                  className={getStatusColor(eligibility?.status)} 
                />
                <span className={`text-sm font-medium ${getStatusColor(eligibility?.status)}`}>
                  {eligibility?.message}
                </span>
              </div>
              {/* Requirements */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Requisitos:</h4>
                <ul className="space-y-1">
                  {type?.requirements?.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2 text-xs text-muted-foreground">
                      <Icon name="Check" size={12} className="text-success mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Scenarios */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Escenarios aplicables:</h4>
                <div className="flex flex-wrap gap-1">
                  {type?.scenarios?.map((scenario, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md"
                    >
                      {scenario}
                    </span>
                  ))}
                </div>
              </div>
              {/* Select Button */}
              <div className="mt-4">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  fullWidth
                  disabled={eligibility?.status === 'not-eligible'}
                  onClick={(e) => {
                    e?.stopPropagation();
                    onTypeSelect(type?.id);
                  }}
                >
                  {isSelected ? 'Seleccionado' : 'Seleccionar'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Additional Information */}
      <div className="bg-muted/50 rounded-lg p-4 mt-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Información Importante</h4>
            <p className="text-sm text-muted-foreground mb-2">
              La evaluación de elegibilidad se basa en los documentos que has subido y tu perfil fiscal. 
              Puedes solicitar múltiples tipos de devolución en solicitudes separadas.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Los montos estimados son aproximados y pueden variar</li>
              <li>• La elegibilidad final será determinada por el SAT</li>
              <li>• Puedes cambiar tu selección antes de enviar la solicitud</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundTypeSelector;