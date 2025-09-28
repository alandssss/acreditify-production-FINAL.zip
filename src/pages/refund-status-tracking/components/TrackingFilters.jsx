import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TrackingFilters = ({ onFiltersChange, totalApplications, filteredCount }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    refundType: '',
    dateRange: '',
    amountRange: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: '', label: 'Todos los Estados' },
    { value: 'submitted', label: 'Enviada' },
    { value: 'under_review', label: 'En Revisión' },
    { value: 'approved', label: 'Aprobada' },
    { value: 'deposited', label: 'Depositada' },
    { value: 'rejected', label: 'Rechazada' },
    { value: 'requires_action', label: 'Requiere Acción' }
  ];

  const refundTypeOptions = [
    { value: '', label: 'Todos los Tipos' },
    { value: 'salary', label: 'Salarios' },
    { value: 'professional', label: 'Honorarios' },
    { value: 'rental', label: 'Arrendamiento' },
    { value: 'corporate', label: 'Empresarial' },
    { value: 'asset_sales', label: 'Venta de Activos' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'Cualquier Fecha' },
    { value: 'last_week', label: 'Última Semana' },
    { value: 'last_month', label: 'Último Mes' },
    { value: 'last_3_months', label: 'Últimos 3 Meses' },
    { value: 'last_6_months', label: 'Últimos 6 Meses' },
    { value: 'last_year', label: 'Último Año' }
  ];

  const amountRangeOptions = [
    { value: '', label: 'Cualquier Monto' },
    { value: '0-10000', label: 'Hasta $10,000' },
    { value: '10000-50000', label: '$10,000 - $50,000' },
    { value: '50000-100000', label: '$50,000 - $100,000' },
    { value: '100000-500000', label: '$100,000 - $500,000' },
    { value: '500000+', label: 'Más de $500,000' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      refundType: '',
      dateRange: '',
      amountRange: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            Filtros de Búsqueda
          </h3>
          <div className="text-sm text-muted-foreground">
            {filteredCount} de {totalApplications} solicitudes
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
            >
              <Icon name="X" size={16} className="mr-2" />
              Limpiar
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Buscar por número de solicitud, referencia SAT o tipo..."
          value={filters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Advanced Filters */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${!isExpanded ? 'hidden md:grid' : ''}`}>
        <Select
          label="Estado"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          label="Tipo de Devolución"
          options={refundTypeOptions}
          value={filters?.refundType}
          onChange={(value) => handleFilterChange('refundType', value)}
        />

        <Select
          label="Fecha de Envío"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />

        <Select
          label="Rango de Monto"
          options={amountRangeOptions}
          value={filters?.amountRange}
          onChange={(value) => handleFilterChange('amountRange', value)}
        />
      </div>
      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground mr-2">Filtros rápidos:</span>
        
        <Button
          variant={filters?.status === 'requires_action' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('status', filters?.status === 'requires_action' ? '' : 'requires_action')}
        >
          <Icon name="AlertTriangle" size={14} className="mr-1" />
          Requieren Acción
        </Button>
        
        <Button
          variant={filters?.status === 'deposited' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('status', filters?.status === 'deposited' ? '' : 'deposited')}
        >
          <Icon name="CheckCircle" size={14} className="mr-1" />
          Completadas
        </Button>
        
        <Button
          variant={filters?.dateRange === 'last_month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('dateRange', filters?.dateRange === 'last_month' ? '' : 'last_month')}
        >
          <Icon name="Calendar" size={14} className="mr-1" />
          Último Mes
        </Button>
      </div>
    </div>
  );
};

export default TrackingFilters;