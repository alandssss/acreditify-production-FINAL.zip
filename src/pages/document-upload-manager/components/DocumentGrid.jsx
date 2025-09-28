import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const DocumentGrid = ({ documents, onDocumentAction }) => {
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());

  const getStatusBadge = (status) => {
    const statusConfig = {
      'validated': { color: 'bg-success/10 text-success border-success/20', icon: 'CheckCircle', label: 'Validado' },
      'processing': { color: 'bg-warning/10 text-warning border-warning/20', icon: 'Loader', label: 'Procesando' },
      'error': { color: 'bg-error/10 text-error border-error/20', icon: 'AlertCircle', label: 'Error' },
      'pending': { color: 'bg-muted/50 text-muted-foreground border-border', icon: 'Clock', label: 'Pendiente' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {config?.label}
      </span>
    );
  };

  const getDocumentTypeIcon = (type) => {
    const typeIcons = {
      'cfdi': 'Receipt',
      'bank_statement': 'CreditCard',
      'diot': 'FileSpreadsheet',
      'other': 'FileText'
    };
    return typeIcons?.[type] || 'FileText';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const handleSelectDocument = (docId) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected?.has(docId)) {
      newSelected?.delete(docId);
    } else {
      newSelected?.add(docId);
    }
    setSelectedDocuments(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDocuments?.size === documents?.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(documents.map(doc => doc.id)));
    }
  };

  const handleBulkAction = (action) => {
    const selectedDocs = documents?.filter(doc => selectedDocuments?.has(doc?.id));
    onDocumentAction(action, selectedDocs);
    setSelectedDocuments(new Set());
  };

  if (documents?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="FileText" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No hay documentos subidos
        </h3>
        <p className="text-muted-foreground">
          Sube tus primeros documentos fiscales para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header with bulk actions */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedDocuments?.size === documents?.length}
                onChange={handleSelectAll}
                className="rounded border-border"
              />
              <span className="text-sm text-muted-foreground">
                {selectedDocuments?.size > 0 
                  ? `${selectedDocuments?.size} seleccionados`
                  : `${documents?.length} documentos`
                }
              </span>
            </label>
          </div>

          {selectedDocuments?.size > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('validate')}
              >
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Validar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('compress')}
              >
                <Icon name="Archive" size={16} className="mr-2" />
                Comprimir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Eliminar
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Document Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {documents?.map((document) => (
            <div
              key={document?.id}
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                selectedDocuments?.has(document?.id) 
                  ? 'border-primary bg-primary/5' :'border-border bg-background'
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedDocuments?.has(document?.id)}
                  onChange={() => handleSelectDocument(document?.id)}
                  className="mt-1 rounded border-border"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getDocumentTypeIcon(document?.type)} 
                        size={20} 
                        className="text-primary flex-shrink-0" 
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {document?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(document?.size)} • {document?.uploadDate}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(document?.status)}
                  </div>

                  {/* Document Preview */}
                  {document?.thumbnail && (
                    <div className="mb-3">
                      <div className="w-full h-24 bg-muted rounded overflow-hidden">
                        <Image
                          src={document?.thumbnail}
                          alt={`Vista previa de ${document?.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  {document?.metadata && (
                    <div className="mb-3 space-y-1">
                      {document?.metadata?.rfc && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">RFC:</span>
                          <span className="text-foreground font-mono">{document?.metadata?.rfc}</span>
                        </div>
                      )}
                      {document?.metadata?.amount && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Monto:</span>
                          <span className="text-foreground font-medium">${document?.metadata?.amount} MXN</span>
                        </div>
                      )}
                      {document?.ocrConfidence && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Confianza OCR:</span>
                          <span className={`font-medium ${
                            document?.ocrConfidence >= 90 ? 'text-success' : 
                            document?.ocrConfidence >= 70 ? 'text-warning' : 'text-error'
                          }`}>
                            {document?.ocrConfidence}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error Messages */}
                  {document?.errors && document?.errors?.length > 0 && (
                    <div className="mb-3 p-2 bg-error/10 border border-error/20 rounded text-xs">
                      <div className="flex items-center space-x-1 mb-1">
                        <Icon name="AlertCircle" size={12} className="text-error" />
                        <span className="text-error font-medium">Errores encontrados:</span>
                      </div>
                      <ul className="text-error space-y-1">
                        {document?.errors?.slice(0, 2)?.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                        {document?.errors?.length > 2 && (
                          <li>• +{document?.errors?.length - 2} errores más</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDocumentAction('preview', document)}
                      >
                        <Icon name="Eye" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDocumentAction('rescan', document)}
                      >
                        <Icon name="RotateCcw" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDocumentAction('edit', document)}
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDocumentAction('delete', document)}
                    >
                      <Icon name="Trash2" size={14} className="text-error" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentGrid;