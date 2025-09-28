import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentUploadZone = ({ onFilesUploaded, isUploading, uploadProgress }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    const validFiles = files?.filter(file => {
      const validTypes = ['application/pdf', 'application/xml', 'text/xml', 'image/jpeg', 'image/jpg'];
      const maxSize = 4 * 1024 * 1024; // 4MB
      return validTypes?.includes(file?.type) && file?.size <= maxSize;
    });

    if (validFiles?.length > 0) {
      onFilesUploaded(validFiles);
    }
  }, [onFilesUploaded]);

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    const validFiles = files?.filter(file => {
      const validTypes = ['application/pdf', 'application/xml', 'text/xml', 'image/jpeg', 'image/jpg'];
      const maxSize = 4 * 1024 * 1024; // 4MB
      return validTypes?.includes(file?.type) && file?.size <= maxSize;
    });

    if (validFiles?.length > 0) {
      onFilesUploaded(validFiles);
    }
  };

  return (
    <div className="bg-card rounded-lg border-2 border-dashed border-border p-8">
      <div
        className={`relative transition-all duration-200 ${
          isDragOver ? 'border-primary bg-primary/5' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Icon name="Upload" size={32} className="text-primary" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Subir Documentos Fiscales
          </h3>
          
          <p className="text-muted-foreground mb-6">
            Arrastra y suelta tus archivos aquí o haz clic para seleccionar
          </p>

          <div className="space-y-4">
            <Button
              variant="default"
              size="lg"
              disabled={isUploading}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Icon name="FolderOpen" size={20} className="mr-2" />
              Seleccionar Archivos
            </Button>

            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.xml,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isUploading && (
              <div className="w-full max-w-md mx-auto">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Subiendo archivos...</span>
                  <span className="text-primary font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Icon name="FileText" size={16} className="text-success" />
                <span className="text-muted-foreground">PDF, XML, JPG</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Icon name="HardDrive" size={16} className="text-warning" />
                <span className="text-muted-foreground">Máx. 4MB por archivo</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Shield" size={16} className="text-accent" />
                <span className="text-muted-foreground">Validación automática</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadZone;