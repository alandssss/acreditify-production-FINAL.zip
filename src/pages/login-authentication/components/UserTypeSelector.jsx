import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const UserTypeSelector = ({ selectedType, onTypeChange }) => {
  const userTypes = [
    {
      id: 'fisica',
      label: 'Persona Física',
      description: 'Individuos, empleados, profesionistas independientes',
      icon: 'User',
      features: [
        'Devoluciones de salarios',
        'Honorarios profesionales',
        'Arrendamiento',
        'Enajenación de bienes'
      ]
    },
    {
      id: 'moral',
      label: 'Persona Moral',
      description: 'Empresas, corporaciones, sociedades',
      icon: 'Building',
      features: [
        'Devoluciones corporativas',
        'IVA acreditable',
        'Pagos provisionales',
        'Múltiples representantes'
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Tipo de Contribuyente
        </h3>
        <p className="text-sm text-muted-foreground">
          Seleccione su clasificación fiscal para personalizar la experiencia
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userTypes?.map((type) => (
          <div
            key={type?.id}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
              selectedType === type?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
            onClick={() => onTypeChange(type?.id)}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedType === type?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Icon name={type?.icon} size={24} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-foreground">{type?.label}</h4>
                  {selectedType === type?.id && (
                    <Icon name="CheckCircle" size={16} className="text-primary" />
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {type?.description}
                </p>
                
                <ul className="space-y-1">
                  {type?.features?.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Icon name="Check" size={12} className="text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <input
              type="radio"
              name="userType"
              value={type?.id}
              checked={selectedType === type?.id}
              onChange={() => onTypeChange(type?.id)}
              className="absolute top-4 right-4 w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2"
            />
          </div>
        ))}
      </div>
      {selectedType && (
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Configuración para {userTypes?.find(t => t?.id === selectedType)?.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedType === 'fisica' ?'Se habilitarán formularios específicos para personas físicas y validaciones de RFC individuales.' :'Se habilitarán funciones corporativas, múltiples usuarios y validaciones empresariales.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTypeSelector;