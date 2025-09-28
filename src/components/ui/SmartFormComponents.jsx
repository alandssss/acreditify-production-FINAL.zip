import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const SmartFileUploadZone = ({ 
  onFilesUploaded, 
  acceptedTypes = ['.pdf', '.xml', '.jpg', '.png'], 
  maxFileSize = 4 * 1024 * 1024, // 4MB
  multiple = true,
  title = "Arrastra y suelta tus documentos aquí",
  subtitle = "o haz clic para seleccionar archivos",
  validationTips = []
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleDrop = async (e) => {
    e?.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e?.dataTransfer?.files || []);
    await processFiles(files);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e?.target?.files || []);
    await processFiles(files);
  };

  const processFiles = async (files) => {
    const validatedFiles = [];
    const fileErrors = [];

    files?.forEach(file => {
      const fileExtension = '.' + file?.name?.split('.')?.pop()?.toLowerCase();
      
      if (!acceptedTypes?.includes(fileExtension)) {
        fileErrors?.push(`${file?.name}: Tipo de archivo no válido. Solo se aceptan: ${acceptedTypes?.join(', ')}`);
        return;
      }

      if (file?.size > maxFileSize) {
        fileErrors?.push(`${file?.name}: El archivo es demasiado grande. Máximo ${(maxFileSize / 1024 / 1024)?.toFixed(1)}MB`);
        return;
      }

      validatedFiles?.push(file);
    });

    setErrors(fileErrors);

    if (validatedFiles?.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      onFilesUploaded?.(validatedFiles);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragActive
            ? 'border-primary bg-primary/5' :'border-muted-foreground hover:border-primary hover:bg-muted/5'
        }`}
        onDragOver={(e) => {
          e?.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-4">
            <Icon name="Loader" size={32} className="mx-auto text-primary animate-spin" />
            <div>
              <p className="text-sm font-medium text-foreground">Subiendo archivos...</p>
              <div className="w-full bg-muted rounded-full h-2 mt-2 max-w-xs mx-auto">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <>
            <Icon 
              name={isDragActive ? "Download" : "Upload"} 
              size={48} 
              className={`mx-auto mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`}
            />
            <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4">{subtitle}</p>
            
            <Button variant="outline" size="lg" className="mb-4">
              <Icon name="FolderOpen" size={16} className="mr-2" />
              Seleccionar Archivos
              <input
                type="file"
                multiple={multiple}
                accept={acceptedTypes?.join(',')}
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>

            <div className="text-xs text-muted-foreground">
              <p>Formatos aceptados: {acceptedTypes?.join(', ')}</p>
              <p>Tamaño máximo: {(maxFileSize / 1024 / 1024)?.toFixed(1)}MB por archivo</p>
            </div>
          </>
        )}
      </div>
      {/* Validation Tips */}
      {validationTips?.length > 0 && (
        <div className="bg-muted/5 border border-muted/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Consejos para mejores resultados:
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {validationTips?.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Error Messages */}
      {errors?.length > 0 && (
        <div className="space-y-2">
          {errors?.map((error, index) => (
            <div key={index} className="bg-error/5 border border-error/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                <p className="text-sm text-error">{error}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SmartInputField = ({ 
  label, 
  placeholder, 
  helperText, 
  errorMessage, 
  validationRules = [], 
  suggestions = [],
  formatType = 'text', // 'rfc', 'curp', 'currency', 'percentage', 'date'
  value = '',
  onChange,
  ...props 
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const formatters = {
    rfc: (val) => val?.toUpperCase()?.replace(/[^A-Z0-9]/g, '')?.slice(0, 13),
    curp: (val) => val?.toUpperCase()?.replace(/[^A-Z0-9]/g, '')?.slice(0, 18),
    currency: (val) => val?.replace(/[^\d.,]/g, ''),
    percentage: (val) => val?.replace(/[^\d.]/g, ''),
    date: (val) => val?.replace(/[^\d/]/g, '')
  };

  const validators = {
    rfc: (val) => {
      if (val?.length < 12 || val?.length > 13) return 'RFC debe tener 12 o 13 caracteres';
      if (!/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/?.test(val)) return 'Formato de RFC inválido';
      return '';
    },
    curp: (val) => {
      if (val?.length !== 18) return 'CURP debe tener 18 caracteres';
      if (!/^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/?.test(val)) {
        return 'Formato de CURP inválido';
      }
      return '';
    }
  };

  const handleInputChange = (e) => {
    let newValue = e?.target?.value;

    // Apply formatting
    if (formatters?.[formatType]) {
      newValue = formatters?.[formatType](newValue);
    }

    setInputValue(newValue);

    // Validate
    let isFieldValid = true;
    let message = '';

    if (validators?.[formatType]) {
      message = validators?.[formatType](newValue);
      isFieldValid = !message;
    }

    // Apply custom validation rules
    validationRules?.forEach(rule => {
      if (!rule?.validator(newValue)) {
        isFieldValid = false;
        message = rule?.message;
      }
    });

    setIsValid(isFieldValid);
    setValidationMessage(message);
    onChange?.(newValue, isFieldValid);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    onChange?.(suggestion, true);
  };

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-medium text-foreground block">
        {label}
        {props?.required && <span className="text-error ml-1">*</span>}
      </label>
      
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`${!isValid ? 'border-error focus:ring-error' : ''}`}
          onFocus={() => setShowSuggestions(suggestions?.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          {...props}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isValid && inputValue ? (
            <Icon name="CheckCircle" size={16} className="text-success" />
          ) : !isValid && inputValue ? (
            <Icon name="AlertCircle" size={16} className="text-error" />
          ) : null}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions?.length > 0 && (
        <div className="absolute z-10 w-full bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {suggestions?.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {helperText && isValid && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}

      {/* Validation Message */}
      {!isValid && validationMessage && (
        <p className="text-xs text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={12} />
          <span>{validationMessage}</span>
        </p>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="text-xs text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={12} />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
};

const ProgressSavingIndicator = ({ 
  isVisible, 
  progress = 0, 
  status = 'saving', // 'saving', 'saved', 'error'
  lastSaved,
  onRetry
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-card border border-border rounded-lg shadow-lg p-3 z-40">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {status === 'saving' && (
            <Icon name="Loader" size={16} className="text-primary animate-spin" />
          )}
          {status === 'saved' && (
            <Icon name="CheckCircle" size={16} className="text-success" />
          )}
          {status === 'error' && (
            <Icon name="AlertCircle" size={16} className="text-error" />
          )}
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {status === 'saving' && 'Guardando progreso...'}
            {status === 'saved' && 'Guardado automáticamente'}
            {status === 'error' && 'Error al guardar'}
          </p>
          {lastSaved && status === 'saved' && (
            <p className="text-xs text-muted-foreground">
              Última actualización: {lastSaved}
            </p>
          )}
          {status === 'saving' && (
            <div className="w-32 bg-muted rounded-full h-1 mt-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {status === 'error' && onRetry && (
          <Button variant="ghost" size="xs" onClick={onRetry}>
            <Icon name="RefreshCw" size={12} />
          </Button>
        )}
      </div>
    </div>
  );
};

const SmartFormComponents = {
  SmartFileUploadZone,
  SmartInputField,
  ProgressSavingIndicator
};

export default SmartFormComponents;