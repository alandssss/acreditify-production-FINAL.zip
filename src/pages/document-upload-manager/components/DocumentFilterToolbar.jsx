import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const DocumentFilterToolbar = ({ 
  onFilterChange, 
  totalDocuments, 
  filteredCount,
  onViewChange,
  currentView = 'grid'
}) => {
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateRange: '',
    searchTerm: ''
  });

  const documentTypeOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'cfdi', label: 'CFDI' },
    { value: 'bank_statement', label: 'Estados de cuenta' },
    { value: 'diot', label: 'DIOT' },
    { value: 'other', label: 'Otros documentos' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'validated', label: 'Validados' },
    { value: 'processing', label: 'Procesando' },
    { value: 'error', label: 'Con errores' },
    { value: 'pending', label: 'Pendientes' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'Todas las fechas' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'custom', label: 'Rango personalizado' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      type: '',
      status: '',
      dateRange: '',
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
          <div className="flex-1 max-w-xs">
            <Input
              type="search"
              placeholder="Buscar documentos..."
              value={filters?.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e?.target?.value)}
              className="w-full"
            />
          </div>

          <Select
            options={documentTypeOptions}
            value={filters?.type}
            onChange={(value) => handleFilterChange('type', value)}
            placeholder="Tipo de documento"
            className="w-full sm:w-48"
          />

          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Estado"
            className="w-full sm:w-40"
          />

          <Select
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
            placeholder="Fecha"
            className="w-full sm:w-40"
          />
        </div>

        {/* Actions and View Controls */}
        <div className="flex items-center justify-between lg:justify-end space-x-3">
          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            {filteredCount !== totalDocuments ? (
              <span>
                {filteredCount} de {totalDocuments} documentos
              </span>
            ) : (
              <span>{totalDocuments} documentos</span>
            )}
          </div>

          {/* Clear Filters */}
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

          {/* View Toggle */}
          <div className="flex items-center border border-border rounded-lg p-1">
            <Button
              variant={currentView === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('grid')}
              className="px-3"
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={currentView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('list')}
              className="px-3"
            >
              <Icon name="List" size={16} />
            </Button>
          </div>

          {/* Sort Options */}
          <div className="relative group">
            <Button variant="outline" size="sm">
              <Icon name="ArrowUpDown" size={16} className="mr-2" />
              Ordenar
              <Icon name="ChevronDown" size={14} className="ml-1" />
            </Button>
            
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <Icon name="Calendar" size={14} className="mr-2" />
                  Fecha de subida
                </button>
                <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <Icon name="FileText" size={14} className="mr-2" />
                  Nombre del archivo
                </button>
                <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <Icon name="HardDrive" size={14} className="mr-2" />
                  Tamaño del archivo
                </button>
                <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <Icon name="CheckCircle" size={14} className="mr-2" />
                  Estado de validación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtros activos:</span>
            
            {filters?.type && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                Tipo: {documentTypeOptions?.find(opt => opt?.value === filters?.type)?.label}
                <button
                  onClick={() => handleFilterChange('type', '')}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters?.status && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                Estado: {statusOptions?.find(opt => opt?.value === filters?.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters?.dateRange && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                Fecha: {dateRangeOptions?.find(opt => opt?.value === filters?.dateRange)?.label}
                <button
                  onClick={() => handleFilterChange('dateRange', '')}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters?.searchTerm && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                Búsqueda: "{filters?.searchTerm}"
                <button
                  onClick={() => handleFilterChange('searchTerm', '')}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentFilterToolbar;