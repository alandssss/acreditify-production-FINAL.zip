import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DocumentChecklistPanel = ({ documents }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['required']));

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded?.has(sectionId)) {
      newExpanded?.delete(sectionId);
    } else {
      newExpanded?.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'pending':
        return { icon: 'Clock', color: 'text-warning' };
      case 'error':
        return { icon: 'AlertCircle', color: 'text-error' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const documentSections = [
    {
      id: 'required',
      title: 'Documentos Obligatorios',
      description: 'Formularios y anexos requeridos por el SAT',
      documents: documents?.filter(doc => doc?.category === 'required')
    },
    {
      id: 'supporting',
      title: 'Documentos de Soporte',
      description: 'CFDI, estados de cuenta y comprobantes',
      documents: documents?.filter(doc => doc?.category === 'supporting')
    },
    {
      id: 'additional',
      title: 'Documentos Adicionales',
      description: 'Anexos opcionales y documentación complementaria',
      documents: documents?.filter(doc => doc?.category === 'additional')
    }
  ];

  const getTotalProgress = () => {
    const completed = documents?.filter(doc => doc?.status === 'completed')?.length;
    return Math.round((completed / documents?.length) * 100);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Lista de Documentos</h3>
          <p className="text-sm text-muted-foreground">Verificación de completitud</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{getTotalProgress()}%</div>
          <div className="text-xs text-muted-foreground">Completado</div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${getTotalProgress()}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{documents?.filter(doc => doc?.status === 'completed')?.length} de {documents?.length} documentos</span>
          <span>{formatFileSize(documents?.reduce((total, doc) => total + (doc?.size || 0), 0))} total</span>
        </div>
      </div>
      {/* Document Sections */}
      <div className="space-y-4">
        {documentSections?.map((section) => (
          <div key={section?.id} className="border border-border rounded-lg">
            <button
              onClick={() => toggleSection(section?.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={expandedSections?.has(section?.id) ? "ChevronDown" : "ChevronRight"} 
                  size={20} 
                  className="text-muted-foreground" 
                />
                <div className="text-left">
                  <h4 className="font-medium text-foreground">{section?.title}</h4>
                  <p className="text-sm text-muted-foreground">{section?.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {section?.documents?.filter(doc => doc?.status === 'completed')?.length}/{section?.documents?.length}
                </span>
                <Icon name="FileText" size={16} className="text-muted-foreground" />
              </div>
            </button>

            {expandedSections?.has(section?.id) && (
              <div className="border-t border-border">
                <div className="p-4 space-y-3">
                  {section?.documents?.map((document) => {
                    const statusInfo = getStatusIcon(document?.status);
                    return (
                      <div key={document?.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon 
                            name={statusInfo?.icon} 
                            size={18} 
                            className={statusInfo?.color} 
                          />
                          <div>
                            <p className="font-medium text-sm text-foreground">{document?.name}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>{document?.type}</span>
                              {document?.size && <span>{formatFileSize(document?.size)}</span>}
                              {document?.lastModified && <span>Modificado: {formatDate(document?.lastModified)}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {document?.status === 'completed' && (
                            <button className="text-primary hover:text-primary/80 transition-colors">
                              <Icon name="Eye" size={16} />
                            </button>
                          )}
                          {document?.status === 'error' && (
                            <button className="text-error hover:text-error/80 transition-colors">
                              <Icon name="AlertTriangle" size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-success">
              {documents?.filter(doc => doc?.status === 'completed')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Completados</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">
              {documents?.filter(doc => doc?.status === 'pending')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Pendientes</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-error">
              {documents?.filter(doc => doc?.status === 'error')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Con Errores</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentChecklistPanel;