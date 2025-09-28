import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const ExportReportModal = ({ isVisible, onClose, applications }) => {
  const [exportSettings, setExportSettings] = useState({
    format: 'pdf',
    includeTimeline: true,
    includeDocuments: false,
    includeSummary: true,
    dateRange: 'all',
    status: 'all',
    groupBy: 'status'
  });

  const [isExporting, setIsExporting] = useState(false);

  if (!isVisible) return null;

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel (XLSX)' },
    { value: 'csv', label: 'CSV' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Todas las Fechas' },
    { value: 'last_month', label: 'Último Mes' },
    { value: 'last_3_months', label: 'Últimos 3 Meses' },
    { value: 'last_6_months', label: 'Últimos 6 Meses' },
    { value: 'last_year', label: 'Último Año' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'submitted', label: 'Enviadas' },
    { value: 'under_review', label: 'En Revisión' },
    { value: 'approved', label: 'Aprobadas' },
    { value: 'deposited', label: 'Depositadas' },
    { value: 'rejected', label: 'Rechazadas' }
  ];

  const groupByOptions = [
    { value: 'status', label: 'Por Estado' },
    { value: 'type', label: 'Por Tipo de Devolución' },
    { value: 'date', label: 'Por Fecha' },
    { value: 'amount', label: 'Por Monto' }
  ];

  const handleSettingChange = (key, value) => {
    setExportSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock download
      const filename = `reporte-devoluciones-${new Date()?.toISOString()?.split('T')?.[0]}.${exportSettings?.format}`;
      console.log('Exporting report:', filename, exportSettings);
      
      // In a real implementation, this would generate and download the actual file
      alert(`Reporte exportado: ${filename}`);
      
      onClose();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getFilteredApplicationsCount = () => {
    // Mock filtering logic
    let count = applications?.length;
    if (exportSettings?.status !== 'all') {
      count = Math.floor(count * 0.7); // Simulate filtering
    }
    if (exportSettings?.dateRange !== 'all') {
      count = Math.floor(count * 0.8); // Simulate date filtering
    }
    return count;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-120 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Exportar Reporte
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <Select
              label="Formato de Exportación"
              description="Selecciona el formato del archivo a exportar"
              options={formatOptions}
              value={exportSettings?.format}
              onChange={(value) => handleSettingChange('format', value)}
            />
          </div>

          {/* Content Options */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              Contenido del Reporte
            </h3>
            <div className="space-y-3">
              <Checkbox
                label="Incluir Resumen Ejecutivo"
                description="Estadísticas generales y métricas clave"
                checked={exportSettings?.includeSummary}
                onChange={(e) => handleSettingChange('includeSummary', e?.target?.checked)}
              />
              
              <Checkbox
                label="Incluir Línea de Tiempo"
                description="Historial detallado de cambios de estado"
                checked={exportSettings?.includeTimeline}
                onChange={(e) => handleSettingChange('includeTimeline', e?.target?.checked)}
              />
              
              <Checkbox
                label="Incluir Lista de Documentos"
                description="Detalles de documentos adjuntos y su estado"
                checked={exportSettings?.includeDocuments}
                onChange={(e) => handleSettingChange('includeDocuments', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Filters */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              Filtros de Datos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Rango de Fechas"
                options={dateRangeOptions}
                value={exportSettings?.dateRange}
                onChange={(value) => handleSettingChange('dateRange', value)}
              />

              <Select
                label="Estado de Solicitudes"
                options={statusOptions}
                value={exportSettings?.status}
                onChange={(value) => handleSettingChange('status', value)}
              />
            </div>
          </div>

          {/* Grouping */}
          <div>
            <Select
              label="Agrupar Por"
              description="Cómo organizar los datos en el reporte"
              options={groupByOptions}
              value={exportSettings?.groupBy}
              onChange={(value) => handleSettingChange('groupBy', value)}
            />
          </div>

          {/* Preview Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="font-medium text-foreground">Vista Previa del Reporte</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Formato: {formatOptions?.find(f => f?.value === exportSettings?.format)?.label}</p>
              <p>• Solicitudes incluidas: {getFilteredApplicationsCount()}</p>
              <p>• Período: {dateRangeOptions?.find(d => d?.value === exportSettings?.dateRange)?.label}</p>
              <p>• Agrupación: {groupByOptions?.find(g => g?.value === exportSettings?.groupBy)?.label}</p>
            </div>
          </div>

          {/* File Size Warning */}
          {exportSettings?.includeDocuments && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="font-medium text-warning">Advertencia</span>
              </div>
              <p className="text-sm text-warning mt-1">
                Incluir documentos puede generar un archivo muy grande. 
                El tiempo de exportación será mayor.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancelar
          </Button>
          <Button 
            variant="default" 
            onClick={handleExport}
            disabled={isExporting}
            loading={isExporting}
          >
            <Icon name="Download" size={16} className="mr-2" />
            {isExporting ? 'Exportando...' : 'Exportar Reporte'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportReportModal;