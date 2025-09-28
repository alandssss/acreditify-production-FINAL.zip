import React, { useState } from 'react';
import { Lightbulb, TrendingUp, DollarSign, ArrowRight, RefreshCw } from 'lucide-react';
import AIAssistantChat from '../../../components/ai/AIAssistantChat';
import AIRecommendationPanel from '../../../components/ai/AIRecommendationPanel';

const PersonalizedRecommendations = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  
  // Mock user profile - in real app, get from user context/state
  const userProfile = {
    rfc: 'XAXX010101000',
    name: 'Juan Pérez García',
    taxYear: 2024,
    income: 500000,
    hasEmployeeIncome: true,
    hasBusinessIncome: false,
    hasForeignIncome: false,
    hasInvestments: true,
    hasDeductions: true,
    filingHistory: 'regular',
    previousRefunds: [15000, 8000],
    complianceScore: 85
  };

  const handleRecommendationSelect = (recommendation, type) => {
    setSelectedRecommendation({ content: recommendation, type });
    setIsChatOpen(true);
  };

  const mockRecommendations = [
    {
      id: 1,
      type: 'tax_optimization',
      title: 'Maximiza tus deducciones médicas',
      description: 'Puedes deducir hasta $15,000 adicionales en gastos médicos',
      impact: 'Alto',
      savings: '3,750',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      id: 2,
      type: 'refund_opportunity',
      title: 'Solicita devolución de saldo a favor',
      description: 'Tienes $12,500 disponibles para solicitar devolución',
      impact: 'Alto',
      savings: '12,500',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      id: 3,
      type: 'compliance',
      title: 'Actualiza tu situación fiscal',
      description: 'Revisa y actualiza tu información en el RFC',
      impact: 'Medio',
      savings: '0',
      icon: <Lightbulb className="w-4 h-4" />,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recomendaciones Personalizadas</h2>
            <p className="text-sm text-gray-600">Optimiza tu situación fiscal con IA</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Generar con IA
        </button>
      </div>
      {/* AI Recommendation Panel */}
      <AIRecommendationPanel 
        userProfile={userProfile}
        onRecommendationSelect={handleRecommendationSelect}
      />
      {/* Fallback recommendations */}
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Recomendaciones Rápidas</h3>
        <div className="space-y-3">
          {mockRecommendations?.map((recommendation) => (
            <div 
              key={recommendation?.id} 
              className={`p-4 rounded-lg border ${recommendation?.color} cursor-pointer hover:shadow-md transition-all`}
              onClick={() => handleRecommendationSelect(recommendation?.description, recommendation?.type)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {recommendation?.icon}
                    <h3 className="font-medium">{recommendation?.title}</h3>
                  </div>
                  <p className="text-sm opacity-80 mb-2">{recommendation?.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span>Impacto: {recommendation?.impact}</span>
                    {recommendation?.savings !== '0' && (
                      <span>Ahorro: ${recommendation?.savings} MXN</span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-60" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* AI Assistant Chat */}
      <AIAssistantChat 
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        context={selectedRecommendation}
      />
    </div>
  );
};

export default PersonalizedRecommendations;