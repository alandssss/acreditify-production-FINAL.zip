import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ESignaturePanel = ({ onCertificateUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    certificate: null,
    privateKey: null
  });
  const [validationStatus, setValidationStatus] = useState({
    certificate: null,
    privateKey: null
  });

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file, type) => {
    const validExtensions = {
      certificate: ['.cer', '.crt'],
      privateKey: ['.key']
    };

    const fileName = file?.name?.toLowerCase();
    const isValidExtension = validExtensions?.[type]?.some(ext => fileName?.endsWith(ext));
    const isValidSize = file?.size <= 5 * 1024 * 1024; // 5MB limit

    return {
      isValid: isValidExtension && isValidSize,
      error: !isValidExtension ? 
        `Formato inválido. Use: ${validExtensions?.[type]?.join(', ')}` :
        !isValidSize ? 'Archivo muy grande (máx. 5MB)' : null
    };
  };

  const handleFileUpload = (files, type) => {
    const file = files?.[0];
    if (!file) return;

    const validation = validateFile(file, type);
    
    setUploadedFiles(prev => ({
      ...prev,
      [type]: file
    }));

    setValidationStatus(prev => ({
      ...prev,
      [type]: validation
    }));

    if (validation?.isValid) {
      onCertificateUpload?.(file, type);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);

    const files = Array.from(e?.dataTransfer?.files);
    const cerFile = files?.find(f => f?.name?.toLowerCase()?.endsWith('.cer') || f?.name?.toLowerCase()?.endsWith('.crt'));
    const keyFile = files?.find(f => f?.name?.toLowerCase()?.endsWith('.key'));

    if (cerFile) handleFileUpload([cerFile], 'certificate');
    if (keyFile) handleFileUpload([keyFile], 'privateKey');
  };

  const FileUploadArea = ({ type, label, accept, icon }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        } ${uploadedFiles?.[type] ? 'bg-success/5 border-success' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileUpload(e?.target?.files, type)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full mb-3 ${
            uploadedFiles?.[type] ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            <Icon name={uploadedFiles?.[type] ? "CheckCircle" : icon} size={24} />
          </div>
          
          {uploadedFiles?.[type] ? (
            <div>
              <p className="text-sm font-medium text-success">
                {uploadedFiles?.[type]?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {(uploadedFiles?.[type]?.size / 1024)?.toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-foreground mb-1">
                Arrastra tu archivo aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos: {accept} (máx. 5MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {validationStatus?.[type] && !validationStatus?.[type]?.isValid && (
        <div className="flex items-center space-x-2 text-error text-sm">
          <Icon name="AlertCircle" size={16} />
          <span>{validationStatus?.[type]?.error}</span>
        </div>
      )}

      {validationStatus?.[type] && validationStatus?.[type]?.isValid && (
        <div className="flex items-center space-x-2 text-success text-sm">
          <Icon name="CheckCircle" size={16} />
          <span>Archivo válido y listo para usar</span>
        </div>
      )}
    </div>
  );

  const isReadyToAuthenticate = uploadedFiles?.certificate && uploadedFiles?.privateKey &&
    validationStatus?.certificate?.isValid && validationStatus?.privateKey?.isValid;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Shield" size={32} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Autenticación con e.firma
        </h3>
        <p className="text-sm text-muted-foreground">
          Método recomendado para mayor seguridad y cumplimiento SAT
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUploadArea
          type="certificate"
          label="Certificado Digital (.cer)"
          accept=".cer,.crt"
          icon="FileText"
        />
        
        <FileUploadArea
          type="privateKey"
          label="Llave Privada (.key)"
          accept=".key"
          icon="Key"
        />
      </div>

      {isReadyToAuthenticate && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-success">
                Certificados validados correctamente
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Sus archivos de e.firma están listos para la autenticación
              </p>
            </div>
          </div>
        </div>
      )}

      <Button
        variant="outline"
        fullWidth
        disabled={!isReadyToAuthenticate}
        loading={isLoading}
        iconName="Shield"
        iconPosition="left"
      >
        Autenticar con e.firma
      </Button>
    </div>
  );
};

export default ESignaturePanel;