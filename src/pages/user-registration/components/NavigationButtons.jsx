import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  onSubmit,
  isValid,
  isLoading,
  canProceed = true
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    if (isLastStep) {
      onSubmit?.();
    } else {
      onNext?.();
    }
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-border">
      {/* Previous Button */}
      <div className="flex-1">
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isLoading}
            className="min-w-32"
          >
            <Icon name="ChevronLeft" size={16} className="mr-2" />
            Anterior
          </Button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div
                key={stepNumber}
                className={`w-2 h-2 rounded-full transition-colors ${
                  isCompleted
                    ? 'bg-success'
                    : isActive
                    ? 'bg-primary' :'bg-muted'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Next/Submit Button */}
      <div className="flex-1 flex justify-end">
        <Button
          variant="default"
          onClick={handleNext}
          disabled={!isValid || !canProceed || isLoading}
          loading={isLoading}
          className="min-w-32"
        >
          {isLastStep ? (
            <>
              <Icon name="UserPlus" size={16} className="mr-2" />
              Crear Cuenta
            </>
          ) : (
            <>
              Siguiente
              <Icon name="ChevronRight" size={16} className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NavigationButtons;