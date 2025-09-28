import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceChecklist = ({ 
  checklistItems, 
  completedItems, 
  onItemComplete, 
  onExportReport 
}) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set(['required']));

  const toggleCategory = (category) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(category)) {
        newSet?.delete(category);
      } else {
        newSet?.add(category);
      }
      return newSet;
    });
  };

  const getItemStatus = (itemId) => {
    return completedItems?.includes(itemId) ? 'completed' : 'pending';
  };

  const getCategoryProgress = (category) => {
    const categoryItems = checklistItems?.filter(item => item?.category === category);
    const completedCount = categoryItems?.filter(item => completedItems?.includes(item?.id))?.length;
    return {
      completed: completedCount,
      total: categoryItems?.length,
      percentage: Math.round((completedCount / categoryItems?.length) * 100)
    };
  };

  const categories = [...new Set(checklistItems.map(item => item.category))];
  const overallProgress = getCategoryProgress('all');
  const totalCompleted = completedItems?.length;
  const totalItems = checklistItems?.length;
  const overallPercentage = Math.round((totalCompleted / totalItems) * 100);

  const getReadinessStatus = () => {
    if (overallPercentage >= 95) return { status: 'ready', message: 'Listo para envío', color: 'text-success' };
    if (overallPercentage >= 80) return { status: 'almost', message: 'Casi listo', color: 'text-warning' };
    return { status: 'not-ready', message: 'Requiere más trabajo', color: 'text-error' };
  };

  const readiness = getReadinessStatus();

  return (
    <div className="bg-card border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Lista de Verificación</h3>
            <p className="text-sm text-muted-foreground">
              Progreso de cumplimiento normativo
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportReport}
          >
            <Icon name="Download" size={16} className="mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>
      {/* Overall Progress */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-foreground">Progreso General</p>
            <p className={`text-sm ${readiness?.color}`}>{readiness?.message}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{overallPercentage}%</p>
            <p className="text-xs text-muted-foreground">{totalCompleted} de {totalItems}</p>
          </div>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              overallPercentage >= 95 ? 'bg-success' : 
              overallPercentage >= 80 ? 'bg-warning' : 'bg-primary'
            }`}
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>
      {/* Categories */}
      <div className="p-4 space-y-4">
        {categories?.map((category) => {
          const progress = getCategoryProgress(category);
          const isExpanded = expandedCategories?.has(category);
          const categoryItems = checklistItems?.filter(item => item?.category === category);

          return (
            <div key={category} className="border rounded-lg">
              <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={progress?.percentage === 100 ? 'CheckCircle' : 'Circle'} 
                    size={20} 
                    className={progress?.percentage === 100 ? 'text-success' : 'text-muted-foreground'} 
                  />
                  <div>
                    <h4 className="font-medium text-foreground capitalize">
                      {category === 'required' ? 'Requisitos Obligatorios' :
                       category === 'recommended' ? 'Recomendaciones' :
                       category === 'optional' ? 'Opcionales' : category}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {progress?.completed} de {progress?.total} completados
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{progress?.percentage}%</p>
                    <div className="w-16 bg-muted rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${
                          progress?.percentage === 100 ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: `${progress?.percentage}%` }}
                      />
                    </div>
                  </div>
                  <Icon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                </div>
              </div>
              {isExpanded && (
                <div className="border-t border-border p-3 space-y-2">
                  {categoryItems?.map((item) => {
                    const status = getItemStatus(item?.id);
                    return (
                      <div key={item?.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/30 transition-colors">
                        <button
                          onClick={() => onItemComplete(item?.id)}
                          className="mt-0.5"
                        >
                          <Icon 
                            name={status === 'completed' ? 'CheckSquare' : 'Square'} 
                            size={18} 
                            className={status === 'completed' ? 'text-success' : 'text-muted-foreground hover:text-primary'} 
                          />
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'
                          }`}>
                            {item?.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item?.description}
                          </p>
                          
                          {item?.regulation && (
                            <p className="text-xs text-primary mt-1">
                              Ref: {item?.regulation}
                            </p>
                          )}
                          
                          {item?.priority === 'high' && status !== 'completed' && (
                            <span className="inline-block mt-1 px-2 py-1 bg-error/10 text-error text-xs rounded-full">
                              Crítico
                            </span>
                          )}
                        </div>
                        {item?.helpUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(item?.helpUrl, '_blank')}
                          >
                            <Icon name="HelpCircle" size={14} />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Action Buttons */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Button
            variant="default"
            className="flex-1"
            disabled={overallPercentage < 95}
            onClick={() => window.location.href = '/submission-preparation'}
          >
            <Icon name="Send" size={16} className="mr-2" />
            Proceder al Envío
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/refund-request-wizard'}
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Volver a Editar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceChecklist;