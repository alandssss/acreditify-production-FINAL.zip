import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PackageGenerationCard = ({ packageData, onGeneratePackage, onDownloadPackage }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const handleGeneratePackage = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate package generation progress
    const progressSteps = [
      { step: 'Validando documentos...', progress: 20 },
      { step: 'Comprimiendo archivos...', progress: 40 },
      { step: 'Aplicando encriptación...', progress: 60 },
      { step: 'Generando checksums...', progress: 80 },
      { step: 'Finalizando paquete...', progress: 100 }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(step?.progress);
    }

    setIsGenerating(false);
    if (onGeneratePackage) {
      onGeneratePackage();
    }
  };

  const getPackageStatus = () => {
    if (isGenerating) return 'generating';
    if (packageData?.isGenerated) return 'ready';
    return 'pending';
  };

  const getStatusInfo = () => {
    const status = getPackageStatus();
    switch (status) {
      case 'generating':
        return {
          icon: 'Loader',
          color: 'text-primary',
          text: 'Generando paquete...',
          animate: true
        };
      case 'ready':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          text: 'Paquete listo para descarga',
          animate: false
        };
      default:
        return {
          icon: 'Package',
          color: 'text-muted-foreground',
          text: 'Listo para generar',
          animate: false
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon 
            name={statusInfo?.icon} 
            size={24} 
            className={`${statusInfo?.color} ${statusInfo?.animate ? 'animate-spin' : ''}`} 
          />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Paquete de Envío</h3>
            <p className="text-sm text-muted-foreground">{statusInfo?.text}</p>
          </div>
        </div>
        
        {packageData?.isGenerated && (
          <div className="flex items-center space-x-2 text-success">
            <Icon name="Shield" size={16} />
            <span className="text-sm font-medium">AES-256</span>
          </div>
        )}
      </div>
      {/* Generation Progress */}
      {isGenerating && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground">Progreso de generación</span>
            <span className="text-primary font-medium">{generationProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      )}
      {/* Package Information */}
      <div className="space-y-4">
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Información del Paquete</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nombre del archivo:</span>
              <span className="font-medium font-mono">{packageData?.filename}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tamaño estimado:</span>
              <span className="font-medium">{formatFileSize(packageData?.estimatedSize)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Archivos incluidos:</span>
              <span className="font-medium">{packageData?.fileCount} archivos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Formato:</span>
              <span className="font-medium">ZIP comprimido</span>
            </div>
          </div>
        </div>

        {/* Package Contents Preview */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Contenido del Paquete</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {packageData?.contents?.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="FileText" size={16} className="text-muted-foreground" />
                  <span className="font-medium">{file?.name}</span>
                </div>
                <span className="text-muted-foreground">{formatFileSize(file?.size)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={18} className="text-accent" />
            <h4 className="font-medium text-foreground">Seguridad y Encriptación</h4>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Encriptación AES-256 para protección de datos</p>
            <p>• Checksums MD5 para verificación de integridad</p>
            <p>• Compresión optimizada para límite de 4MB por archivo</p>
            <p>• Expiración automática después de 30 días</p>
          </div>
        </div>

        {/* Generation/Download Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {!packageData?.isGenerated ? (
            <Button
              variant="default"
              onClick={handleGeneratePackage}
              disabled={isGenerating}
              loading={isGenerating}
              className="flex-1"
            >
              <Icon name="Package" size={18} className="mr-2" />
              Generar Paquete ZIP
            </Button>
          ) : (
            <>
              <Button
                variant="default"
                onClick={onDownloadPackage}
                className="flex-1"
              >
                <Icon name="Download" size={18} className="mr-2" />
                Descargar Paquete
              </Button>
              <Button
                variant="outline"
                onClick={handleGeneratePackage}
                className="flex-1"
              >
                <Icon name="RefreshCw" size={18} className="mr-2" />
                Regenerar
              </Button>
            </>
          )}
        </div>

        {/* Package Details */}
        {packageData?.isGenerated && (
          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Generado:</span>
                <span className="font-medium">{formatDate(packageData?.generatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expira:</span>
                <span className="font-medium">{formatDate(packageData?.expiresAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Checksum:</span>
                <span className="font-medium font-mono text-xs">{packageData?.checksum}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versión:</span>
                <span className="font-medium">v{packageData?.version}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageGenerationCard;