import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const OnboardingSpotlight = ({ targetSelector, isActive, title, description, position = 'bottom', onNext, onPrevious, onSkip, stepNumber, totalSteps }) => {
  const [targetElement, setTargetElement] = useState(null);
  const [spotlightStyle, setSpotlightStyle] = useState({});

  useEffect(() => {
    if (isActive && targetSelector) {
      const element = document?.querySelector(targetSelector);
      if (element) {
        setTargetElement(element);
        const rect = element?.getBoundingClientRect();
        setSpotlightStyle({
          top: rect?.top - 8,
          left: rect?.left - 8,
          width: rect?.width + 16,
          height: rect?.height + 16,
        });
      }
    }
  }, [isActive, targetSelector]);

  if (!isActive || !targetElement) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 z-40" />
      
      {/* Spotlight */}
      <div
        className="fixed bg-white/10 border-2 border-primary rounded-lg z-50 transition-all duration-300"
        style={spotlightStyle}
      />

      {/* Tooltip */}
      <div
        className="fixed z-50 max-w-sm"
        style={{
          top: position === 'bottom' ? spotlightStyle?.top + spotlightStyle?.height + 16 : spotlightStyle?.top - 160,
          left: Math.min(spotlightStyle?.left, window?.innerWidth - 400),
        }}
      >
        <div className="bg-card border border-border rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">{stepNumber}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {stepNumber} de {totalSteps}
              </span>
            </div>
            <Button variant="ghost" size="xs" onClick={onSkip}>
              <Icon name="X" size={14} />
            </Button>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={stepNumber === 1}
            >
              Anterior
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted-foreground">
              Saltar guía
            </Button>

            <Button variant="default" size="sm" onClick={onNext}>
              {stepNumber === totalSteps ? 'Finalizar' : 'Siguiente'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const OnboardingChecklist = ({ tasks, onTaskComplete, onComplete }) => {
  const completedTasks = tasks?.filter(task => task?.completed)?.length;
  const progressPercentage = (completedTasks / tasks?.length) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Primeros Pasos</h3>
        <div className="text-sm text-muted-foreground">
          {completedTasks} de {tasks?.length} completados
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progreso</span>
          <span className="font-medium text-primary">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {tasks?.map((task, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
              task?.completed 
                ? 'bg-success/5 border-success/20' :'bg-muted/5 border-muted/20 hover:bg-muted/10'
            }`}
          >
            <button
              onClick={() => !task?.completed && onTaskComplete?.(index)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                task?.completed
                  ? 'bg-success border-success text-success-foreground'
                  : 'border-muted-foreground hover:border-primary'
              }`}
            >
              {task?.completed && <Icon name="Check" size={14} />}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Icon 
                  name={task?.icon} 
                  size={16} 
                  className={task?.completed ? 'text-success' : 'text-primary'} 
                />
                <h4 className={`text-sm font-medium ${
                  task?.completed ? 'text-success line-through' : 'text-foreground'
                }`}>
                  {task?.title}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">{task?.description}</p>
              
              {task?.actionLabel && !task?.completed && (
                <Button
                  variant="outline"
                  size="xs"
                  className="mt-2"
                  onClick={() => onTaskComplete?.(index)}
                >
                  {task?.actionLabel}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {completedTasks === tasks?.length && (
        <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg text-center">
          <Icon name="Trophy" size={24} className="text-warning mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-success mb-1">¡Felicidades!</h4>
          <p className="text-xs text-success/80 mb-3">
            Has completado todos los pasos iniciales
          </p>
          <Button variant="default" size="sm" onClick={onComplete}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
};

const InteractiveHelpBubble = ({ isVisible, onClose, quickTips }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % quickTips?.length);
  };

  const previousTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + quickTips?.length) % quickTips?.length);
  };

  if (!isVisible || !quickTips?.length) return null;

  const currentTip = quickTips?.[currentTipIndex];

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="Lightbulb" size={16} className="text-warning" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">Consejo Útil</h4>
              <p className="text-xs text-muted-foreground">
                {currentTipIndex + 1} de {quickTips?.length}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="xs" onClick={onClose}>
            <Icon name="X" size={14} />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {currentTip?.content}
        </p>

        {quickTips?.length > 1 && (
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="xs" onClick={previousTip}>
              <Icon name="ChevronLeft" size={14} className="mr-1" />
              Anterior
            </Button>
            
            <div className="flex space-x-1">
              {quickTips?.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentTipIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button variant="ghost" size="xs" onClick={nextTip}>
              Siguiente
              <Icon name="ChevronRight" size={14} className="ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const GuidedOnboarding = {
  OnboardingSpotlight,
  OnboardingChecklist,
  InteractiveHelpBubble
};

export default GuidedOnboarding;