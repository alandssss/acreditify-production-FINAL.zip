import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressBreadcrumbs from '../../components/ui/ProgressBreadcrumbs';
import ComplianceAlertBanner from '../../components/ui/ComplianceAlertBanner';
import DocumentStatusIndicator from '../../components/ui/DocumentStatusIndicator';
import QuickActionFloatingButton from '../../components/ui/QuickActionFloatingButton';
import ApplicationSummaryCard from './components/ApplicationSummaryCard';
import DocumentChecklistPanel from './components/DocumentChecklistPanel';
import PackageGenerationCard from './components/PackageGenerationCard';
import SATPortalGuide from './components/SATPortalGuide';
import BackupAndTrackingPanel from './components/BackupAndTrackingPanel';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const SubmissionPreparation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [isPackageGenerated, setIsPackageGenerated] = useState(false);
  const [isBackupCreated, setIsBackupCreated] = useState(false);
  const [complianceAlerts, setComplianceAlerts] = useState([]);

  // Mock data for application summary
  const applicationData = {
    internalReference: "DEV-2024-001234",
    preparationDate: new Date(),
    requestType: "Devolución de IVA - Persona Física",
    taxYear: "2023",
    refunds: {
      iva: 15750.00,
      isr: 8420.50,
      total: 24170.50
    },
    taxpayer: {
      rfc: "CURP123456789",
      name: "María Elena González Rodríguez",
      regime: "Régimen de Actividades Empresariales"
    },
    bankAccount: {
      clabe: "012345678901234567",
      bank: "BBVA México",
      holder: "María Elena González Rodríguez"
    }
  };

  // Mock data for documents
  const documents = [
    {
      id: 1,
      name: "Formulario F3241 (FED)",
      type: "PDF",
      category: "required",
      status: "completed",
      size: 2048576,
      lastModified: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      name: "Anexo de Deducciones",
      type: "PDF",
      category: "required",
      status: "completed",
      size: 1536000,
      lastModified: new Date(Date.now() - 7200000)
    },
    {
      id: 3,
      name: "Estados de Cuenta Bancarios",
      type: "PDF",
      category: "supporting",
      status: "completed",
      size: 3072000,
      lastModified: new Date(Date.now() - 1800000)
    },
    {
      id: 4,
      name: "CFDI de Ingresos",
      type: "XML/PDF",
      category: "supporting",
      status: "completed",
      size: 4096000,
      lastModified: new Date(Date.now() - 5400000)
    },
    {
      id: 5,
      name: "Comprobante de Domicilio",
      type: "PDF",
      category: "additional",
      status: "completed",
      size: 512000,
      lastModified: new Date(Date.now() - 10800000)
    },
    {
      id: 6,
      name: "Identificación Oficial",
      type: "PDF",
      category: "additional",
      status: "completed",
      size: 1024000,
      lastModified: new Date(Date.now() - 14400000)
    }
  ];

  // Mock data for package generation
  const packageData = {
    filename: "DEVOLUCION_CURP123456789_2024.zip",
    estimatedSize: 12288000,
    fileCount: 6,
    isGenerated: isPackageGenerated,
    contents: documents?.map(doc => ({
      name: doc?.name,
      size: doc?.size
    })),
    generatedAt: isPackageGenerated ? new Date() : null,
    expiresAt: isPackageGenerated ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
    checksum: isPackageGenerated ? "a1b2c3d4e5f6789012345678901234567890abcd" : null,
    version: "1.0"
  };

  // Mock data for SAT portal guide
  const guideSteps = [
    {
      title: "Acceso al Portal SAT",
      description: "Ingresa al portal oficial del SAT con tu RFC y contraseña",
      screenshot: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop",
      instructions: [
        { text: "Visita el sitio web oficial del SAT (sat.gob.mx)" },
        { text: "Haz clic en \'Portal de Trámites y Servicios'" },
        { text: "Ingresa tu RFC en el campo correspondiente" },
        { text: "Introduce tu contraseña o usa tu e.firma", highlight: "Asegúrate de tener tu e.firma actualizada" }
      ],
      fieldMapping: [
        { field: "RFC", value: applicationData?.taxpayer?.rfc },
        { field: "Tipo de Usuario", value: "Persona Física" }
      ],
      commonErrors: [
        "No verificar que el RFC esté activo",
        "Usar contraseña vencida",
        "No tener instalado Java para e.firma"
      ],
      tips: [
        "Mantén tu navegador actualizado",
        "Desactiva bloqueadores de ventanas emergentes",
        "Ten a la mano tu e.firma y contraseña"
      ]
    },
    {
      title: "Navegación a Devoluciones",
      description: "Localiza la sección de devoluciones en el menú principal",
      screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
      instructions: [
        { text: "En el menú principal, busca 'Devoluciones'" },
        { text: "Selecciona \'Solicitud de Devolución'" },
        { text: "Elige el tipo de devolución correspondiente" },
        { text: "Verifica que el ejercicio fiscal sea correcto" }
      ],
      fieldMapping: [
        { field: "Ejercicio Fiscal", value: applicationData?.taxYear },
        { field: "Tipo de Devolución", value: "IVA" }
      ],
      commonErrors: [
        "Seleccionar el ejercicio fiscal incorrecto",
        "Elegir el tipo de devolución equivocado"
      ],
      tips: [
        "Lee cuidadosamente cada opción antes de seleccionar",
        "Verifica que coincida con tu situación fiscal"
      ]
    },
    {
      title: "Carga de Documentos",
      description: "Sube los archivos del paquete ZIP generado",
      screenshot: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=450&fit=crop",
      instructions: [
        { text: "Haz clic en \'Cargar Documentos'" },
        { text: "Selecciona el archivo ZIP generado" },
        { text: "Espera a que se complete la carga", highlight: "No cierres la ventana durante la carga" },
        { text: "Verifica que todos los archivos se hayan subido correctamente" }
      ],
      fieldMapping: [
        { field: "Archivo Principal", value: packageData?.filename },
        { field: "Tamaño Total", value: "12.3 MB" }
      ],
      commonErrors: [
        "Subir archivos que excedan el límite de 4MB",
        "Usar formatos de archivo no permitidos",
        "Interrumpir la carga antes de completarse"
      ],
      tips: [
        "Verifica tu conexión a internet antes de subir",
        "Ten paciencia, la carga puede tomar varios minutos",
        "Guarda el comprobante de carga"
      ]
    },
    {
      title: "Revisión y Envío",
      description: "Revisa toda la información antes del envío final",
      screenshot: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop",
      instructions: [
        { text: "Revisa todos los datos capturados" },
        { text: "Verifica que los montos coincidan" },
        { text: "Confirma que todos los documentos estén presentes" },
        { text: "Haz clic en \'Enviar Solicitud'" }
      ],
      fieldMapping: [
        { field: "Monto Total", value: `$${applicationData?.refunds?.total?.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN` },
        { field: "Cuenta CLABE", value: applicationData?.bankAccount?.clabe }
      ],
      commonErrors: [
        "No revisar los datos antes de enviar",
        "Enviar con información bancaria incorrecta"
      ],
      tips: [
        "Imprime o guarda el acuse de recibo",
        "Anota el número de folio asignado",
        "Conserva todos los comprobantes"
      ]
    }
  ];

  // Mock data for backup and tracking
  const backupData = {
    estimatedSize: 15360000,
    isCreated: isBackupCreated,
    createdAt: isBackupCreated ? new Date() : null,
    expiresAt: isBackupCreated ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : null,
    backupId: isBackupCreated ? "BCK-2024-001234-ABCD" : null,
    version: "1.0"
  };

  const trackingData = {
    referenceNumber: "REF-2024-001234-SAT"
  };

  useEffect(() => {
    // Initialize compliance alerts
    const alerts = [
      {
        id: 'deadline-reminder',
        type: 'warning',
        title: 'Recordatorio de Vencimiento',
        message: 'Tienes 15 días restantes para enviar tu solicitud de devolución.',
        details: [
          'Fecha límite: 15 de enero de 2025',
          'Después de esta fecha deberás esperar al siguiente ejercicio fiscal'
        ],
        deadline: '15/01/2025',
        dismissible: true
      }
    ];
    setComplianceAlerts(alerts);
  }, []);

  const handleGeneratePackage = () => {
    setIsPackageGenerated(true);
  };

  const handleDownloadPackage = () => {
    // Simulate package download
    console.log('Downloading package...');
  };

  const handleCreateBackup = () => {
    setIsBackupCreated(true);
  };

  const handleSetupTracking = () => {
    navigate('/refund-status-tracking');
  };

  const handleDismissAlert = (alertId) => {
    setComplianceAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const handleFinalSubmission = () => {
    // Navigate to tracking page after submission
    navigate('/refund-status-tracking');
  };

  const tabs = [
    { id: 'summary', label: 'Resumen', icon: 'FileText' },
    { id: 'documents', label: 'Documentos', icon: 'FolderOpen' },
    { id: 'package', label: 'Paquete', icon: 'Package' },
    { id: 'guide', label: 'Guía SAT', icon: 'BookOpen' },
    { id: 'backup', label: 'Respaldo', icon: 'Cloud' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProgressBreadcrumbs />
      <ComplianceAlertBanner 
        alerts={complianceAlerts}
        isVisible={complianceAlerts?.length > 0}
        onDismiss={handleDismissAlert}
      />
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Preparación para Envío
            </h1>
            <p className="text-muted-foreground">
              Finaliza tu solicitud y prepara el envío al Portal SAT
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2 text-success">
              <Icon name="CheckCircle" size={20} />
              <span className="text-sm font-medium">Validación Completa</span>
            </div>
            <Button
              variant="default"
              onClick={handleFinalSubmission}
              disabled={!isPackageGenerated}
            >
              <Icon name="Send" size={18} className="mr-2" />
              Proceder al Envío
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <ApplicationSummaryCard applicationData={applicationData} />
              </div>
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Estado General</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Documentos</span>
                      <div className="flex items-center space-x-2">
                        <Icon name="CheckCircle" size={16} className="text-success" />
                        <span className="text-sm font-medium text-success">Completo</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Validación</span>
                      <div className="flex items-center space-x-2">
                        <Icon name="CheckCircle" size={16} className="text-success" />
                        <span className="text-sm font-medium text-success">Aprobado</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Paquete</span>
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={isPackageGenerated ? "CheckCircle" : "Clock"} 
                          size={16} 
                          className={isPackageGenerated ? "text-success" : "text-warning"} 
                        />
                        <span className={`text-sm font-medium ${isPackageGenerated ? "text-success" : "text-warning"}`}>
                          {isPackageGenerated ? "Listo" : "Pendiente"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Respaldo</span>
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={isBackupCreated ? "CheckCircle" : "Clock"} 
                          size={16} 
                          className={isBackupCreated ? "text-success" : "text-warning"} 
                        />
                        <span className={`text-sm font-medium ${isBackupCreated ? "text-success" : "text-warning"}`}>
                          {isBackupCreated ? "Creado" : "Pendiente"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Próximos Pasos</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        1
                      </div>
                      <p className="text-sm text-foreground">Generar paquete ZIP de envío</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        2
                      </div>
                      <p className="text-sm text-foreground">Crear respaldo seguro en la nube</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                      <p className="text-sm text-foreground">Seguir guía de envío al Portal SAT</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        4
                      </div>
                      <p className="text-sm text-foreground">Configurar seguimiento automático</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <DocumentChecklistPanel documents={documents} />
          )}

          {activeTab === 'package' && (
            <PackageGenerationCard 
              packageData={packageData}
              onGeneratePackage={handleGeneratePackage}
              onDownloadPackage={handleDownloadPackage}
            />
          )}

          {activeTab === 'guide' && (
            <SATPortalGuide guideSteps={guideSteps} />
          )}

          {activeTab === 'backup' && (
            <BackupAndTrackingPanel 
              backupData={backupData}
              trackingData={trackingData}
              onCreateBackup={handleCreateBackup}
              onSetupTracking={handleSetupTracking}
            />
          )}
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-border mt-12">
          <Button
            variant="outline"
            onClick={() => navigate('/compliance-verification')}
          >
            <Icon name="ChevronLeft" size={18} className="mr-2" />
            Volver a Verificación
          </Button>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Button
              variant="ghost"
              onClick={() => navigate('/document-upload-manager')}
            >
              Gestionar Documentos
            </Button>
            <Button
              variant="default"
              onClick={handleFinalSubmission}
              disabled={!isPackageGenerated}
            >
              Continuar al Seguimiento
              <Icon name="ChevronRight" size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <DocumentStatusIndicator 
        isVisible={true}
        validationStatus="success"
        successCount={documents?.filter(doc => doc?.status === 'completed')?.length}
        errorCount={documents?.filter(doc => doc?.status === 'error')?.length}
        totalDocuments={documents?.length}
      />
      <QuickActionFloatingButton isVisible={true} />
    </div>
  );
};

export default SubmissionPreparation;