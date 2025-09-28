import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const SATPortalGuide = ({ guideSteps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedTips, setExpandedTips] = useState(new Set());

  const toggleTip = (tipId) => {
    const newExpanded = new Set(expandedTips);
    if (newExpanded?.has(tipId)) {
      newExpanded?.delete(tipId);
    } else {
      newExpanded?.add(tipId);
    }
    setExpandedTips(newExpanded);
  };

  const nextStep = () => {
    if (currentStep < guideSteps?.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const currentGuideStep = guideSteps?.[currentStep];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Guía del Portal SAT</h3>
          <p className="text-sm text-muted-foreground">Instrucciones paso a paso para el envío</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="ExternalLink" size={16} className="text-primary" />
          <span className="text-sm text-primary font-medium">Portal SAT</span>
        </div>
      </div>
      {/* Step Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Paso {currentStep + 1} de {guideSteps?.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(((currentStep + 1) / guideSteps?.length) * 100)}% completado
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / guideSteps?.length) * 100}%` }}
          />
        </div>

        {/* Step Navigation */}
        <div className="hidden md:flex items-center justify-center space-x-2">
          {guideSteps?.map((step, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 ${
                index === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index < currentStep
                  ? 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {index < currentStep ? (
                <Icon name="Check" size={14} />
              ) : (
                index + 1
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Current Step Content */}
      <div className="space-y-6">
        <div>
          <h4 className="text-xl font-semibold text-foreground mb-2">
            {currentGuideStep?.title}
          </h4>
          <p className="text-muted-foreground mb-4">
            {currentGuideStep?.description}
          </p>
        </div>

        {/* Screenshot */}
        {currentGuideStep?.screenshot && (
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
              <Image
                src={currentGuideStep?.screenshot}
                alt={`Captura de pantalla - ${currentGuideStep?.title}`}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Captura de pantalla del Portal SAT - {currentGuideStep?.title}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div>
          <h5 className="font-medium text-foreground mb-3">Instrucciones:</h5>
          <div className="space-y-3">
            {currentGuideStep?.instructions?.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{instruction?.text}</p>
                  {instruction?.highlight && (
                    <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded text-xs text-warning">
                      <Icon name="AlertTriangle" size={14} className="inline mr-1" />
                      {instruction?.highlight}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Field Mapping */}
        {currentGuideStep?.fieldMapping && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <h5 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="MapPin" size={18} className="mr-2 text-accent" />
              Mapeo de Campos
            </h5>
            <div className="space-y-2">
              {currentGuideStep?.fieldMapping?.map((mapping, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{mapping?.field}:</span>
                  <span className="font-medium font-mono bg-muted px-2 py-1 rounded">
                    {mapping?.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Errors */}
        {currentGuideStep?.commonErrors && (
          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <h5 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="AlertCircle" size={18} className="mr-2 text-error" />
              Errores Comunes a Evitar
            </h5>
            <div className="space-y-2">
              {currentGuideStep?.commonErrors?.map((error, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <Icon name="X" size={14} className="text-error mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{error}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        {currentGuideStep?.tips && (
          <div>
            <button
              onClick={() => toggleTip(currentStep)}
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors mb-3"
            >
              <Icon 
                name={expandedTips?.has(currentStep) ? "ChevronDown" : "ChevronRight"} 
                size={16} 
              />
              <span className="font-medium">Consejos Adicionales</span>
            </button>
            
            {expandedTips?.has(currentStep) && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="space-y-2">
                  {currentGuideStep?.tips?.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <Icon name="Lightbulb" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <Icon name="ChevronLeft" size={16} className="mr-2" />
          Anterior
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {currentStep + 1} / {guideSteps?.length}
          </span>
        </div>

        <Button
          variant="default"
          onClick={nextStep}
          disabled={currentStep === guideSteps?.length - 1}
        >
          Siguiente
          <Icon name="ChevronRight" size={16} className="ml-2" />
        </Button>
      </div>
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button variant="outline" className="flex-1">
          <Icon name="ExternalLink" size={16} className="mr-2" />
          Abrir Portal SAT
        </Button>
        <Button variant="ghost" className="flex-1">
          <Icon name="Download" size={16} className="mr-2" />
          Descargar Guía PDF
        </Button>
      </div>
    </div>
  );
};

export default SATPortalGuide;