import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegistrationSidebar = ({ currentStep, estimatedTime, completionPercentage }) => {
  const requirements = [
    {
      id: 1,
      title: 'RFC Válido',
      description: 'Registro Federal de Contribuyentes activo',
      completed: currentStep > 1,
      required: true
    },
    {
      id: 2,
      title: 'e.firma (FIEL)',
      description: 'Certificado digital vigente del SAT',
      completed: currentStep > 2,
      required: true
    },
    {
      id: 3,
      title: 'Cuenta Bancaria',
      description: 'CLABE interbancaria válida',
      completed: currentStep > 3,
      required: true
    },
    {
      id: 4,
      title: 'Correo Electrónico',
      description: 'Email para notificaciones',
      completed: currentStep >= 1,
      required: true
    },
    {
      id: 5,
      title: 'Teléfono',
      description: 'Número de contacto verificado',
      completed: currentStep >= 1,
      required: false
    }
  ];

  const benefits = [
    {
      icon: 'Zap',
      title: 'Proceso Automatizado',
      description: 'Validación automática de documentos con IA'
    },
    {
      icon: 'Shield',
      title: 'Seguridad Garantizada',
      description: 'Encriptación AES-256 para todos sus datos'
    },
    {
      icon: 'Clock',
      title: 'Ahorro de Tiempo',
      description: 'Reduce el tiempo de proceso en 80%'
    },
    {
      icon: 'CheckCircle',
      title: 'Cumplimiento SAT',
      description: '100% compatible con regulaciones fiscales'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Progreso del Registro</h3>
          <span className="text-sm font-medium text-primary">{completionPercentage}%</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 mb-4">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tiempo estimado restante:</span>
          <span className="font-medium text-foreground">{estimatedTime} min</span>
        </div>
      </div>
      {/* Requirements Checklist */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Requisitos</h3>
        
        <div className="space-y-3">
          {requirements?.map((req) => (
            <div key={req?.id} className="flex items-start space-x-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                req?.completed 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-muted border border-border'
              }`}>
                {req?.completed ? (
                  <Icon name="Check" size={12} />
                ) : (
                  <span className="w-2 h-2 bg-muted-foreground rounded-full" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className={`text-sm font-medium ${
                    req?.completed ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {req?.title}
                  </h4>
                  {req?.required && (
                    <span className="text-xs text-error">*</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {req?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="text-error">*</span> Campos obligatorios para completar el registro
          </p>
        </div>
      </div>
      {/* Benefits */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Beneficios</h3>
        
        <div className="space-y-4">
          {benefits?.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={benefit?.icon} size={16} className="text-primary" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">
                  {benefit?.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {benefit?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Help Section */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="HelpCircle" size={20} className="text-primary mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">¿Necesita Ayuda?</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              Nuestro equipo de soporte está disponible para asistirle durante el proceso de registro.
            </p>
            
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Icon name="MessageCircle" size={14} className="mr-2" />
                Chat en Vivo
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Icon name="Phone" size={14} className="mr-2" />
                55 1234 5678
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Icon name="Mail" size={14} className="mr-2" />
                soporte@devolusat.mx
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Security Badge */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-success" />
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-medium text-foreground">Sitio Seguro</h4>
            <p className="text-xs text-muted-foreground">
              Certificado SSL • Encriptación AES-256
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSidebar;