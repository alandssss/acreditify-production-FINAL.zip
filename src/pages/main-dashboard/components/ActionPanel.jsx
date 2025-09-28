import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { UserGuidanceTooltip } from '../../../components/ui/EnhancedUXComponents';

const ActionPanel = () => {
  const navigate = useNavigate();
  const [activeTooltip, setActiveTooltip] = useState(null);

  const primaryActions = [
    {
      title: 'Nueva Solicitud',
      description: 'Iniciar proceso de devolución de impuestos guiado paso a paso',
      detailedDescription: 'Te guiaremos a través de un proceso simple de 5 pasos para maximizar tu devolución fiscal.',
      icon: 'Plus',
      color: 'bg-primary text-primary-foreground',
      path: '/refund-request-wizard',
      estimatedTime: '15-20 min',
      difficulty: 'Fácil',
      benefits: ['Proceso guiado', 'Validación automática', 'Máximo reembolso']
    },
    {
      title: 'Subir Documentos',
      description: 'Gestionar archivos y documentos fiscales con validación inteligente',
      detailedDescription: 'Sube tus CFDI, estados de cuenta y otros documentos. Nuestro sistema los validará automáticamente.',
      icon: 'Upload',
      color: 'bg-accent text-accent-foreground',
      path: '/document-upload-manager',
      estimatedTime: '5-10 min',
      difficulty: 'Muy Fácil',
      benefits: ['OCR automático', 'Validación SAT', 'Compresión inteligente']
    }
  ];

  const quickActions = [
    {
      title: 'Validar CFDI',
      icon: 'FileCheck',
      path: '/compliance-verification',
      tooltip: {
        title: 'Verificación de Cumplimiento',
        content: 'Valida tus CFDI contra las regulaciones del SAT y detecta errores automáticamente.'
      }
    },
    {
      title: 'Seguimiento',
      icon: 'Search',
      path: '/refund-status-tracking',
      tooltip: {
        title: 'Rastreo de Solicitudes',
        content: 'Monitorea el estado de tus solicitudes de devolución en tiempo real con actualizaciones automáticas.'
      }
    },
    {
      title: 'Cuenta Bancaria',
      icon: 'CreditCard',
      path: '/user-registration',
      tooltip: {
        title: 'Configuración Bancaria',
        content: 'Configura tu cuenta CLABE para recibir las devoluciones directamente en tu banco.'
      }
    },
    {
      title: 'Cumplimiento',
      icon: 'Shield',
      path: '/compliance-verification',
      tooltip: {
        title: 'Verificación de Cumplimiento',
        content: 'Asegúrate de que todos tus documentos cumplen con las regulaciones fiscales vigentes.'
      }
    }
  ];

  const handleTooltipToggle = (actionTitle) => {
    setActiveTooltip(activeTooltip === actionTitle ? null : actionTitle);
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Primary Actions with detailed information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {primaryActions?.map((action) => (
          <div
            key={action?.title}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => navigate(action?.path)}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <Icon name={action?.icon} size={128} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-start space-x-4 mb-4">
                <div className={`${action?.color} p-4 rounded-xl group-hover:scale-105 transition-transform shadow-sm`}>
                  <Icon name={action?.icon} size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-2">{action?.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {action?.detailedDescription}
                  </p>
                  
                  {/* Metadata */}
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{action?.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="BarChart3" size={12} />
                      <span>{action?.difficulty}</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {action?.benefits?.map((benefit, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted/50 rounded-full text-xs text-muted-foreground"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-primary text-sm font-semibold">
                    Comenzar ahora
                    <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Quick Actions with tooltips */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Acciones Rápidas</h3>
            <p className="text-sm text-muted-foreground">Herramientas frecuentes para gestionar tus trámites</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setActiveTooltip(null)}
          >
            <Icon name="Info" size={16} className="mr-2" />
            Mostrar ayuda
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions?.map((action) => (
            <div key={action?.title} className="relative">
              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-muted/50 hover:border-primary/50 transition-all group w-full"
                onClick={() => navigate(action?.path)}
                onMouseEnter={() => setActiveTooltip(action?.title)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon name={action?.icon} size={24} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-center leading-tight">{action?.title}</span>
              </Button>

              {/* Tooltip */}
              {action?.tooltip && (
                <UserGuidanceTooltip
                  title={action?.tooltip?.title}
                  content={action?.tooltip?.content}
                  position="top"
                  isVisible={activeTooltip === action?.title}
                  onClose={() => setActiveTooltip(null)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon name="HelpCircle" size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-2">¿Necesitas ayuda?</h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Nuestro asistente inteligente puede guiarte paso a paso en cualquier proceso. 
              También puedes acceder a la documentación completa y tutoriales en video.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="sm">
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Chat de Ayuda
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="BookOpen" size={16} className="mr-2" />
                Ver Tutoriales
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Phone" size={16} className="mr-2" />
                Soporte Técnico
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;