import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressBreadcrumbs from '../../components/ui/ProgressBreadcrumbs';
import RegistrationSteps from './components/RegistrationSteps';
import BasicInfoForm from './components/BasicInfoForm';
import CertificateUploadForm from './components/CertificateUploadForm';
import BankAccountForm from './components/BankAccountForm';
import RegistrationSidebar from './components/RegistrationSidebar';
import NavigationButtons from './components/NavigationButtons';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    userType: '',
    fullName: '',
    rfc: '',
    email: '',
    phone: '',
    companyName: '',
    legalRepresentative: '',
    acceptTerms: false,
    acceptNotifications: false,
    
    // Certificate
    certificatePassword: '',
    certificateFile: null,
    certificateValidated: false,
    
    // Bank Account
    bank: '',
    accountType: '',
    clabe: '',
    accountHolder: '',
    clabeValidated: false,
    corporateAccountNumber: ''
  });

  const [errors, setErrors] = useState({});

  const totalSteps = 3;
  const wizardSteps = [
    { id: 1, label: 'Información' },
    { id: 2, label: 'Certificado' },
    { id: 3, label: 'Cuenta' }
  ];

  // Mock credentials for testing
  const mockCredentials = {
    email: "usuario@ejemplo.com",
    password: "DevoluSAT2024!",
    rfc: "ABCD123456ABC",
    phone: "55 1234 5678"
  };

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    if (!isLoggedIn) {
      // Allow registration process to continue
    }
  }, []);

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData?.userType) newErrors.userType = 'Seleccione el tipo de usuario';
        if (!formData?.fullName?.trim()) newErrors.fullName = 'El nombre completo es requerido';
        if (!formData?.rfc?.trim()) newErrors.rfc = 'El RFC es requerido';
        if (formData?.rfc?.replace(/\s/g, '')?.length < 12) newErrors.rfc = 'RFC debe tener 12 o 13 caracteres';
        if (!formData?.email?.trim()) newErrors.email = 'El correo electrónico es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) newErrors.email = 'Formato de correo inválido';
        if (!formData?.phone?.trim()) newErrors.phone = 'El teléfono es requerido';
        if (!formData?.acceptTerms) newErrors.acceptTerms = 'Debe aceptar los términos y condiciones';
        
        if (formData?.userType === 'corporate') {
          if (!formData?.companyName?.trim()) newErrors.companyName = 'La razón social es requerida';
          if (!formData?.legalRepresentative?.trim()) newErrors.legalRepresentative = 'El representante legal es requerido';
        }
        break;

      case 2:
        if (!formData?.certificatePassword?.trim()) newErrors.certificatePassword = 'La contraseña del certificado es requerida';
        if (!formData?.certificateFile) newErrors.certificateFile = 'Debe subir los archivos del certificado';
        if (!formData?.certificateValidated) newErrors.certificateFile = 'El certificado debe ser validado';
        break;

      case 3:
        if (!formData?.bank) newErrors.bank = 'Seleccione un banco';
        if (!formData?.accountType) newErrors.accountType = 'Seleccione el tipo de cuenta';
        if (!formData?.clabe?.trim()) newErrors.clabe = 'La CLABE es requerida';
        if (formData?.clabe?.replace(/\s/g, '')?.length !== 18) newErrors.clabe = 'CLABE debe tener 18 dígitos';
        if (!formData?.accountHolder?.trim()) newErrors.accountHolder = 'El titular de la cuenta es requerido';
        if (!formData?.clabeValidated) newErrors.clabe = 'La CLABE debe ser validada';
        
        if (formData?.userType === 'corporate') {
          if (!formData?.corporateAccountNumber?.trim()) newErrors.corporateAccountNumber = 'El número de cuenta corporativa es requerido';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store user data
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify({
        ...formData,
        registrationDate: new Date()?.toISOString(),
        userId: `user_${Date.now()}`
      }));

      // Navigate to dashboard
      navigate('/main-dashboard');
    } catch (error) {
      setErrors({ submit: 'Error al crear la cuenta. Intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file) => {
    // Handle certificate file upload
    console.log('File uploaded:', file?.name);
  };

  const getEstimatedTime = () => {
    const timePerStep = { 1: 5, 2: 8, 3: 4 };
    let totalTime = 0;
    for (let step = currentStep; step <= totalSteps; step++) {
      totalTime += timePerStep?.[step] || 0;
    }
    return totalTime;
  };

  const getCompletionPercentage = () => {
    return Math.round(((currentStep - 1) / totalSteps) * 100);
  };

  const isStepValid = () => {
    return validateStep(currentStep);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onValidate={validateStep}
          />
        );
      case 2:
        return (
          <CertificateUploadForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 3:
        return (
          <BankAccountForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onValidate={validateStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProgressBreadcrumbs 
        currentStep={currentStep}
        totalSteps={totalSteps}
        wizardSteps={wizardSteps}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Registration Steps Progress */}
        <RegistrationSteps currentStep={currentStep} totalSteps={totalSteps} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Current Step Form */}
              {renderCurrentStep()}

              {/* Navigation Buttons */}
              <div className="bg-card border border-border rounded-lg p-6">
                <NavigationButtons
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onSubmit={handleSubmit}
                  isValid={isStepValid()}
                  isLoading={isLoading}
                  canProceed={true}
                />

                {/* Error Display */}
                {errors?.submit && (
                  <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertCircle" size={16} className="text-error" />
                      <span className="text-sm text-error">{errors?.submit}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Alternative Login */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    ¿Ya tiene una cuenta?
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/login-authentication')}
                    className="min-w-40"
                  >
                    <Icon name="LogIn" size={16} className="mr-2" />
                    Iniciar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RegistrationSidebar
              currentStep={currentStep}
              estimatedTime={getEstimatedTime()}
              completionPercentage={getCompletionPercentage()}
            />
          </div>
        </div>
      </div>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          isValid={isStepValid()}
          isLoading={isLoading}
          canProceed={true}
        />
      </div>
      {/* Mobile Spacing */}
      <div className="lg:hidden h-20" />
    </div>
  );
};

export default UserRegistration;