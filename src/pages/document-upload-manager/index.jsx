import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ProgressBreadcrumbs from '../../components/ui/ProgressBreadcrumbs';
import DocumentStatusIndicator from '../../components/ui/DocumentStatusIndicator';
import ComplianceAlertBanner from '../../components/ui/ComplianceAlertBanner';
import QuickActionFloatingButton from '../../components/ui/QuickActionFloatingButton';
import DocumentUploadZone from './components/DocumentUploadZone';
import DocumentGrid from './components/DocumentGrid';
import DocumentFilterToolbar from './components/DocumentFilterToolbar';
import ValidationPanel from './components/ValidationPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DocumentUploadManager = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentView, setCurrentView] = useState('grid');
  const [validationResults, setValidationResults] = useState(null);
  const [showValidationPanel, setShowValidationPanel] = useState(false);

  // Mock data for demonstration
  const mockDocuments = [
    {
      id: 1,
      name: "CFDI_Factura_A001.pdf",
      type: "cfdi",
      size: 2048576,
      status: "validated",
      uploadDate: "26/09/2025",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      metadata: {
        rfc: "XAXX010101000",
        amount: "15,840.00",
        date: "25/09/2025"
      },
      ocrConfidence: 95,
      errors: []
    },
    {
      id: 2,
      name: "Estado_Cuenta_Septiembre.pdf",
      type: "bank_statement",
      size: 3145728,
      status: "processing",
      uploadDate: "26/09/2025",
      thumbnail: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?w=400&h=300&fit=crop",
      metadata: {
        account: "****1234",
        period: "Sep 2025"
      },
      ocrConfidence: 88,
      errors: []
    },
    {
      id: 3,
      name: "DIOT_Septiembre_2025.xml",
      type: "diot",
      size: 512000,
      status: "error",
      uploadDate: "26/09/2025",
      metadata: {
        period: "09/2025",
        operations: 45
      },
      ocrConfidence: 72,
      errors: [
        "RFC del proveedor no válido en línea 12",
        "Monto de IVA no coincide con el cálculo automático",
        "Fecha fuera del período declarado"
      ]
    },
    {
      id: 4,
      name: "Recibo_Nomina_Sep2025.pdf",
      type: "other",
      size: 1024000,
      status: "pending",
      uploadDate: "26/09/2025",
      thumbnail: "https://images.pixabay.com/photo/2017/09/07/08/54/money-2724241_1280.jpg?w=400&h=300&fit=crop",
      metadata: {
        employee: "Juan Pérez",
        period: "Sep 2025",
        amount: "25,000.00"
      },
      ocrConfidence: 91,
      errors: []
    }
  ];

  const mockValidationResults = {
    summary: {
      validated: 1,
      errors: 1,
      warnings: 1,
      total: 4
    },
    riskPrediction: {
      score: 35,
      factors: ["RFC inconsistente", "Montos no validados"]
    },
    errors: [
      {
        title: "RFC de Proveedor Inválido",
        description: "El RFC 'XAXX010101001' en el documento DIOT no cumple con el formato válido del SAT.",
        affectedDocuments: ["DIOT_Septiembre_2025.xml"],
        solution: "Verificar el RFC en el padrón de contribuyentes del SAT y corregir el formato.",
        actionable: true
      }
    ],
    warnings: [
      {
        title: "Confianza OCR Baja",
        description: "El documento 'DIOT_Septiembre_2025.xml' tiene una confianza OCR del 72%, lo que puede indicar problemas de legibilidad.",
        recommendation: "Revisar manualmente los datos extraídos y considerar volver a escanear con mejor calidad."
      }
    ],
    suggestions: [
      {
        title: "Optimizar Calidad de Escaneo",
        description: "Algunos documentos podrían beneficiarse de una mayor resolución de escaneo.",
        benefit: "Mejora la precisión del OCR y reduce errores de validación."
      }
    ]
  };

  const complianceAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Documentos Pendientes de Validación',
      message: 'Tienes 2 documentos que requieren validación antes de continuar con tu solicitud de devolución.',
      details: [
        'Estado de cuenta bancario en proceso',
        'Recibo de nómina pendiente de revisión'
      ],
      actionLabel: 'Validar Ahora',
      actionUrl: '#validate',
      dismissible: true
    },
    {
      id: 2,
      type: 'regulatory',
      title: 'Actualización Normativa SAT',
      message: 'Nuevos requisitos para documentos CFDI vigentes desde octubre 2025.',
      deadline: '31/10/2025',
      actionLabel: 'Ver Detalles',
      actionUrl: '#regulatory-update',
      dismissible: false
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
    setValidationResults(mockValidationResults);
  }, []);

  const handleFilesUploaded = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    // Add new documents to the list
    const newDocuments = files?.map((file, index) => ({
      id: documents?.length + index + 1,
      name: file?.name,
      type: file?.type?.includes('pdf') ? 'cfdi' : file?.type?.includes('xml') ? 'diot' : 'other',
      size: file?.size,
      status: 'processing',
      uploadDate: new Date()?.toLocaleDateString('es-MX'),
      metadata: {},
      ocrConfidence: 0,
      errors: []
    }));

    const updatedDocuments = [...documents, ...newDocuments];
    setDocuments(updatedDocuments);
    setFilteredDocuments(updatedDocuments);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleFilterChange = (filters) => {
    let filtered = [...documents];

    if (filters?.searchTerm) {
      filtered = filtered?.filter(doc => 
        doc?.name?.toLowerCase()?.includes(filters?.searchTerm?.toLowerCase())
      );
    }

    if (filters?.type) {
      filtered = filtered?.filter(doc => doc?.type === filters?.type);
    }

    if (filters?.status) {
      filtered = filtered?.filter(doc => doc?.status === filters?.status);
    }

    setFilteredDocuments(filtered);
  };

  const handleDocumentAction = (action, document) => {
    switch (action) {
      case 'preview': console.log('Preview document:', document);
        break;
      case 'rescan': console.log('Rescan document:', document);
        break;
      case 'edit': console.log('Edit document:', document);
        break;
      case 'delete':
        if (Array.isArray(document)) {
          // Bulk delete
          const idsToDelete = document?.map(doc => doc?.id);
          const updatedDocuments = documents?.filter(doc => !idsToDelete?.includes(doc?.id));
          setDocuments(updatedDocuments);
          setFilteredDocuments(updatedDocuments);
        } else {
          // Single delete
          const updatedDocuments = documents?.filter(doc => doc?.id !== document?.id);
          setDocuments(updatedDocuments);
          setFilteredDocuments(updatedDocuments);
        }
        break;
      case 'validate': console.log('Validate documents:', document);
        setShowValidationPanel(true);
        break;
      case 'compress': console.log('Compress documents:', document);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleValidationAction = (action, data) => {
    switch (action) {
      case 'revalidate': console.log('Revalidating all documents');
        break;
      case 'fix': console.log('Auto-fix error:', data);
        break;
      default:
        console.log('Validation action:', action, data);
    }
  };

  const getDocumentStats = () => {
    const stats = {
      total: documents?.length,
      validated: documents?.filter(doc => doc?.status === 'validated')?.length,
      errors: documents?.filter(doc => doc?.status === 'error')?.length,
      processing: documents?.filter(doc => doc?.status === 'processing')?.length
    };
    return stats;
  };

  const stats = getDocumentStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProgressBreadcrumbs />
      <ComplianceAlertBanner 
        alerts={complianceAlerts}
        isVisible={true}
        onDismiss={(alertId) => console.log('Dismissed alert:', alertId)}
      />
      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Gestor de Documentos
              </h1>
              <p className="text-muted-foreground">
                Sube, valida y organiza tus documentos fiscales para solicitudes de devolución
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowValidationPanel(!showValidationPanel)}
              >
                <Icon name="Shield" size={18} className="mr-2" />
                {showValidationPanel ? 'Ocultar' : 'Mostrar'} Validación
              </Button>
              
              <Button variant="default">
                <Icon name="Download" size={18} className="mr-2" />
                Generar ZIP
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stats?.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">{stats?.validated}</div>
                  <div className="text-sm text-muted-foreground">Validados</div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Loader" size={20} className="text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">{stats?.processing}</div>
                  <div className="text-sm text-muted-foreground">Procesando</div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertCircle" size={20} className="text-error" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-error">{stats?.errors}</div>
                  <div className="text-sm text-muted-foreground">Con Errores</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className={`${showValidationPanel ? 'xl:col-span-2' : 'xl:col-span-3'} space-y-6`}>
            {/* Upload Zone */}
            <DocumentUploadZone
              onFilesUploaded={handleFilesUploaded}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />

            {/* Filter Toolbar */}
            <DocumentFilterToolbar
              onFilterChange={handleFilterChange}
              totalDocuments={documents?.length}
              filteredCount={filteredDocuments?.length}
              onViewChange={setCurrentView}
              currentView={currentView}
            />

            {/* Document Grid */}
            <DocumentGrid
              documents={filteredDocuments}
              onDocumentAction={handleDocumentAction}
            />
          </div>

          {/* Validation Panel */}
          {showValidationPanel && (
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <ValidationPanel
                  validationResults={validationResults}
                  onValidationAction={handleValidationAction}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <DocumentStatusIndicator
        isVisible={isUploading || stats?.processing > 0}
        uploadProgress={uploadProgress}
        validationStatus={isUploading ? 'uploading' : stats?.processing > 0 ? 'processing' : 'idle'}
        errorCount={stats?.errors}
        successCount={stats?.validated}
        totalDocuments={stats?.total}
      />
      <QuickActionFloatingButton isVisible={true} />
    </div>
  );
};

export default DocumentUploadManager;