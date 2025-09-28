import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationSteps = ({ currentStep, totalSteps }) => {
  const steps = [
    {
      id: 1,
      title: 'Información Básica',
      description: 'Datos personales y RFC'
    },
    {
      id: 2,
      title: 'Certificado Digital',
      description: 'e.firma (FIEL) y validación'
    },
    {
      id: 3,
      title: 'Cuenta Bancaria',
      description: 'CLABE y verificación'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Registro de Usuario</h2>
        <span className="text-sm text-muted-foreground">
          Paso {currentStep} de {totalSteps}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {steps?.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={step?.id} className="flex items-center">
              {index > 0 && (
                <div className={`w-12 h-0.5 ${isCompleted ? 'bg-success' : 'bg-border'}`} />
              )}
              <div className="flex flex-col items-center">
                <div
                  className={`progress-step ${
                    isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'
                  }`}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <span className="text-xs font-medium">{stepNumber}</span>
                  )}
                </div>
                
                <div className="mt-2 text-center max-w-24">
                  <span className={`text-xs font-medium ${
                    isCurrent ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step?.title}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {step?.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationSteps;