import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, FileText, Bot, Zap } from 'lucide-react';
import AIDocumentAnalyzer from '../../../components/ai/AIDocumentAnalyzer';

const ValidationPanel = ({ selectedDocument }) => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showAIAnalyzer, setShowAIAnalyzer] = useState(false);

  // Mock validation results
  const validationResults = {
    status: selectedDocument ? 'warning' : 'pending',
    message: selectedDocument ? 'Documento requiere revisión' : 'Selecciona un documento para validar',
    details: selectedDocument ? [
      'Formato correcto: PDF ✓',
      'Tamaño válido: 2.3 MB ✓',
      'Fecha requerida en el documento ⚠️',
      'Firma digital ausente ❌'
    ] : []
  };

  const getStatusIcon = () => {
    switch (validationResults?.status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (validationResults?.status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleAIAnalysisComplete = (analysis) => {
    setAiAnalysis(analysis);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Panel de Validación</h3>
        </div>
        
        {selectedDocument && (
          <button
            onClick={() => setShowAIAnalyzer(!showAIAnalyzer)}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <Bot className="w-4 h-4" />
            {showAIAnalyzer ? 'Ocultar' : 'Analizar'} con IA
          </button>
        )}
      </div>
      {/* Traditional Validation */}
      <div className={`rounded-lg border p-4 mb-4 ${getStatusColor()}`}>
        <div className="flex items-center gap-3 mb-3">
          {getStatusIcon()}
          <h4 className="font-medium text-gray-900">Estado de Validación</h4>
        </div>
        
        <p className="text-sm text-gray-700 mb-3">{validationResults?.message}</p>
        
        {validationResults?.details?.length > 0 && (
          <ul className="space-y-1">
            {validationResults?.details?.map((detail, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                {detail}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* AI Document Analyzer */}
      {showAIAnalyzer && selectedDocument && (
        <div className="mb-4">
          <AIDocumentAnalyzer
            documentContent={`Documento: ${selectedDocument?.name || 'Documento seleccionado'}
Tipo: ${selectedDocument?.type || 'Factura'}
Tamaño: ${selectedDocument?.size || '2.3 MB'}
Fecha: ${selectedDocument?.date || '2024-01-15'}

[Contenido simulado del documento para análisis de IA]
RFC Emisor: ABC123456789
RFC Receptor: ${selectedDocument?.rfc || 'XAXX010101000'}  
Monto Total: $${selectedDocument?.amount || '1,500.00'} MXN
Fecha de emisión: ${selectedDocument?.date || '15/01/2024'}
Concepto: ${selectedDocument?.concept || 'Servicios profesionales'}

Estado: ${selectedDocument?.status || 'Activo'}
Folio Fiscal: ${selectedDocument?.folio || '12345678-1234-1234-1234-123456789012'}
Sello Digital: ${selectedDocument?.hasDigitalSeal ? 'Presente' : 'Ausente'}
Validación SAT: ${selectedDocument?.satValidation || 'Pendiente'}`}
            documentType={selectedDocument?.type?.toLowerCase() || 'factura'}
            onAnalysisComplete={handleAIAnalysisComplete}
          />
        </div>
      )}
      {/* AI Analysis Summary */}
      {aiAnalysis && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-purple-600" />
            <h4 className="font-medium text-purple-800">Resumen del Análisis de IA</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-purple-600 font-medium">Estado:</span>
              <p className="text-purple-800 capitalize">
                {aiAnalysis?.compliance_status?.replace('_', ' ')}
              </p>
            </div>
            <div>
              <span className="text-purple-600 font-medium">Confianza:</span>
              <p className="text-purple-800">
                {Math.round((aiAnalysis?.confidence || 0) * 100)}%
              </p>
            </div>
          </div>
          
          {aiAnalysis?.issues_found?.length > 0 && (
            <div className="mt-3">
              <span className="text-purple-600 font-medium text-sm">Problemas encontrados:</span>
              <p className="text-purple-800 text-sm">
                {aiAnalysis?.issues_found?.length} problema(s) detectado(s)
              </p>
            </div>
          )}
        </div>
      )}
      {!selectedDocument && (
        <div className="text-center py-8 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-3" />
          <p>Selecciona un documento para comenzar la validación</p>
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;