import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BasicInfoForm = ({ formData, errors, onChange, onValidate }) => {
  const userTypeOptions = [
    { value: 'individual', label: 'Persona Física', description: 'Trabajador asalariado, profesionista independiente' },
    { value: 'corporate', label: 'Persona Moral', description: 'Empresa, sociedad, corporación' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
    if (onValidate) {
      onValidate(field, value);
    }
  };

  const formatRFC = (value) => {
    // Remove spaces and convert to uppercase
    const cleaned = value?.replace(/\s/g, '')?.toUpperCase();
    
    // Format RFC with spaces for readability
    if (cleaned?.length <= 4) return cleaned;
    if (cleaned?.length <= 10) return `${cleaned?.slice(0, 4)} ${cleaned?.slice(4)}`;
    return `${cleaned?.slice(0, 4)} ${cleaned?.slice(4, 10)} ${cleaned?.slice(10, 13)}`;
  };

  const handleRFCChange = (e) => {
    const formatted = formatRFC(e?.target?.value);
    if (formatted?.replace(/\s/g, '')?.length <= 13) {
      handleInputChange('rfc', formatted);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground text-sm font-medium">1</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Información Básica</h3>
          <p className="text-sm text-muted-foreground">Complete sus datos personales y fiscales</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* User Type Selection */}
        <Select
          label="Tipo de Usuario"
          description="Seleccione el tipo de contribuyente que representa"
          options={userTypeOptions}
          value={formData?.userType}
          onChange={(value) => handleInputChange('userType', value)}
          error={errors?.userType}
          required
          className="mb-6"
        />

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nombre Completo"
            type="text"
            placeholder="Ingrese su nombre completo"
            value={formData?.fullName}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            error={errors?.fullName}
            required
          />

          <Input
            label="RFC"
            type="text"
            placeholder="ABCD123456ABC"
            value={formData?.rfc}
            onChange={handleRFCChange}
            error={errors?.rfc}
            description="Registro Federal de Contribuyentes de 12 o 13 caracteres"
            required
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="usuario@ejemplo.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            description="Utilizaremos este correo para notificaciones importantes"
            required
          />

          <Input
            label="Teléfono"
            type="tel"
            placeholder="55 1234 5678"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
            description="Número de contacto para verificación"
            required
          />
        </div>

        {/* Corporate Additional Fields */}
        {formData?.userType === 'corporate' && (
          <div className="border-t border-border pt-6">
            <h4 className="text-md font-medium text-foreground mb-4">Información Corporativa</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Razón Social"
                type="text"
                placeholder="Nombre de la empresa"
                value={formData?.companyName}
                onChange={(e) => handleInputChange('companyName', e?.target?.value)}
                error={errors?.companyName}
                required
              />

              <Input
                label="Representante Legal"
                type="text"
                placeholder="Nombre del representante"
                value={formData?.legalRepresentative}
                onChange={(e) => handleInputChange('legalRepresentative', e?.target?.value)}
                error={errors?.legalRepresentative}
                required
              />
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="border-t border-border pt-6">
          <Checkbox
            label="Acepto los términos y condiciones"
            description="He leído y acepto los términos de servicio y la política de privacidad"
            checked={formData?.acceptTerms}
            onChange={(e) => handleInputChange('acceptTerms', e?.target?.checked)}
            error={errors?.acceptTerms}
            required
          />

          <div className="mt-4">
            <Checkbox
              label="Acepto recibir notificaciones por correo electrónico"
              description="Notificaciones sobre el estado de mis solicitudes y actualizaciones del sistema"
              checked={formData?.acceptNotifications}
              onChange={(e) => handleInputChange('acceptNotifications', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;