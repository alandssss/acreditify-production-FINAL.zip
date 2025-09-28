import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const WizardProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4 w-full max-w-4xl">
          {steps?.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const isLast = stepNumber === totalSteps;

            return (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center relative">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${isCompleted
                        ? 'bg-success border-success text-success-foreground'
                        : isActive
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-muted border-muted-foreground text-muted-foreground'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Icon name="Check" size={20} />
                    ) : (
                      <span className="text-sm font-semibold">{stepNumber}</span>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <div 
                      className={`text-sm font-medium transition-colors ${
                        isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                      }`}
                    >
                      {step?.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 max-w-24">
                      {step?.description}
                    </div>
                  </div>
                </div>
                {!isLast && (
                  <div 
                    className={`flex-1 h-1 rounded transition-colors duration-300 ${
                      isCompleted ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {/* Progress Text */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Paso {currentStep} de {totalSteps} - {steps?.[currentStep - 1]?.title}
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-2 max-w-md mx-auto">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const UserGuidanceTooltip = ({ title, content, position = 'bottom', isVisible = false, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className={`absolute z-50 max-w-xs p-4 bg-popover border border-border rounded-lg shadow-lg ${
      position === 'top' ? 'bottom-full mb-2' :
      position === 'bottom' ? 'top-full mt-2' :
      position === 'left'? 'right-full mr-2' : 'left-full ml-2'
    }`}>
      <div className="flex items-start space-x-2">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="Info" size={16} className="text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-foreground mb-1">{title}</h4>
          <p className="text-xs text-muted-foreground">{content}</p>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={onClose}
          className="self-start"
        >
          <Icon name="X" size={12} />
        </Button>
      </div>
      
      {/* Arrow pointer */}
      <div className={`absolute w-2 h-2 bg-popover border-l border-t border-border rotate-45 ${
        position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 -mt-1' :
        position === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1' :
        position === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 -ml-1' :
        'right-full top-1/2 transform -translate-y-1/2 -mr-1'
      }`} />
    </div>
  );
};

const SmartValidationMessage = ({ type, message, suggestion, actionable = false, onAction }) => {
  const getVariant = () => {
    switch (type) {
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'success': return 'CheckCircle';
      case 'info': return 'Info';
      default: return 'Info';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${
      type === 'error' ? 'bg-error/5 border-error/20' :
      type === 'warning' ? 'bg-warning/5 border-warning/20' :
      type === 'success'? 'bg-success/5 border-success/20' : 'bg-muted/5 border-muted/20'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          type === 'error' ? 'bg-error/10' :
          type === 'warning' ? 'bg-warning/10' :
          type === 'success'? 'bg-success/10' : 'bg-muted/10'
        }`}>
          <Icon 
            name={getIcon()} 
            size={16} 
            className={
              type === 'error' ? 'text-error' :
              type === 'warning' ? 'text-warning' :
              type === 'success'? 'text-success' : 'text-muted-foreground'
            }
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-1">{message}</p>
          {suggestion && (
            <p className="text-xs text-muted-foreground mb-3">{suggestion}</p>
          )}
          {actionable && onAction && (
            <Button 
              variant={getVariant()} 
              size="xs" 
              onClick={onAction}
              className="mt-2"
            >
              Corregir automáticamente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const GuidedTourModal = ({ isOpen, onClose, steps, currentStepIndex, onNext, onPrevious, onComplete }) => {
  if (!isOpen) return null;

  const currentStep = steps?.[currentStepIndex];
  const isLastStep = currentStepIndex === steps?.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg max-w-md w-full mx-4 shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Guía Interactiva</h3>
              <p className="text-sm text-muted-foreground">
                Paso {currentStepIndex + 1} de {steps?.length}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Icon name={currentStep?.icon || 'Info'} size={24} className="text-primary" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">
              {currentStep?.title}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {currentStep?.description}
            </p>
            
            {currentStep?.tip && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md">
                <div className="flex items-start space-x-2">
                  <Icon name="Lightbulb" size={16} className="text-warning mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Consejo:</p>
                    <p className="text-xs text-muted-foreground">{currentStep?.tip}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={currentStepIndex === 0}
            >
              <Icon name="ChevronLeft" size={16} className="mr-1" />
              Anterior
            </Button>

            <div className="flex space-x-1">
              {steps?.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStepIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={isLastStep ? onComplete : onNext}
            >
              {isLastStep ? 'Finalizar' : 'Siguiente'}
              {!isLastStep && <Icon name="ChevronRight" size={16} className="ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced UI Components Bundle
const EnhancedUXComponents = {
  WizardProgressIndicator,
  UserGuidanceTooltip,
  SmartValidationMessage,
  GuidedTourModal
};

export default EnhancedUXComponents;
export { UserGuidanceTooltip };