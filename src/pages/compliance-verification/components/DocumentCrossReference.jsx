import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentCrossReference = ({ documents, crossReferences }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [verificationResults, setVerificationResults] = useState({});

  const getDocumentStatus = (docId) => {
    const result = verificationResults?.[docId];
    if (!result) return 'pending';
    return result?.status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'processing':
        return 'Loader';
      default:
        return 'Clock';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'processing':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleVerifyDocument = async (docId) => {
    setVerificationResults(prev => ({
      ...prev,
      [docId]: { status: 'processing', message: 'Verificando con SAT...' }
    }));

    // Simulate verification process
    setTimeout(() => {
      const mockResults = [
        { status: 'verified', message: 'CFDI válido y registrado en SAT' },
        { status: 'error', message: 'CFDI no encontrado en base de datos SAT' },
        { status: 'warning', message: 'CFDI válido pero con inconsistencias menores' }
      ];
      
      const result = mockResults?.[Math.floor(Math.random() * mockResults?.length)];
      setVerificationResults(prev => ({
        ...prev,
        [docId]: result
      }));
    }, 2000);
  };

  return (
    <div className="bg-card border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Verificación Cruzada de Documentos</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Validación de autenticidad y consistencia con bases de datos SAT
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 p-4">
        {/* Documents List */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Documentos para Verificar</h4>
          {documents?.map((doc) => {
            const status = getDocumentStatus(doc?.id);
            return (
              <div 
                key={doc?.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  selectedDocument?.id === doc?.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedDocument(doc)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon name="FileText" size={18} className="text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm text-foreground">{doc?.name}</p>
                      <p className="text-xs text-muted-foreground">{doc?.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getStatusIcon(status)} 
                      size={16} 
                      className={`${getStatusColor(status)} ${status === 'processing' ? 'animate-spin' : ''}`} 
                    />
                    {status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleVerifyDocument(doc?.id);
                        }}
                      >
                        Verificar
                      </Button>
                    )}
                  </div>
                </div>
                {verificationResults?.[doc?.id] && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className={`text-xs ${getStatusColor(status)}`}>
                      {verificationResults?.[doc?.id]?.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cross Reference Details */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Detalles de Verificación</h4>
          
          {selectedDocument ? (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h5 className="font-medium text-sm mb-2">Documento Seleccionado</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="text-foreground">{selectedDocument?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="text-foreground">{selectedDocument?.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">UUID:</span>
                    <span className="text-foreground font-mono text-xs">{selectedDocument?.uuid}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">RFC Emisor:</span>
                    <span className="text-foreground">{selectedDocument?.rfcEmisor}</span>
                  </div>
                </div>
              </div>

              {/* Cross References */}
              <div>
                <h5 className="font-medium text-sm mb-2">Referencias Cruzadas</h5>
                <div className="space-y-2">
                  {crossReferences?.filter(ref => ref?.documentId === selectedDocument?.id)?.map((ref, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                        <div className="flex items-center space-x-2">
                          <Icon name="Link" size={14} className="text-muted-foreground" />
                          <span className="text-sm text-foreground">{ref?.description}</span>
                        </div>
                        <Icon 
                          name={ref?.status === 'match' ? 'Check' : 'X'} 
                          size={14} 
                          className={ref?.status === 'match' ? 'text-success' : 'text-error'} 
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Verification Actions */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleVerifyDocument(selectedDocument?.id)}
                  disabled={getDocumentStatus(selectedDocument?.id) === 'processing'}
                >
                  <Icon name="Search" size={16} className="mr-2" />
                  Verificar en SAT
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => console.log('View details:', selectedDocument?.id)}
                >
                  <Icon name="Eye" size={16} className="mr-2" />
                  Ver Detalles Completos
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="MousePointer" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Selecciona un documento para ver los detalles de verificación
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCrossReference;