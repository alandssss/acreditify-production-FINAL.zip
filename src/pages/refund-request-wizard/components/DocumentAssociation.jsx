import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DocumentAssociation = ({ 
  documents, 
  formSections, 
  associations, 
  onAssociationChange,
  validationResults 
}) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [draggedDocument, setDraggedDocument] = useState(null);
  const [activeSection, setActiveSection] = useState('all');

  const documentTypes = [
    { value: 'cfdi', label: 'CFDI', icon: 'FileText', color: 'text-blue-600' },
    { value: 'bank_statement', label: 'Estado de Cuenta', icon: 'CreditCard', color: 'text-green-600' },
    { value: 'diot', label: 'DIOT', icon: 'Database', color: 'text-purple-600' },
    { value: 'tax_return', label: 'Declaración', icon: 'Calculator', color: 'text-orange-600' },
    { value: 'receipt', label: 'Comprobante', icon: 'Receipt', color: 'text-indigo-600' },
    { value: 'other', label: 'Otro', icon: 'File', color: 'text-gray-600' }
  ];

  const sectionOptions = [
    { value: 'all', label: 'Todos los documentos' },
    { value: 'unassigned', label: 'Sin asignar' },
    { value: 'assigned', label: 'Asignados' },
    { value: 'validation_error', label: 'Con errores' }
  ];

  const mockDocuments = [
    {
      id: 'doc1',
      name: 'CFDI_Gastos_Enero_2024.xml',
      type: 'cfdi',
      size: '245 KB',
      uploadDate: '2024-09-20',
      status: 'validated',
      associatedSection: 'income_section',
      validationStatus: 'valid'
    },
    {
      id: 'doc2',
      name: 'Estado_Cuenta_BBVA_Enero.pdf',
      type: 'bank_statement',
      size: '1.2 MB',
      uploadDate: '2024-09-21',
      status: 'validated',
      associatedSection: null,
      validationStatus: 'valid'
    },
    {
      id: 'doc3',
      name: 'DIOT_Enero_2024.txt',
      type: 'diot',
      size: '89 KB',
      uploadDate: '2024-09-22',
      status: 'processing',
      associatedSection: 'tax_calculation',
      validationStatus: 'warning'
    },
    {
      id: 'doc4',
      name: 'Declaracion_Anual_2023.pdf',
      type: 'tax_return',
      size: '567 KB',
      uploadDate: '2024-09-19',
      status: 'validated',
      associatedSection: 'deductions_section',
      validationStatus: 'error'
    },
    {
      id: 'doc5',
      name: 'Comprobante_Retenciones.pdf',
      type: 'receipt',
      size: '123 KB',
      uploadDate: '2024-09-23',
      status: 'validated',
      associatedSection: null,
      validationStatus: 'valid'
    }
  ];

  const mockFormSections = [
    {
      id: 'income_section',
      name: 'Ingresos Acumulables',
      description: 'Documentos que comprueban ingresos gravados',
      requiredDocTypes: ['cfdi', 'receipt'],
      documentsCount: 1,
      isComplete: true
    },
    {
      id: 'deductions_section',
      name: 'Deducciones Autorizadas',
      description: 'Gastos deducibles y comprobantes fiscales',
      requiredDocTypes: ['cfdi', 'receipt'],
      documentsCount: 1,
      isComplete: false
    },
    {
      id: 'tax_calculation',
      name: 'Cálculo del Impuesto',
      description: 'Documentos para determinación del impuesto',
      requiredDocTypes: ['diot', 'tax_return'],
      documentsCount: 1,
      isComplete: false
    },
    {
      id: 'bank_info',
      name: 'Información Bancaria',
      description: 'Estados de cuenta y datos bancarios',
      requiredDocTypes: ['bank_statement'],
      documentsCount: 0,
      isComplete: false
    }
  ];

  const getDocumentIcon = (type) => {
    const docType = documentTypes?.find(dt => dt?.value === type);
    return docType ? docType?.icon : 'File';
  };

  const getDocumentColor = (type) => {
    const docType = documentTypes?.find(dt => dt?.value === type);
    return docType ? docType?.color : 'text-gray-600';
  };

  const getValidationIcon = (status) => {
    switch (status) {
      case 'valid':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Clock';
    }
  };

  const getValidationColor = (status) => {
    switch (status) {
      case 'valid':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getFilteredDocuments = () => {
    let filtered = mockDocuments;
    
    switch (activeSection) {
      case 'unassigned':
        filtered = mockDocuments?.filter(doc => !doc?.associatedSection);
        break;
      case 'assigned':
        filtered = mockDocuments?.filter(doc => doc?.associatedSection);
        break;
      case 'validation_error':
        filtered = mockDocuments?.filter(doc => doc?.validationStatus === 'error');
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const handleDragStart = (e, document) => {
    setDraggedDocument(document);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, sectionId) => {
    e?.preventDefault();
    if (draggedDocument) {
      onAssociationChange(draggedDocument?.id, sectionId);
      setDraggedDocument(null);
    }
  };

  const handleAssignDocument = (documentId, sectionId) => {
    onAssociationChange(documentId, sectionId);
  };

  const handleRemoveAssociation = (documentId) => {
    onAssociationChange(documentId, null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Asociación de Documentos
        </h2>
        <p className="text-muted-foreground">
          Arrastra y asigna tus documentos a las secciones correspondientes del formulario.
        </p>
      </div>
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          options={sectionOptions}
          value={activeSection}
          onChange={setActiveSection}
          className="w-48"
        />
        <Button variant="outline" size="sm">
          <Icon name="Filter" size={16} className="mr-2" />
          Filtros Avanzados
        </Button>
        <Button variant="outline" size="sm">
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Revalidar Todo
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents List */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Files" size={20} className="mr-2" />
              Documentos ({getFilteredDocuments()?.length})
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getFilteredDocuments()?.map((document) => (
                <div
                  key={document?.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, document)}
                  className={`p-3 border border-border rounded-lg cursor-move hover:shadow-md transition-all duration-200 ${
                    selectedDocument?.id === document?.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedDocument(document)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon 
                      name={getDocumentIcon(document?.type)} 
                      size={20} 
                      className={getDocumentColor(document?.type)} 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {document?.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {document?.size} • {document?.uploadDate}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Icon 
                          name={getValidationIcon(document?.validationStatus)} 
                          size={14} 
                          className={getValidationColor(document?.validationStatus)} 
                        />
                        <span className={`text-xs ${getValidationColor(document?.validationStatus)}`}>
                          {document?.validationStatus === 'valid' ? 'Válido' :
                           document?.validationStatus === 'warning' ? 'Advertencia' :
                           document?.validationStatus === 'error' ? 'Error' : 'Procesando'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {document?.associatedSection && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                        Asignado
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleRemoveAssociation(document?.id);
                        }}
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {mockFormSections?.map((section) => {
              const assignedDocs = mockDocuments?.filter(doc => doc?.associatedSection === section?.id);
              
              return (
                <div
                  key={section?.id}
                  className="bg-card border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors duration-200"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, section?.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center">
                        <Icon 
                          name={section?.isComplete ? "CheckCircle" : "Circle"} 
                          size={20} 
                          className={`mr-2 ${section?.isComplete ? 'text-success' : 'text-muted-foreground'}`} 
                        />
                        {section?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {section?.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground">
                        {assignedDocs?.length} documentos
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {section?.isComplete ? 'Completo' : 'Incompleto'}
                      </p>
                    </div>
                  </div>
                  {/* Required Document Types */}
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">Tipos requeridos:</p>
                    <div className="flex flex-wrap gap-1">
                      {section?.requiredDocTypes?.map((type) => {
                        const docType = documentTypes?.find(dt => dt?.value === type);
                        return (
                          <span 
                            key={type}
                            className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                          >
                            {docType?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {/* Assigned Documents */}
                  <div className="space-y-2">
                    {assignedDocs?.length > 0 ? (
                      assignedDocs?.map((doc) => (
                        <div 
                          key={doc?.id}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded border"
                        >
                          <div className="flex items-center space-x-2">
                            <Icon 
                              name={getDocumentIcon(doc?.type)} 
                              size={16} 
                              className={getDocumentColor(doc?.type)} 
                            />
                            <span className="text-sm text-foreground truncate">
                              {doc?.name}
                            </span>
                            <Icon 
                              name={getValidationIcon(doc?.validationStatus)} 
                              size={14} 
                              className={getValidationColor(doc?.validationStatus)} 
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAssociation(doc?.id)}
                          >
                            <Icon name="X" size={14} />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Icon name="Upload" size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          Arrastra documentos aquí o haz clic para asignar
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Document Details Panel */}
      {selectedDocument && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Info" size={20} className="mr-2" />
            Detalles del Documento
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">{selectedDocument?.name}</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Tipo: {documentTypes?.find(dt => dt?.value === selectedDocument?.type)?.label}</p>
                <p>Tamaño: {selectedDocument?.size}</p>
                <p>Fecha de subida: {selectedDocument?.uploadDate}</p>
                <p>Estado: {selectedDocument?.status}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Asignación</h4>
              <Select
                options={[
                  { value: '', label: 'Sin asignar' },
                  ...mockFormSections?.map(section => ({
                    value: section?.id,
                    label: section?.name
                  }))
                ]}
                value={selectedDocument?.associatedSection || ''}
                onChange={(value) => handleAssignDocument(selectedDocument?.id, value || null)}
                placeholder="Seleccionar sección"
              />
            </div>
          </div>
          
          {selectedDocument?.validationStatus === 'error' && (
            <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                <div>
                  <h5 className="font-medium text-error mb-1">Errores de Validación</h5>
                  <ul className="text-sm text-error space-y-1">
                    <li>• El archivo no cumple con el formato XML requerido</li>
                    <li>• Falta información fiscal obligatoria</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Progress Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-foreground">Progreso de Asociación</h4>
          <span className="text-sm text-muted-foreground">
            {mockFormSections?.filter(s => s?.isComplete)?.length} de {mockFormSections?.length} secciones completas
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(mockFormSections?.filter(s => s?.isComplete)?.length / mockFormSections?.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentAssociation;