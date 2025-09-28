import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const ProgressBreadcrumbs = ({ currentStep = null, totalSteps = null, customBreadcrumbs = null }) => {
  const location = useLocation();

  const defaultBreadcrumbs = [
    { label: 'Inicio', path: '/', icon: 'Home' },
    { label: 'Documentos', path: '/document-upload-manager', icon: 'Upload' },
    { label: 'Nueva Solicitud', path: '/refund-request-wizard', icon: 'FileText' },
    { label: 'Verificación', path: '/compliance-verification', icon: 'Shield' },
    { label: 'Preparación', path: '/submission-preparation', icon: 'CheckCircle' },
    { label: 'Seguimiento', path: '/refund-status-tracking', icon: 'Search' }
  ];

  const breadcrumbs = customBreadcrumbs || defaultBreadcrumbs;

  const getCurrentBreadcrumb = () => {
    return breadcrumbs?.find(item => item?.path === location?.pathname) || breadcrumbs?.[0];
  };

  const getParentBreadcrumbs = () => {
    const current = getCurrentBreadcrumb();
    const currentIndex = breadcrumbs?.findIndex(item => item?.path === current?.path);
    
    if (currentIndex <= 0) return [breadcrumbs?.[0]];
    
    return breadcrumbs?.slice(0, currentIndex + 1);
  };

  const isWizardStep = currentStep !== null && totalSteps !== null;
  const parentBreadcrumbs = getParentBreadcrumbs();

  return (
    <div className="bg-background border-b border-border">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm">
            {parentBreadcrumbs?.map((item, index) => (
              <div key={item?.path} className="flex items-center">
                {index > 0 && (
                  <Icon name="ChevronRight" size={16} className="mx-2 text-muted-foreground" />
                )}
                <div className={`breadcrumb-item ${index === parentBreadcrumbs?.length - 1 ? 'active' : ''}`}>
                  <Icon name={item?.icon} size={16} className="mr-2" />
                  {index === parentBreadcrumbs?.length - 1 ? (
                    <span className="font-medium">{item?.label}</span>
                  ) : (
                    <a href={item?.path} className="hover:text-primary transition-colors">
                      {item?.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </nav>

          {/* Step Progress (for wizard flows) */}
          {isWizardStep && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                {Array.from({ length: totalSteps }, (_, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = stepNumber < currentStep;
                  const isCurrent = stepNumber === currentStep;
                  const isPending = stepNumber > currentStep;

                  return (
                    <div key={stepNumber} className="flex items-center">
                      {index > 0 && (
                        <div className={`w-8 h-0.5 ${isCompleted ? 'bg-success' : 'bg-border'}`} />
                      )}
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
                    </div>
                  );
                })}
              </div>

              {/* Mobile Step Counter */}
              <div className="sm:hidden flex items-center space-x-2">
                <div className="progress-step current">
                  <span className="text-xs font-medium">{currentStep}</span>
                </div>
                <span className="text-sm text-muted-foreground">de {totalSteps}</span>
              </div>

              <div className="text-sm text-muted-foreground">
                Paso {currentStep} de {totalSteps}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Breadcrumb Expansion */}
        <div className="sm:hidden mt-2">
          <button className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors">
            <Icon name="ChevronDown" size={14} className="mr-1" />
            Ver ruta completa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressBreadcrumbs;