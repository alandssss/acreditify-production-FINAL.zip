import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryMetrics = ({ metrics }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}%`;
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-success';
    if (value < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const metricCards = [
    {
      title: 'Total Solicitado',
      value: formatCurrency(metrics?.totalRequested),
      change: metrics?.requestedChange,
      icon: 'TrendingUp',
      color: 'bg-primary/10 text-primary'
    },
    {
      title: 'Monto Aprobado',
      value: formatCurrency(metrics?.totalApproved),
      change: metrics?.approvedChange,
      icon: 'CheckCircle',
      color: 'bg-success/10 text-success'
    },
    {
      title: 'En Proceso',
      value: metrics?.pendingApplications,
      change: metrics?.pendingChange,
      icon: 'Clock',
      color: 'bg-warning/10 text-warning'
    },
    {
      title: 'Tiempo Promedio',
      value: `${metrics?.averageProcessingTime} días`,
      change: metrics?.timeChange,
      icon: 'Timer',
      color: 'bg-accent/10 text-accent'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards?.map((metric) => (
        <div key={metric?.title} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`${metric?.color} p-2 rounded-lg`}>
              <Icon name={metric?.icon} size={20} />
            </div>
            <div className={`flex items-center text-sm ${getChangeColor(metric?.change)}`}>
              <Icon 
                name={metric?.change >= 0 ? "TrendingUp" : "TrendingDown"} 
                size={14} 
                className="mr-1" 
              />
              {formatPercentage(metric?.change)}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{metric?.value}</h3>
            <p className="text-sm text-muted-foreground">{metric?.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryMetrics;