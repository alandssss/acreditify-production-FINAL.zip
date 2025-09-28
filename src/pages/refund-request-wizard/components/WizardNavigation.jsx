import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WizardNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSaveDraft,
  canProceed = true,
  isLoading = false,
  estimatedTimeRemaining = null 
}) => {
  const steps = [
    { 
      id: 1, 
      name: 'Tipo de Devolución', 
      description: 'Selección del impuesto a devolver',
      estimatedTime: '2 min'
    },
    { 
      id: 2, 
      name: 'Formulario F3241', 
      description: 'Completar datos del formulario',
      estimatedTime: '8 min'
    },
    { 
      id: 3, 
      name: 'Asociar Documentos', 
      description: 'Vincular documentos al formulario',
      estimatedTime: '5 min'
    }
  ];

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (stepNumber) => {
    const status = getStepStatus(stepNumber);
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'current':
        return 'Circle';
      default:
        return 'Circle';
    }
  };

  const getStepColor = (stepNumber) => {
    const status = getStepStatus(stepNumber);
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'current':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeRemaining = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Asistente de Solicitud de Devolución
            </h2>
            <p className="text-muted-foreground">
              Paso {currentStep} de {totalSteps} - {steps?.[currentStep - 1]?.description}
            </p>
          </div>
          
          {estimatedTimeRemaining && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tiempo estimado restante</p>
              <p className="text-lg font-semibold text-primary">
                {formatTimeRemaining(estimatedTimeRemaining)}
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progreso</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% completado</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators - Desktop */}
        <div className="hidden md:flex items-center justify-between">
          {steps?.map((step, index) => (
            <div key={step?.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  getStepStatus(step?.id) === 'completed' 
                    ? 'bg-success border-success text-white' 
                    : getStepStatus(step?.id) === 'current' ?'bg-primary border-primary text-white' :'bg-background border-border text-muted-foreground'
                }`}>
                  {getStepStatus(step?.id) === 'completed' ? (
                    <Icon name="Check" size={20} />
                  ) : (
                    <span className="text-sm font-medium">{step?.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${
                    getStepStatus(step?.id) === 'current' ? 'text-primary' : 'text-foreground'
                  }`}>
                    {step?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step?.estimatedTime}
                  </p>
                </div>
              </div>
              
              {index < steps?.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  getStepStatus(step?.id) === 'completed' ? 'bg-success' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Indicators - Mobile */}
        <div className="md:hidden">
          <div className="flex items-center space-x-2">
            {steps?.map((step) => (
              <div
                key={step?.id}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  getStepStatus(step?.id) === 'completed' 
                    ? 'bg-success' 
                    : getStepStatus(step?.id) === 'current' ?'bg-primary' :'bg-border'
                }`}
              />
            ))}
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm font-medium text-foreground">
              {steps?.[currentStep - 1]?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {steps?.[currentStep - 1]?.estimatedTime} restante
            </p>
          </div>
        </div>
      </div>
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentStep === 1 || isLoading}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Anterior
          </Button>
          
          <Button
            variant="ghost"
            onClick={onSaveDraft}
            disabled={isLoading}
            iconName="Save"
            iconPosition="left"
          >
            Guardar Borrador
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Auto-save indicator */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Check" size={16} className="text-success" />
            <span>Guardado automáticamente</span>
          </div>

          <Button
            variant="default"
            onClick={onNext}
            disabled={!canProceed || isLoading}
            loading={isLoading}
            iconName={currentStep === totalSteps ? "Send" : "ArrowRight"}
            iconPosition="right"
          >
            {currentStep === totalSteps ? 'Finalizar' : 'Siguiente'}
          </Button>
        </div>
      </div>
      {/* Help and Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">
              Consejo para el Paso {currentStep}
            </h4>
            <p className="text-sm text-muted-foreground">
              {currentStep === 1 && "Selecciona el tipo de impuesto basándote en tu actividad principal. Si tienes dudas, puedes consultar tu última declaración anual."}
              {currentStep === 2 && "Los campos marcados con asterisco (*) son obligatorios. La información se completa automáticamente desde tus documentos subidos."}
              {currentStep === 3 && "Arrastra los documentos a las secciones correspondientes. El sistema validará automáticamente que cada sección tenga los documentos requeridos."}
            </p>
            <div className="mt-2">
              <Button variant="ghost" size="sm">
                <Icon name="HelpCircle" size={16} className="mr-2" />
                Ver Ayuda Detallada
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={currentStep === 1 || isLoading}
          >
            <Icon name="ArrowLeft" size={16} />
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {currentStep}/{totalSteps}
            </span>
            <div className="w-16 bg-border rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
          
          <Button
            variant="default"
            size="sm"
            onClick={onNext}
            disabled={!canProceed || isLoading}
            loading={isLoading}
          >
            <Icon name={currentStep === totalSteps ? "Send" : "ArrowRight"} size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WizardNavigation;