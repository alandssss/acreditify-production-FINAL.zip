import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ProgressBreadcrumbs from '../../components/ui/ProgressBreadcrumbs';
import ComplianceAlertBanner from '../../components/ui/ComplianceAlertBanner';
import DocumentStatusIndicator from '../../components/ui/DocumentStatusIndicator';
import QuickActionFloatingButton from '../../components/ui/QuickActionFloatingButton';
import ValidationStatusCard from './components/ValidationStatusCard';
import ComplianceRulesList from './components/ComplianceRulesList';
import RiskAssessmentPanel from './components/RiskAssessmentPanel';
import DocumentCrossReference from './components/DocumentCrossReference';
import CalculationVerification from './components/CalculationVerification';
import ComplianceChecklist from './components/ComplianceChecklist';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ComplianceVerification = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [validationResults, setValidationResults] = useState({});
  const [completedChecklist, setCompletedChecklist] = useState([]);
  const [showAlerts, setShowAlerts] = useState(true);

  // Mock data for validation overview
  const validationOverview = [
    {
      id: 'documents',
      title: 'Documentos',
      status: 'success',
      count: 12,
      totalCount: 12,
      description: 'Todos los documentos han sido validados correctamente',
      icon: 'FileText'
    },
    {
      id: 'calculations',
      title: 'Cálculos',
      status: 'warning',
      count: 3,
      totalCount: 4,
      description: 'Se encontraron inconsistencias menores en los cálculos',
      icon: 'Calculator'
    },
    {
      id: 'regulations',
      title: 'Normativa',
      status: 'error',
      count: 2,
      totalCount: 8,
      description: 'Faltan requisitos normativos obligatorios',
      icon: 'Shield'
    },
    {
      id: 'crossref',
      title: 'Referencias',
      status: 'processing',
      count: 0,
      totalCount: 5,
      description: 'Verificando referencias cruzadas con SAT',
      icon: 'Link'
    }
  ];

  // Mock compliance alerts
  const complianceAlerts = [
    {
      id: 'alert-1',
      type: 'error',
      title: 'Documento CFDI Faltante',
      message: 'Se requiere el CFDI correspondiente al periodo fiscal 2024-Q1 para completar la solicitud.',
      details: [
        'UUID requerido: A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
        'Fecha de emisión: Entre 01/01/2024 y 31/03/2024',
        'RFC Emisor debe coincidir con el declarado'
      ],
      deadline: '15/10/2024',
      actionLabel: 'Subir Documento',
      actionUrl: '/document-upload-manager'
    },
    {
      id: 'alert-2',
      type: 'warning',
      title: 'Inconsistencia en Cálculo de IVA',
      message: 'El monto de IVA calculado no coincide con los documentos presentados.',
      details: [
        'Diferencia encontrada: $2,450.00 MXN',
        'Revisar facturas del periodo marzo 2024',
        'Verificar tasa de IVA aplicada (16%)'
      ],
      actionLabel: 'Revisar Cálculos',
      actionUrl: '#calculations'
    },
    {
      id: 'alert-3',
      type: 'regulatory',
      title: 'Actualización Normativa',
      message: 'Nueva resolución miscelánea fiscal afecta los requisitos de documentación.',
      details: [
        'RMF 2024-B publicada el 20/09/2024',
        'Nuevos campos obligatorios en anexos',
        'Plazo de adaptación: 30 días'
      ],
      deadline: '20/10/2024',
      dismissible: false
    }
  ];

  // Mock compliance rules by category
  const complianceRules = {
    documents: [
      {
        id: 'doc-1',
        title: 'Completitud de Documentos CFDI',
        description: 'Verificar que todos los CFDI requeridos estén presentes',
        status: 'failed',
        details: 'Faltan 2 CFDI del periodo Q1 2024',
        solution: 'Subir los CFDI faltantes con UUID válidos',
        regulation: 'Art. 29-A CFF, Regla 2.7.1.26 RMF',
        affectedDocuments: ['CFDI-001.xml', 'CFDI-002.xml']
      },
      {
        id: 'doc-2',
        title: 'Formato de Archivos',
        description: 'Validar que los archivos cumplan con el formato requerido',
        status: 'passed',
        details: 'Todos los archivos están en formato PDF/XML válido',
        regulation: 'Anexo 20 RMF'
      }
    ],
    calculations: [
      {
        id: 'calc-1',
        title: 'Cálculo de IVA Acreditable',
        description: 'Verificar correcta aplicación de tasas de IVA',
        status: 'warning',
        details: 'Diferencia de $2,450.00 MXN en el cálculo',
        solution: 'Revisar facturas y aplicar tasa correcta del 16%',
        regulation: 'Art. 5 LIVA'
      }
    ],
    regulations: [
      {
        id: 'reg-1',
        title: 'Requisitos de Identificación',
        description: 'Validar datos de identificación del contribuyente',
        status: 'failed',
        details: 'RFC no coincide con el registrado en SAT',
        solution: 'Actualizar RFC en el sistema SAT',
        regulation: 'Art. 27 CFF'
      }
    ]
  };

  // Mock risk assessment data
  const riskAssessment = {
    riskScore: 65,
    factors: [
      {
        title: 'Documentos Faltantes',
        description: 'Faltan 2 CFDI requeridos para el periodo',
        impact: 'high',
        riskIncrease: 25
      },
      {
        title: 'Inconsistencias en Cálculos',
        description: 'Diferencias menores en cálculos de IVA',
        impact: 'medium',
        riskIncrease: 15
      },
      {
        title: 'Historial de Solicitudes',
        description: 'Primera solicitud del contribuyente',
        impact: 'low',
        riskIncrease: 5
      }
    ],
    recommendations: [
      {
        title: 'Completar Documentación',
        description: 'Subir los CFDI faltantes antes del envío',
        potentialReduction: 25
      },
      {
        title: 'Revisar Cálculos',
        description: 'Corregir las inconsistencias en los montos de IVA',
        potentialReduction: 15
      },
      {
        title: 'Verificar Datos',
        description: 'Confirmar que todos los datos coincidan con registros SAT',
        potentialReduction: 10
      }
    ]
  };

  // Mock documents for cross-reference
  const documentsForVerification = [
    {
      id: 'cfdi-1',
      name: 'Factura Servicios Profesionales',
      type: 'CFDI Ingreso',
      uuid: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
      rfcEmisor: 'ABC123456789'
    },
    {
      id: 'cfdi-2',
      name: 'Comprobante de Retenciones',
      type: 'CFDI Retenciones',
      uuid: 'B2C3D4E5-F6G7-8901-BCDE-F23456789012',
      rfcEmisor: 'DEF987654321'
    },
    {
      id: 'bank-1',
      name: 'Estado de Cuenta Marzo',
      type: 'Estado Bancario',
      uuid: 'N/A',
      rfcEmisor: 'BANCO001'
    }
  ];

  const crossReferences = [
    {
      documentId: 'cfdi-1',
      description: 'UUID válido en SAT',
      status: 'match'
    },
    {
      documentId: 'cfdi-1',
      description: 'RFC emisor verificado',
      status: 'match'
    },
    {
      documentId: 'cfdi-2',
      description: 'Monto coincide con declaración',
      status: 'mismatch'
    }
  ];

  // Mock calculation data
  const calculationData = [
    {
      id: 'iva-calc',
      type: 'IVA Acreditable',
      description: 'Cálculo del IVA acreditable del periodo',
      amount: 45600.00,
      verified: false,
      hasWarnings: true,
      breakdown: [
        { label: 'IVA Trasladado', value: 48000.00 },
        { label: 'IVA No Acreditable', value: -2400.00 },
        { label: 'IVA Acreditable', value: 45600.00 }
      ],
      parameters: [
        { name: 'Tasa IVA', value: '16%' },
        { name: 'Periodo', value: 'Q1 2024' },
        { name: 'Régimen', value: 'General' }
      ],
      formula: 'IVA_Acreditable = IVA_Trasladado - IVA_No_Acreditable',
      validationResults: [
        { status: 'pass', message: 'Tasa de IVA correcta (16%)' },
        { status: 'warning', message: 'Diferencia menor en documentos soporte' }
      ]
    },
    {
      id: 'isr-calc',
      type: 'ISR por Retener',
      description: 'Cálculo del ISR por actividades profesionales',
      amount: 18240.00,
      verified: true,
      hasErrors: false,
      breakdown: [
        { label: 'Ingresos Gravados', value: 152000.00 },
        { label: 'Deducciones', value: -32000.00 },
        { label: 'Base Gravable', value: 120000.00 },
        { label: 'ISR (30%)', value: 36000.00 },
        { label: 'Retenciones', value: -17760.00 },
        { label: 'ISR por Retener', value: 18240.00 }
      ],
      parameters: [
        { name: 'Tasa ISR', value: '30%' },
        { name: 'Actividad', value: 'Profesional' },
        { name: 'Retención', value: '10.67%' }
      ],
      formula: 'ISR = (Ingresos - Deducciones) * Tasa - Retenciones',
      validationResults: [
        { status: 'pass', message: 'Cálculo correcto según tarifas vigentes' },
        { status: 'pass', message: 'Retenciones aplicadas correctamente' }
      ]
    }
  ];

  const deductionsData = [
    {
      concept: 'Gastos de Oficina',
      description: 'Papelería, suministros y materiales',
      amount: 12500.00,
      percentage: 100,
      valid: true
    },
    {
      concept: 'Servicios Profesionales',
      description: 'Honorarios de consultoría externa',
      amount: 8900.00,
      percentage: 100,
      valid: true
    },
    {
      concept: 'Gastos de Representación',
      description: 'Comidas de negocios y eventos',
      amount: 4200.00,
      percentage: 50,
      valid: true,
      hasIssues: true
    },
    {
      concept: 'Combustible Personal',
      description: 'Gasolina para vehículo personal',
      amount: 3100.00,
      percentage: 0,
      valid: false
    }
  ];

  // Mock checklist data
  const checklistItems = [
    {
      id: 'req-1',
      category: 'required',
      title: 'CFDI de Ingresos Completos',
      description: 'Todos los CFDI de ingresos del periodo fiscal',
      priority: 'high',
      regulation: 'Art. 29-A CFF'
    },
    {
      id: 'req-2',
      category: 'required',
      title: 'Estados de Cuenta Bancarios',
      description: 'Estados de cuenta de todas las cuentas utilizadas',
      priority: 'high',
      regulation: 'Regla 2.8.1.7 RMF'
    },
    {
      id: 'req-3',
      category: 'required',
      title: 'Cálculo de Impuestos Verificado',
      description: 'Verificación de cálculos de IVA e ISR',
      priority: 'high'
    },
    {
      id: 'rec-1',
      category: 'recommended',
      title: 'Documentos de Deducciones',
      description: 'Comprobantes de gastos deducibles',
      priority: 'medium'
    },
    {
      id: 'rec-2',
      category: 'recommended',
      title: 'Carta Explicativa',
      description: 'Explicación detallada de la solicitud',
      priority: 'low'
    },
    {
      id: 'opt-1',
      category: 'optional',
      title: 'Documentos Adicionales',
      description: 'Cualquier documento de soporte adicional',
      priority: 'low'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: 'BarChart3' },
    { id: 'documents', label: 'Documentos', icon: 'FileText' },
    { id: 'calculations', label: 'Cálculos', icon: 'Calculator' },
    { id: 'regulations', label: 'Normativa', icon: 'Shield' },
    { id: 'crossref', label: 'Referencias', icon: 'Link' },
    { id: 'checklist', label: 'Lista Final', icon: 'CheckSquare' }
  ];

  useEffect(() => {
    // Simulate validation process
    const timer = setTimeout(() => {
      setValidationResults({
        documentsValidated: true,
        calculationsVerified: true,
        regulationsChecked: true
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleFixIssue = (ruleId) => {
    console.log('Fixing issue for rule:', ruleId);
    // Navigate to appropriate fix page or show modal
  };

  const handleChecklistItemComplete = (itemId) => {
    setCompletedChecklist(prev => {
      if (prev?.includes(itemId)) {
        return prev?.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleExportReport = () => {
    console.log('Exporting compliance report...');
    // Generate and download PDF report
  };

  const handleDismissAlert = (alertId) => {
    console.log('Dismissing alert:', alertId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {validationOverview?.map((item) => (
                <ValidationStatusCard
                  key={item?.id}
                  {...item}
                  onClick={() => handleTabChange(item?.id)}
                />
              ))}
            </div>
            <RiskAssessmentPanel {...riskAssessment} />
          </div>
        );

      case 'documents':
        return (
          <ComplianceRulesList
            rules={complianceRules?.documents}
            category="documentos"
            onFixIssue={handleFixIssue}
          />
        );

      case 'calculations':
        return (
          <CalculationVerification
            calculations={calculationData}
            deductions={deductionsData}
          />
        );

      case 'regulations':
        return (
          <ComplianceRulesList
            rules={complianceRules?.regulations}
            category="normativa"
            onFixIssue={handleFixIssue}
          />
        );

      case 'crossref':
        return (
          <DocumentCrossReference
            documents={documentsForVerification}
            crossReferences={crossReferences}
          />
        );

      case 'checklist':
        return (
          <ComplianceChecklist
            checklistItems={checklistItems}
            completedItems={completedChecklist}
            onItemComplete={handleChecklistItemComplete}
            onExportReport={handleExportReport}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProgressBreadcrumbs />
      <ComplianceAlertBanner
        alerts={complianceAlerts}
        isVisible={showAlerts}
        onDismiss={handleDismissAlert}
      />
      <main className="container mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Verificación de Cumplimiento
              </h1>
              <p className="text-muted-foreground">
                Validación integral de documentos y requisitos normativos SAT
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/refund-request-wizard'}
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Volver a Editar
              </Button>
              
              <Button
                variant="default"
                onClick={() => window.location.href = '/submission-preparation'}
                disabled={completedChecklist?.length < 3}
              >
                <Icon name="ArrowRight" size={16} className="mr-2" />
                Continuar
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => handleTabChange(tab?.id)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>
      </main>
      <DocumentStatusIndicator
        isVisible={true}
        validationStatus="processing"
        errorCount={2}
        successCount={10}
        totalDocuments={12}
      />
      <QuickActionFloatingButton isVisible={true} />
    </div>
  );
};

export default ComplianceVerification;