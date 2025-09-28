import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BackupAndTrackingPanel = ({ backupData, trackingData, onCreateBackup, onSetupTracking }) => {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);

    // Simulate backup creation progress
    const progressSteps = [
      { step: 'Preparando archivos...', progress: 20 },
      { step: 'Encriptando datos...', progress: 40 },
      { step: 'Subiendo a la nube...', progress: 70 },
      { step: 'Verificando integridad...', progress: 90 },
      { step: 'Finalizando respaldo...', progress: 100 }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBackupProgress(step?.progress);
    }

    setIsCreatingBackup(false);
    if (onCreateBackup) {
      onCreateBackup();
    }
  };

  const getBackupStatus = () => {
    if (isCreatingBackup) return 'creating';
    if (backupData?.isCreated) return 'ready';
    return 'pending';
  };

  const getBackupStatusInfo = () => {
    const status = getBackupStatus();
    switch (status) {
      case 'creating':
        return {
          icon: 'Loader',
          color: 'text-primary',
          text: 'Creando respaldo...',
          animate: true
        };
      case 'ready':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          text: 'Respaldo creado exitosamente',
          animate: false
        };
      default:
        return {
          icon: 'Cloud',
          color: 'text-muted-foreground',
          text: 'Listo para crear respaldo',
          animate: false
        };
    }
  };

  const backupStatusInfo = getBackupStatusInfo();

  return (
    <div className="space-y-6">
      {/* Backup Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Icon 
              name={backupStatusInfo?.icon} 
              size={24} 
              className={`${backupStatusInfo?.color} ${backupStatusInfo?.animate ? 'animate-spin' : ''}`} 
            />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Respaldo Seguro</h3>
              <p className="text-sm text-muted-foreground">{backupStatusInfo?.text}</p>
            </div>
          </div>
          
          {backupData?.isCreated && (
            <div className="flex items-center space-x-2 text-success">
              <Icon name="Shield" size={16} />
              <span className="text-sm font-medium">Encriptado</span>
            </div>
          )}
        </div>

        {/* Backup Progress */}
        {isCreatingBackup && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-foreground">Progreso del respaldo</span>
              <span className="text-primary font-medium">{backupProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${backupProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Backup Information */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Información del Respaldo</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ubicación:</span>
                <span className="font-medium">Almacenamiento en la nube</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Encriptación:</span>
                <span className="font-medium">AES-256</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Retención:</span>
                <span className="font-medium">90 días</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tamaño estimado:</span>
                <span className="font-medium">{formatFileSize(backupData?.estimatedSize)}</span>
              </div>
            </div>
          </div>

          {backupData?.isCreated && (
            <div className="bg-success/5 border border-success/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Detalles del Respaldo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Creado:</span>
                  <span className="font-medium">{formatDate(backupData?.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expira:</span>
                  <span className="font-medium">{formatDate(backupData?.expiresAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID de Respaldo:</span>
                  <span className="font-medium font-mono text-xs">{backupData?.backupId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Versión:</span>
                  <span className="font-medium">v{backupData?.version}</span>
                </div>
              </div>
            </div>
          )}

          {/* Backup Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!backupData?.isCreated ? (
              <Button
                variant="default"
                onClick={handleCreateBackup}
                disabled={isCreatingBackup}
                loading={isCreatingBackup}
                className="flex-1"
              >
                <Icon name="Cloud" size={18} className="mr-2" />
                Crear Respaldo
              </Button>
            ) : (
              <>
                <Button variant="outline" className="flex-1">
                  <Icon name="Download" size={18} className="mr-2" />
                  Descargar Respaldo
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCreateBackup}
                  className="flex-1"
                >
                  <Icon name="RefreshCw" size={18} className="mr-2" />
                  Actualizar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Tracking Setup Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Icon name="Search" size={24} className="text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Configuración de Seguimiento</h3>
              <p className="text-sm text-muted-foreground">Preparar monitoreo de estado</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Tracking Reference */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Número de Referencia</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-mono font-bold text-primary">{trackingData?.referenceNumber}</p>
                <p className="text-sm text-muted-foreground">Guarda este número para seguimiento</p>
              </div>
              <Button variant="ghost" size="sm">
                <Icon name="Copy" size={16} />
              </Button>
            </div>
          </div>

          {/* Tracking Configuration */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Configuración de Monitoreo</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Notificaciones por Email</p>
                  <p className="text-xs text-muted-foreground">Recibir actualizaciones de estado</p>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-all"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Notificaciones SMS</p>
                  <p className="text-xs text-muted-foreground">Alertas importantes por mensaje</p>
                </div>
                <div className="w-10 h-6 bg-muted rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-all"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Verificación Automática</p>
                  <p className="text-xs text-muted-foreground">Consultar estado cada 24 horas</p>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-all"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Expected Timeline */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="Clock" size={18} className="mr-2 text-accent" />
              Cronograma Esperado
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recepción SAT:</span>
                <span className="font-medium">1-2 días hábiles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Validación inicial:</span>
                <span className="font-medium">3-5 días hábiles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revisión completa:</span>
                <span className="font-medium">15-30 días hábiles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolución final:</span>
                <span className="font-medium">30-60 días hábiles</span>
              </div>
            </div>
          </div>

          {/* Setup Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={onSetupTracking}
              className="flex-1"
            >
              <Icon name="Settings" size={18} className="mr-2" />
              Configurar Seguimiento
            </Button>
            <Button variant="outline" className="flex-1">
              <Icon name="Bell" size={18} className="mr-2" />
              Configurar Alertas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupAndTrackingPanel;