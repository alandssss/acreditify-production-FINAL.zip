import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Cifrado AES-256',
      description: 'Protección de datos de nivel bancario'
    },
    {
      icon: 'Lock',
      title: 'Certificado SSL',
      description: 'Conexión segura verificada'
    },
    {
      icon: 'CheckCircle',
      title: 'Cumplimiento SAT',
      description: 'Validado por autoridades fiscales'
    }
  ];

  const certifications = [
    {
      name: 'SAT Autorizado',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=40&fit=crop&crop=center',
      description: 'Proveedor Autorizado de Certificación'
    },
    {
      name: 'ISO 27001',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=60&h=40&fit=crop&crop=center',
      description: 'Gestión de Seguridad de la Información'
    },
    {
      name: 'CNBV',
      logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=60&h=40&fit=crop&crop=center',
      description: 'Regulado por Comisión Nacional Bancaria'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Contadora Pública',
      comment: 'He procesado más de 200 devoluciones sin problemas. Excelente plataforma.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    {
      name: 'Carlos Hernández',
      role: 'Empresario',
      comment: 'Recuperé $45,000 MXN en devoluciones corporativas. Muy confiable.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Seguridad Garantizada
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name={feature?.icon} size={24} className="text-primary" />
              </div>
              <h4 className="font-medium text-foreground text-sm mb-1">
                {feature?.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {feature?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Certifications */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Certificaciones Oficiales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {certifications?.map((cert, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg">
              <img
                src={cert?.logo}
                alt={cert?.name}
                className="w-12 h-8 object-contain rounded"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
              <div>
                <h4 className="font-medium text-foreground text-sm">
                  {cert?.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {cert?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* User Testimonials */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Testimonios de Usuarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials?.map((testimonial, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <img
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-foreground text-sm">
                      {testimonial?.name}
                    </h4>
                    <div className="flex space-x-1">
                      {[...Array(testimonial?.rating)]?.map((_, i) => (
                        <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {testimonial?.role}
                  </p>
                  <p className="text-sm text-foreground">
                    "{testimonial?.comment}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="text-center py-4 border-t border-border">
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} className="text-success" />
            <span>+50,000 usuarios activos</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} className="text-success" />
            <span>$2.5B MXN procesados</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Award" size={16} className="text-success" />
            <span>99.8% tasa de éxito</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityBadges;