import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CertificateUploadForm = ({ formData, errors, onChange, onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationStatus, setValidationStatus] = useState('idle');

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileUpload(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.cer', '.key'];
    const fileExtension = file?.name?.toLowerCase()?.slice(file?.name?.lastIndexOf('.'));
    
    if (!allowedTypes?.includes(fileExtension)) {
      onChange('certificateError', 'Solo se permiten archivos .cer y .key');
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    setValidationStatus('uploading');
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setValidationStatus('processing');
          
          // Simulate validation
          setTimeout(() => {
            setValidationStatus('success');
            onChange('certificateFile', file);
            onChange('certificateValidated', true);
          }, 2000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    if (onFileUpload) {
      onFileUpload(file);
    }
  };

  const getValidationIcon = () => {
    switch (validationStatus) {
      case 'uploading':
        return 'Upload';
      case 'processing':
        return 'Loader';
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'AlertCircle';
      default:
        return 'FileText';
    }
  };

  const getValidationColor = () => {
    switch (validationStatus) {
      case 'uploading': case'processing':
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
          <span className="text-primary-foreground text-sm font-medium">2</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Certificado Digital</h3>
          <p className="text-sm text-muted-foreground">Suba su e.firma (FIEL) para validación automática</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Certificate Password */}
        <Input
          label="Contraseña del Certificado"
          type="password"
          placeholder="Ingrese la contraseña de su FIEL"
          value={formData?.certificatePassword}
          onChange={(e) => onChange('certificatePassword', e?.target?.value)}
          error={errors?.certificatePassword}
          description="Contraseña utilizada para proteger su certificado digital"
          required
        />

        {/* File Upload Area */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            Archivos del Certificado *
          </label>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept=".cer,.key"
              onChange={(e) => e?.target?.files?.[0] && handleFileUpload(e?.target?.files?.[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Icon name="Upload" size={24} className="text-muted-foreground" />
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground">
                  Arrastre sus archivos aquí o haga clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Archivos .cer y .key requeridos (máximo 5MB cada uno)
                </p>
              </div>
              
              <Button variant="outline" size="sm">
                <Icon name="FolderOpen" size={16} className="mr-2" />
                Seleccionar Archivos
              </Button>
            </div>
          </div>

          {errors?.certificateFile && (
            <p className="text-sm text-error">{errors?.certificateFile}</p>
          )}
        </div>

        {/* Upload Progress */}
        {(validationStatus === 'uploading' || validationStatus === 'processing') && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Icon 
                name={getValidationIcon()} 
                size={20} 
                className={`${getValidationColor()} ${validationStatus === 'processing' ? 'animate-spin' : ''}`} 
              />
              <span className="text-sm font-medium text-foreground">
                {validationStatus === 'uploading' ? 'Subiendo archivos...' : 'Validando certificado...'}
              </span>
            </div>
            
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              {uploadProgress}% completado
            </p>
          </div>
        )}

        {/* Validation Results */}
        {validationStatus === 'success' && formData?.certificateValidated && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">Certificado Validado</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Su e.firma ha sido validada exitosamente
                </p>
                
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RFC:</span>
                    <span className="font-medium text-foreground">{formData?.rfc || 'ABCD123456ABC'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Válido hasta:</span>
                    <span className="font-medium text-foreground">15/12/2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado:</span>
                    <span className="font-medium text-success">Activo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Information */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">¿Necesita ayuda con su e.firma?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Su e.firma (FIEL) es su certificado digital emitido por el SAT. Necesitará los archivos .cer y .key junto con su contraseña.
              </p>
              <Button variant="link" size="sm" className="mt-2 p-0 h-auto">
                <Icon name="ExternalLink" size={14} className="mr-1" />
                Obtener e.firma en SAT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateUploadForm;