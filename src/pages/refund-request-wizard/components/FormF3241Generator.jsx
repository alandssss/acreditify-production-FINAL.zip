import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FormF3241Generator = ({ 
  refundType, 
  formData, 
  onFormDataChange, 
  calculationResults,
  annexesStatus 
}) => {
  const [activeSection, setActiveSection] = useState('general');

  const regimeOptions = [
    { value: 'general', label: 'Régimen General de Ley' },
    { value: 'resico', label: 'Régimen Simplificado de Confianza (RESICO)' },
    { value: 'incorporacion', label: 'Régimen de Incorporación Fiscal' },
    { value: 'actividades', label: 'Régimen de Actividades Empresariales' },
    { value: 'profesional', label: 'Régimen de Servicios Profesionales' },
    { value: 'arrendamiento', label: 'Régimen de Arrendamiento' }
  ];

  const periodOptions = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ];

  const monthOptions = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  const requiredAnnexes = {
    iva: [
      { id: 'anexo1', name: 'Anexo 1 - Determinación del IVA', required: true, status: 'pending' },
      { id: 'anexo2', name: 'Anexo 2 - Relación de CFDI', required: true, status: 'completed' },
      { id: 'anexo3', name: 'Anexo 3 - Conciliación contable', required: false, status: 'pending' }
    ],
    isr: [
      { id: 'anexo1', name: 'Anexo 1 - Determinación del ISR', required: true, status: 'completed' },
      { id: 'anexo2', name: 'Anexo 2 - Retenciones aplicadas', required: true, status: 'completed' },
      { id: 'anexo4', name: 'Anexo 4 - Deducciones personales', required: false, status: 'pending' }
    ],
    ieps: [
      { id: 'anexo1', name: 'Anexo 1 - Determinación del IEPS', required: true, status: 'pending' },
      { id: 'anexo5', name: 'Anexo 5 - Inventarios', required: true, status: 'pending' }
    ]
  };

  const sections = [
    { id: 'general', name: 'Datos Generales', icon: 'User' },
    { id: 'calculation', name: 'Cálculo del Impuesto', icon: 'Calculator' },
    { id: 'annexes', name: 'Anexos Requeridos', icon: 'FileText' },
    { id: 'bank', name: 'Datos Bancarios', icon: 'CreditCard' }
  ];

  const handleInputChange = (field, value) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    })?.format(amount || 0);
  };

  const getAnnexStatus = (annexId) => {
    return annexesStatus?.[annexId] || 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'pending':
        return 'Clock';
      default:
        return 'FileText';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'pending':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Formulario F3241 (FED) - {refundType?.toUpperCase()}
        </h2>
        <p className="text-muted-foreground">
          Completa los datos requeridos. Los campos marcados se han llenado automáticamente.
        </p>
      </div>
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections?.map((section) => (
          <Button
            key={section?.id}
            variant={activeSection === section?.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection(section?.id)}
            iconName={section?.icon}
            iconPosition="left"
          >
            {section?.name}
          </Button>
        ))}
      </div>
      {/* General Data Section */}
      {activeSection === 'general' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="User" size={20} className="mr-2" />
            Datos Generales del Contribuyente
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="RFC"
              type="text"
              value={formData?.rfc || 'XAXX010101000'}
              onChange={(e) => handleInputChange('rfc', e?.target?.value)}
              description="RFC registrado ante el SAT"
              required
            />
            
            <Input
              label="Razón Social / Nombre"
              type="text"
              value={formData?.name || 'Juan Pérez García'}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              required
            />
            
            <Select
              label="Régimen Fiscal"
              options={regimeOptions}
              value={formData?.regime || 'general'}
              onChange={(value) => handleInputChange('regime', value)}
              required
            />
            
            <Select
              label="Ejercicio Fiscal"
              options={periodOptions}
              value={formData?.fiscalYear || '2024'}
              onChange={(value) => handleInputChange('fiscalYear', value)}
              required
            />
            
            <Select
              label="Periodo (Mes)"
              options={monthOptions}
              value={formData?.period || '12'}
              onChange={(value) => handleInputChange('period', value)}
              description="Mes al que corresponde la devolución"
              required
            />
            
            <Input
              label="CURP"
              type="text"
              value={formData?.curp || 'PEGJ800101HDFRNN09'}
              onChange={(e) => handleInputChange('curp', e?.target?.value)}
              description="Clave Única de Registro de Población"
            />
          </div>
        </div>
      )}
      {/* Calculation Section */}
      {activeSection === 'calculation' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Calculator" size={20} className="mr-2" />
            Cálculo del Impuesto - {refundType?.toUpperCase()}
          </h3>
          
          <div className="space-y-6">
            {/* Calculation Summary */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Resumen del Cálculo</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Impuesto Pagado</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatCurrency(calculationResults?.paidAmount || 45000)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Impuesto Causado</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatCurrency(calculationResults?.causedAmount || 38500)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Saldo a Favor</p>
                  <p className="text-xl font-semibold text-success">
                    {formatCurrency(calculationResults?.refundAmount || 6500)}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Base Gravable"
                type="number"
                value={formData?.taxableBase || '287500'}
                onChange={(e) => handleInputChange('taxableBase', e?.target?.value)}
                description="Monto sobre el cual se calcula el impuesto"
                required
              />
              
              <Input
                label="Tasa Aplicable (%)"
                type="number"
                value={formData?.taxRate || (refundType === 'iva' ? '16' : '30')}
                onChange={(e) => handleInputChange('taxRate', e?.target?.value)}
                description="Tasa de impuesto aplicable"
                required
              />
              
              <Input
                label="Retenciones Aplicadas"
                type="number"
                value={formData?.withholdingTax || '45000'}
                onChange={(e) => handleInputChange('withholdingTax', e?.target?.value)}
                description="Total de retenciones aplicadas"
              />
              
              <Input
                label="Pagos Provisionales"
                type="number"
                value={formData?.provisionalPayments || '0'}
                onChange={(e) => handleInputChange('provisionalPayments', e?.target?.value)}
                description="Pagos provisionales realizados"
              />
            </div>

            {/* Deductions (for ISR) */}
            {refundType === 'isr' && (
              <div className="border-t border-border pt-4">
                <h4 className="font-medium text-foreground mb-3">Deducciones Aplicables</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Deducciones Personales"
                    type="number"
                    value={formData?.personalDeductions || '25000'}
                    onChange={(e) => handleInputChange('personalDeductions', e?.target?.value)}
                    description="Gastos médicos, educativos, etc."
                  />
                  
                  <Input
                    label="Otras Deducciones"
                    type="number"
                    value={formData?.otherDeductions || '0'}
                    onChange={(e) => handleInputChange('otherDeductions', e?.target?.value)}
                    description="Otras deducciones autorizadas"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Annexes Section */}
      {activeSection === 'annexes' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="FileText" size={20} className="mr-2" />
            Anexos Requeridos
          </h3>
          
          <div className="space-y-4">
            {requiredAnnexes?.[refundType]?.map((annex) => {
              const status = getAnnexStatus(annex?.id);
              
              return (
                <div 
                  key={annex?.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getStatusIcon(status)} 
                      size={20} 
                      className={getStatusColor(status)} 
                    />
                    <div>
                      <h4 className="font-medium text-foreground">{annex?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {annex?.required ? 'Obligatorio' : 'Opcional'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getStatusColor(status)}`}>
                      {status === 'completed' ? 'Completado' : 
                       status === 'error' ? 'Error' : 'Pendiente'}
                    </span>
                    <Button variant="outline" size="sm">
                      {status === 'completed' ? 'Ver' : 'Generar'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Importante</h4>
                <p className="text-sm text-muted-foreground">
                  Los anexos se generan automáticamente basándose en tus documentos subidos. 
                  Revisa que toda la información sea correcta antes de continuar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Bank Data Section */}
      {activeSection === 'bank' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="CreditCard" size={20} className="mr-2" />
            Datos Bancarios para Devolución
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="CLABE Interbancaria"
              type="text"
              value={formData?.clabe || '012345678901234567'}
              onChange={(e) => handleInputChange('clabe', e?.target?.value)}
              description="18 dígitos de la CLABE"
              required
            />
            
            <Input
              label="Banco"
              type="text"
              value={formData?.bank || 'BBVA México'}
              onChange={(e) => handleInputChange('bank', e?.target?.value)}
              description="Nombre del banco"
              required
            />
            
            <Input
              label="Titular de la Cuenta"
              type="text"
              value={formData?.accountHolder || 'Juan Pérez García'}
              onChange={(e) => handleInputChange('accountHolder', e?.target?.value)}
              description="Debe coincidir con el RFC"
              required
            />
            
            <Input
              label="Número de Cuenta"
              type="text"
              value={formData?.accountNumber || '0123456789'}
              onChange={(e) => handleInputChange('accountNumber', e?.target?.value)}
              description="Número de cuenta bancaria"
            />
          </div>
          
          <div className="mt-4">
            <Checkbox
              label="Confirmo que los datos bancarios son correctos y la cuenta está a mi nombre"
              checked={formData?.bankDataConfirmed || false}
              onChange={(e) => handleInputChange('bankDataConfirmed', e?.target?.checked)}
              required
            />
          </div>
        </div>
      )}
      {/* Form Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Formulario guardado automáticamente
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Icon name="Save" size={16} className="mr-2" />
            Guardar Borrador
          </Button>
          <Button variant="default">
            Validar Formulario
            <Icon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormF3241Generator;