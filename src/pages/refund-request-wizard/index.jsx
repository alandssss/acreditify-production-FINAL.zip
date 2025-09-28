import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const RefundRequestWizard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    taxType: 'IVA', // Default selection
    income: '',
    deductions: '',
    period: '2024-01',
    activities: []
  });

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-subtle-light dark:text-subtle-dark">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/main-dashboard');
    }
  };

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to compliance verification
      navigate('/compliance-verification');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "¿Qué tipo de impuesto deseas solicitar?";
      case 2:
        return "Información de Ingresos";
      case 3:
        return "Confirmar Información";
      default:
        return "";
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <label className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
        formData.taxType === 'IVA'
          ? 'border-primary ring-2 ring-primary'
          : 'border-subtle-light dark:border-subtle-dark'
      }`}>
        <div className="flex flex-col">
          <span className="font-bold text-foreground-light dark:text-foreground-dark">IVA</span>
          <span className="text-sm text-muted-light dark:text-muted-dark">Impuesto al Valor Agregado</span>
        </div>
        <input
          type="radio"
          name="tax_type"
          value="IVA"
          checked={formData.taxType === 'IVA'}
          onChange={(e) => handleInputChange('taxType', e.target.value)}
          className="form-radio h-6 w-6 text-primary bg-transparent border-2 border-subtle-light dark:border-subtle-dark checked:bg-primary focus:ring-primary focus:ring-offset-0"
        />
      </label>

      <label className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
        formData.taxType === 'ISR'
          ? 'border-primary ring-2 ring-primary'
          : 'border-subtle-light dark:border-subtle-dark'
      }`}>
        <div className="flex flex-col">
          <span className="font-bold text-foreground-light dark:text-foreground-dark">ISR</span>
          <span className="text-sm text-muted-light dark:text-muted-dark">Impuesto Sobre la Renta</span>
        </div>
        <input
          type="radio"
          name="tax_type"
          value="ISR"
          checked={formData.taxType === 'ISR'}
          onChange={(e) => handleInputChange('taxType', e.target.value)}
          className="form-radio h-6 w-6 text-primary bg-transparent border-2 border-subtle-light dark:border-subtle-dark checked:bg-primary focus:ring-primary focus:ring-offset-0"
        />
      </label>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">
          Ingresos del Período
        </label>
        <input
          type="number"
          placeholder="$0.00"
          value={formData.income}
          onChange={(e) => handleInputChange('income', e.target.value)}
          className="w-full p-4 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark focus:border-primary focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">
          Deducciones Autorizadas
        </label>
        <input
          type="number"
          placeholder="$0.00"
          value={formData.deductions}
          onChange={(e) => handleInputChange('deductions', e.target.value)}
          className="w-full p-4 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark focus:border-primary focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">
          Período Fiscal
        </label>
        <select
          value={formData.period}
          onChange={(e) => handleInputChange('period', e.target.value)}
          className="w-full p-4 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark focus:border-primary focus:ring-2 focus:ring-primary"
        >
          <option value="2024-01">Enero 2024</option>
          <option value="2024-02">Febrero 2024</option>
          <option value="2024-03">Marzo 2024</option>
          <option value="2024-04">Abril 2024</option>
          <option value="2024-05">Mayo 2024</option>
          <option value="2024-06">Junio 2024</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-subtle-light/10 dark:bg-subtle-dark/10 rounded-lg p-4">
        <h3 className="font-bold text-foreground-light dark:text-foreground-dark mb-4">
          Resumen de tu solicitud
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-light dark:text-muted-dark">Tipo de Impuesto:</span>
            <span className="font-medium text-foreground-light dark:text-foreground-dark">{formData.taxType}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-light dark:text-muted-dark">Ingresos:</span>
            <span className="font-medium text-foreground-light dark:text-foreground-dark">
              ${formData.income ? parseFloat(formData.income).toLocaleString('es-MX', { minimumFractionDigits: 2 }) : '0.00'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-light dark:text-muted-dark">Deducciones:</span>
            <span className="font-medium text-foreground-light dark:text-foreground-dark">
              ${formData.deductions ? parseFloat(formData.deductions).toLocaleString('es-MX', { minimumFractionDigits: 2 }) : '0.00'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-light dark:text-muted-dark">Período:</span>
            <span className="font-medium text-foreground-light dark:text-foreground-dark">{formData.period}</span>
          </div>

          <div className="border-t border-subtle-light dark:border-subtle-dark pt-3 mt-3">
            <div className="flex justify-between">
              <span className="font-bold text-foreground-light dark:text-foreground-dark">Devolución Estimada:</span>
              <span className="font-bold text-primary">
                ${formData.income && formData.deductions
                  ? (parseFloat(formData.income) * 0.16 - parseFloat(formData.deductions) * 0.16).toLocaleString('es-MX', { minimumFractionDigits: 2 })
                  : '0.00'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-foreground-light dark:text-foreground-dark">
          <strong>Nota:</strong> Esta es una estimación. El monto real de devolución será calculado después de la verificación de documentos y cumplimiento normativo.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen justify-between font-display bg-background-light dark:bg-background-dark">
      <div>
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark">
          <button
            onClick={handleBack}
            className="text-foreground-light dark:text-foreground-dark"
          >
            <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h1 className="text-lg font-bold text-foreground-light dark:text-foreground-dark grow text-center">
            Solicitud de Devolución
          </h1>
          <div className="w-6"></div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          {/* Progress Bar */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">
              Paso {currentStep} de 3
            </p>
            <div className="w-full bg-subtle-light dark:bg-subtle-dark rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Title */}
          <h2 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark mb-4">
            {getStepTitle()}
          </h2>

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </main>
      </div>

      {/* Footer Button */}
      <div className="p-4 bg-background-light dark:bg-background-dark">
        <button
          onClick={handleContinue}
          className="w-full bg-primary text-white font-bold py-3 px-5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          {currentStep === 3 ? 'Finalizar Solicitud' : 'Continuar'}
        </button>
      </div>

      {/* CSS for radio buttons */}
      <style jsx>{`
        .form-radio:checked {
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='4'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};

export default RefundRequestWizard;