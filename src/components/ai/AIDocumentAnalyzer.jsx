import React, { useState } from 'react';
import { FileText, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useOpenAI } from '../../hooks/useOpenAI';

const AIDocumentAnalyzer = ({ documentContent, documentType = 'general', onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState(null);
  const { loading, error, analyzeDocument, clearError } = useOpenAI();

  const handleAnalyze = async () => {
    if (!documentContent?.trim()) {
      return;
    }

    try {
      const result = await analyzeDocument(documentContent, documentType);
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'non_compliant':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'needs_review':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'text-green-800 bg-green-50 border-green-200';
      case 'non_compliant':
        return 'text-red-800 bg-red-50 border-red-200';
      case 'needs_review':
        return 'text-yellow-800 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-800 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Análisis de Documento con IA</h3>
        </div>
        
        {!analysis && (
          <button
            onClick={handleAnalyze}
            disabled={loading || !documentContent?.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analizando...
              </>
            ) : (
              'Analizar Documento'
            )}
          </button>
        )}
      </div>
      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-red-800">{error?.error}</h4>
            <p className="text-red-600 text-sm mt-1">{error?.suggestion}</p>
            <button
              onClick={clearError}
              className="text-red-600 text-sm underline hover:no-underline mt-1"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Compliance Status */}
          <div className={`rounded-lg border p-4 ${getStatusColor(analysis?.compliance_status)}`}>
            <div className="flex items-center gap-3">
              {getStatusIcon(analysis?.compliance_status)}
              <div>
                <h4 className="font-semibold">Estado de Cumplimiento</h4>
                <p className="text-sm capitalize">
                  {analysis?.compliance_status?.replace('_', ' ')}
                </p>
              </div>
              <div className="ml-auto">
                <span className="text-sm">
                  Confianza: {Math.round((analysis?.confidence || 0) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Issues Found */}
          {analysis?.issues_found?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Problemas Encontrados ({analysis?.issues_found?.length})
              </h4>
              <ul className="space-y-2">
                {analysis?.issues_found?.map((issue, index) => (
                  <li key={index} className="text-red-700 text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {analysis?.recommendations?.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Recomendaciones ({analysis?.recommendations?.length})
              </h4>
              <ul className="space-y-2">
                {analysis?.recommendations?.map((recommendation, index) => (
                  <li key={index} className="text-blue-700 text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Actions */}
          {analysis?.required_actions?.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Acciones Requeridas ({analysis?.required_actions?.length})
              </h4>
              <div className="space-y-3">
                {analysis?.required_actions?.map((action, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-white rounded border">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{action?.action}</p>
                      {action?.deadline && (
                        <p className="text-xs text-gray-600 mt-1">
                          Fecha límite: {action?.deadline}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(action?.priority)}`}>
                      {action?.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* No content state */}
      {!documentContent?.trim() && !loading && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Carga un documento para comenzar el análisis con IA</p>
        </div>
      )}
    </div>
  );
};

export default AIDocumentAnalyzer;