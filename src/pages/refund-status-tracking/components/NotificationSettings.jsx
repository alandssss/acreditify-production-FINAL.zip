import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationSettings = ({ isVisible, onClose }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    statusUpdates: true,
    deadlineReminders: true,
    documentValidation: true,
    depositConfirmation: true,
    rejectionAlerts: true,
    reminderFrequency: 'daily',
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00'
  });

  if (!isVisible) return null;

  const frequencyOptions = [
    { value: 'immediate', label: 'Inmediato' },
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save notification settings
    console.log('Saving notification settings:', settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-120 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Configuración de Notificaciones
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Notification Channels */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              Canales de Notificación
            </h3>
            <div className="space-y-3">
              <Checkbox
                label="Notificaciones por Email"
                description="Recibir actualizaciones por correo electrónico"
                checked={settings?.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e?.target?.checked)}
              />
              
              <Checkbox
                label="Notificaciones SMS"
                description="Recibir mensajes de texto para actualizaciones críticas"
                checked={settings?.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e?.target?.checked)}
              />
              
              <Checkbox
                label="Notificaciones Push"
                description="Recibir notificaciones en el navegador"
                checked={settings?.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Notification Types */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              Tipos de Notificación
            </h3>
            <div className="space-y-3">
              <Checkbox
                label="Actualizaciones de Estado"
                description="Cambios en el estado de las solicitudes"
                checked={settings?.statusUpdates}
                onChange={(e) => handleSettingChange('statusUpdates', e?.target?.checked)}
              />
              
              <Checkbox
                label="Recordatorios de Fechas Límite"
                description="Alertas antes de vencimientos importantes"
                checked={settings?.deadlineReminders}
                onChange={(e) => handleSettingChange('deadlineReminders', e?.target?.checked)}
              />
              
              <Checkbox
                label="Validación de Documentos"
                description="Resultados de validación de documentos"
                checked={settings?.documentValidation}
                onChange={(e) => handleSettingChange('documentValidation', e?.target?.checked)}
              />
              
              <Checkbox
                label="Confirmación de Depósito"
                description="Notificación cuando se complete el depósito"
                checked={settings?.depositConfirmation}
                onChange={(e) => handleSettingChange('depositConfirmation', e?.target?.checked)}
              />
              
              <Checkbox
                label="Alertas de Rechazo"
                description="Notificación inmediata si una solicitud es rechazada"
                checked={settings?.rejectionAlerts}
                onChange={(e) => handleSettingChange('rejectionAlerts', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Frequency Settings */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              Frecuencia de Recordatorios
            </h3>
            <Select
              label="Frecuencia de Recordatorios"
              description="Con qué frecuencia recibir recordatorios de seguimiento"
              options={frequencyOptions}
              value={settings?.reminderFrequency}
              onChange={(value) => handleSettingChange('reminderFrequency', value)}
            />
          </div>

          {/* Quiet Hours */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              Horario de Silencio
            </h3>
            <div className="space-y-4">
              <Checkbox
                label="Activar Horario de Silencio"
                description="No recibir notificaciones durante ciertas horas"
                checked={settings?.quietHours}
                onChange={(e) => handleSettingChange('quietHours', e?.target?.checked)}
              />
              
              {settings?.quietHours && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Hora de Inicio
                    </label>
                    <input
                      type="time"
                      value={settings?.quietStart}
                      onChange={(e) => handleSettingChange('quietStart', e?.target?.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Hora de Fin
                    </label>
                    <input
                      type="time"
                      value={settings?.quietEnd}
                      onChange={(e) => handleSettingChange('quietEnd', e?.target?.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Test Notification */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Probar Notificaciones</h4>
                <p className="text-sm text-muted-foreground">
                  Enviar una notificación de prueba para verificar la configuración
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Icon name="Send" size={16} className="mr-2" />
                Enviar Prueba
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleSave}>
            <Icon name="Save" size={16} className="mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;