import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, DollarSign, Calendar, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useOpenAI } from '../../hooks/useOpenAI';

const AIRecommendationPanel = ({ userProfile, onRecommendationSelect }) => {
  const [recommendations, setRecommendations] = useState(null);
  const { loading, error, getPersonalizedRecommendations, clearError } = useOpenAI();

  useEffect(() => {
    if (userProfile && Object.keys(userProfile)?.length > 0) {
      generateRecommendations();
    }
  }, [userProfile]);

  const generateRecommendations = async () => {
    if (!userProfile) return;

    try {
      const result = await getPersonalizedRecommendations(userProfile);
      setRecommendations(result);
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  if (loading && !recommendations) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600">Generando recomendaciones personalizadas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Recomendaciones Personalizadas</h3>
        </div>
        
        <button
          onClick={generateRecommendations}
          disabled={loading || !userProfile}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
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
      {recommendations && (
        <div className="space-y-6">
          {/* Estimated Savings */}
          {recommendations?.estimated_savings && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Ahorros Estimados Anuales</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(recommendations?.estimated_savings)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tax Optimization */}
          {recommendations?.tax_optimization?.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Optimización Fiscal ({recommendations?.tax_optimization?.length})
              </h4>
              <div className="space-y-2">
                {recommendations?.tax_optimization?.map((optimization, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-3 rounded border border-blue-100 cursor-pointer hover:border-blue-300 transition-colors"
                    onClick={() => onRecommendationSelect?.(optimization, 'optimization')}
                  >
                    <p className="text-sm text-blue-700">{optimization}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refund Opportunities */}
          {recommendations?.refund_opportunities?.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Oportunidades de Reembolso ({recommendations?.refund_opportunities?.length})
              </h4>
              <div className="space-y-2">
                {recommendations?.refund_opportunities?.map((opportunity, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-3 rounded border border-green-100 cursor-pointer hover:border-green-300 transition-colors"
                    onClick={() => onRecommendationSelect?.(opportunity, 'refund')}
                  >
                    <p className="text-sm text-green-700">{opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Improvements */}
          {recommendations?.compliance_improvements?.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Mejoras de Cumplimiento ({recommendations?.compliance_improvements?.length})
              </h4>
              <div className="space-y-2">
                {recommendations?.compliance_improvements?.map((improvement, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-3 rounded border border-yellow-100 cursor-pointer hover:border-yellow-300 transition-colors"
                    onClick={() => onRecommendationSelect?.(improvement, 'compliance')}
                  >
                    <p className="text-sm text-yellow-700">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Deadlines */}
          {recommendations?.deadlines_to_watch?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fechas Límite Importantes ({recommendations?.deadlines_to_watch?.length})
              </h4>
              <div className="space-y-3">
                {recommendations?.deadlines_to_watch?.map((deadline, index) => (
                  <div key={index} className="bg-white p-3 rounded border border-red-100 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{deadline?.description}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Fecha: {deadline?.deadline}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(deadline?.priority)}`}>
                      {deadline?.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* No recommendations state */}
      {!recommendations && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Completa tu perfil para recibir recomendaciones personalizadas</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationPanel;