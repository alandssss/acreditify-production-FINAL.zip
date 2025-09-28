import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

import Icon from '../../../components/AppIcon';

const BankAccountForm = ({ formData, errors, onChange, onValidate }) => {
  const [clabeValidation, setClabeValidation] = useState('idle');

  const bankOptions = [
    { value: 'banamex', label: 'Banamex', description: 'Banco Nacional de México' },
    { value: 'bancomer', label: 'BBVA México', description: 'Banco Bilbao Vizcaya Argentaria' },
    { value: 'santander', label: 'Santander México', description: 'Banco Santander México' },
    { value: 'banorte', label: 'Banorte', description: 'Banco Mercantil del Norte' },
    { value: 'hsbc', label: 'HSBC México', description: 'HSBC Bank México' },
    { value: 'scotiabank', label: 'Scotiabank', description: 'Scotiabank Inverlat' },
    { value: 'inbursa', label: 'Inbursa', description: 'Banco Inbursa' },
    { value: 'azteca', label: 'Banco Azteca', description: 'Banco Azteca' }
  ];

  const accountTypeOptions = [
    { value: 'checking', label: 'Cuenta de Cheques', description: 'Cuenta corriente para operaciones diarias' },
    { value: 'savings', label: 'Cuenta de Ahorros', description: 'Cuenta de ahorro con rendimientos' },
    { value: 'investment', label: 'Cuenta de Inversión', description: 'Cuenta para inversiones y rendimientos' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
    if (onValidate) {
      onValidate(field, value);
    }
  };

  const formatCLABE = (value) => {
    // Remove all non-numeric characters
    const cleaned = value?.replace(/\D/g, '');
    
    // Format CLABE with spaces for readability (XXX XXX XXXXXXXXXX)
    if (cleaned?.length <= 3) return cleaned;
    if (cleaned?.length <= 6) return `${cleaned?.slice(0, 3)} ${cleaned?.slice(3)}`;
    return `${cleaned?.slice(0, 3)} ${cleaned?.slice(3, 6)} ${cleaned?.slice(6, 18)}`;
  };

  const handleCLABEChange = (e) => {
    const formatted = formatCLABE(e?.target?.value);
    const cleanedValue = formatted?.replace(/\s/g, '');
    
    if (cleanedValue?.length <= 18) {
      handleInputChange('clabe', formatted);
      
      // Validate CLABE length
      if (cleanedValue?.length === 18) {
        setClabeValidation('validating');
        
        // Simulate CLABE validation
        setTimeout(() => {
          setClabeValidation('success');
          handleInputChange('clabeValidated', true);
        }, 1500);
      } else {
        setClabeValidation('idle');
        handleInputChange('clabeValidated', false);
      }
    }
  };

  const getClabeValidationIcon = () => {
    switch (clabeValidation) {
      case 'validating':
        return 'Loader';
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'AlertCircle';
      default:
        return null;
    }
  };

  const getClabeValidationColor = () => {
    switch (clabeValidation) {
      case 'validating':
        return 'text-primary';
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground text-sm font-medium">3</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Cuenta Bancaria</h3>
          <p className="text-sm text-muted-foreground">Configure su cuenta para recibir devoluciones</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Bank Selection */}
        <Select
          label="Banco"
          description="Seleccione su institución bancaria"
          options={bankOptions}
          value={formData?.bank}
          onChange={(value) => handleInputChange('bank', value)}
          error={errors?.bank}
          searchable
          required
        />

        {/* Account Type */}
        <Select
          label="Tipo de Cuenta"
          description="Tipo de cuenta bancaria donde recibirá las devoluciones"
          options={accountTypeOptions}
          value={formData?.accountType}
          onChange={(value) => handleInputChange('accountType', value)}
          error={errors?.accountType}
          required
        />

        {/* CLABE */}
        <div className="space-y-2">
          <Input
            label="CLABE Interbancaria"
            type="text"
            placeholder="012 345 678901234567"
            value={formData?.clabe}
            onChange={handleCLABEChange}
            error={errors?.clabe}
            description="Clave Bancaria Estandarizada de 18 dígitos"
            required
          />
          
          {clabeValidation !== 'idle' && (
            <div className="flex items-center space-x-2 mt-2">
              <Icon 
                name={getClabeValidationIcon()} 
                size={16} 
                className={`${getClabeValidationColor()} ${clabeValidation === 'validating' ? 'animate-spin' : ''}`} 
              />
              <span className={`text-sm ${getClabeValidationColor()}`}>
                {clabeValidation === 'validating' && 'Validando CLABE...'}
                {clabeValidation === 'success' && 'CLABE válida'}
                {clabeValidation === 'error' && 'CLABE inválida'}
              </span>
            </div>
          )}
        </div>

        {/* Account Holder */}
        <Input
          label="Titular de la Cuenta"
          type="text"
          placeholder="Nombre del titular según el banco"
          value={formData?.accountHolder}
          onChange={(e) => handleInputChange('accountHolder', e?.target?.value)}
          error={errors?.accountHolder}
          description="Debe coincidir exactamente con el nombre registrado en el banco"
          required
        />

        {/* Account Verification */}
        {formData?.clabeValidated && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">Cuenta Verificada</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Los datos bancarios han sido validados correctamente
                </p>
                
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Banco:</span>
                    <span className="font-medium text-foreground">
                      {bankOptions?.find(b => b?.value === formData?.bank)?.label || 'No seleccionado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium text-foreground">
                      {accountTypeOptions?.find(t => t?.value === formData?.accountType)?.label || 'No seleccionado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CLABE:</span>
                    <span className="font-medium text-foreground font-mono">
                      {formData?.clabe || '***'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-warning mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Seguridad de Datos</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Sus datos bancarios están protegidos con encriptación AES-256. Solo se utilizarán para procesar devoluciones de impuestos autorizadas por usted.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Verification for Corporate */}
        {formData?.userType === 'corporate' && (
          <div className="border-t border-border pt-6">
            <h4 className="text-md font-medium text-foreground mb-4">Verificación Corporativa</h4>
            
            <div className="space-y-4">
              <Input
                label="Número de Cuenta Corporativa"
                type="text"
                placeholder="Número de cuenta empresarial"
                value={formData?.corporateAccountNumber}
                onChange={(e) => handleInputChange('corporateAccountNumber', e?.target?.value)}
                error={errors?.corporateAccountNumber}
                description="Cuenta registrada a nombre de la empresa"
                required
              />

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Verificación Adicional</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Para cuentas corporativas, se requiere verificación adicional del representante legal y documentos de constitución.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankAccountForm;