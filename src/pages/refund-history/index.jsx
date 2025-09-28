import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MaterialIcon = ({ name, className = "", style = {} }) => (
  <span className={`material-symbols-outlined ${className}`} style={style}>
    {name}
  </span>
);

const RefundHistory = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    year: '2024',
    type: 'Todos',
    status: 'Aprobada'
  });

  // Mock data para el historial
  const historicalRequests = [
    {
      id: '12345',
      type: 'IVA',
      date: '15/03/2024',
      amount: 1200.00,
      status: 'Aprobada'
    },
    {
      id: '12344',
      type: 'ISR',
      date: '12/02/2024',
      amount: 800.00,
      status: 'Aprobada'
    },
    {
      id: '12343',
      type: 'IVA',
      date: '20/01/2024',
      amount: 1500.00,
      status: 'Rechazada'
    },
    {
      id: '12342',
      type: 'ISR',
      date: '05/01/2024',
      amount: 1000.00,
      status: 'Aprobada'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprobada':
        return 'text-green-500 bg-green-100 dark:bg-green-900/50 dark:text-green-400';
      case 'Rechazada':
        return 'text-red-500 bg-red-100 dark:bg-red-900/50 dark:text-red-400';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/50 dark:text-gray-400';
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-primary/20 dark:border-primary/30">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-black dark:text-white"
          >
            <MaterialIcon name="arrow_back" />
          </button>
          <h1 className="text-lg font-bold text-black dark:text-white flex-1 text-center">
            Solicitudes Pasadas
          </h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Filter Bar */}
        <div className="flex items-center space-x-2 pb-2 overflow-x-auto">
          <button className="flex items-center justify-center gap-x-2 h-10 px-4 rounded-full bg-primary/20 dark:bg-primary/30 text-black dark:text-white text-sm font-medium whitespace-nowrap">
            <span>2024</span>
            <MaterialIcon name="expand_more" className="text-base" />
          </button>
          <button className="flex items-center justify-center gap-x-2 h-10 px-4 rounded-full bg-primary/20 dark:bg-primary/30 text-black dark:text-white text-sm font-medium whitespace-nowrap">
            <span>IVA</span>
            <MaterialIcon name="expand_more" className="text-base" />
          </button>
          <button className="flex items-center justify-center gap-x-2 h-10 px-4 rounded-full bg-primary text-white text-sm font-medium whitespace-nowrap">
            <span>Aprobada</span>
            <MaterialIcon name="expand_more" className="text-base" />
          </button>
          <button className="flex items-center justify-center gap-x-2 h-10 px-4 rounded-full bg-primary/20 dark:bg-primary/30 text-black dark:text-white text-sm font-medium whitespace-nowrap">
            <span>Rechazada</span>
            <MaterialIcon name="expand_more" className="text-base" />
          </button>
        </div>

        {/* Request Cards */}
        <div className="space-y-3">
          {historicalRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white dark:bg-background-dark/50 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-black dark:text-white">
                  Solicitud #{request.id}
                </p>
                <p className="text-sm text-black/60 dark:text-white/60">
                  {request.type} - {request.date}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-primary">
                  ${request.amount.toFixed(2)}
                </p>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-primary/20 dark:border-primary/30">
        <div className="flex justify-around p-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center justify-center w-1/5 gap-1 text-black/60 dark:text-white/60"
          >
            <MaterialIcon name="home" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => navigate('/refund-status-tracking')}
            className="flex flex-col items-center justify-center w-1/5 gap-1 text-primary"
          >
            <div className="relative">
              <MaterialIcon name="description" />
            </div>
            <span className="text-xs font-medium">Solicitudes</span>
          </button>
          <button className="flex flex-col items-center justify-center w-1/5 gap-1 text-black/60 dark:text-white/60">
            <MaterialIcon name="folder" />
            <span className="text-xs font-medium">Documentos</span>
          </button>
          <button className="flex flex-col items-center justify-center w-1/5 gap-1 text-black/60 dark:text-white/60">
            <MaterialIcon name="analytics" />
            <span className="text-xs font-medium">Reportes</span>
          </button>
          <button className="flex flex-col items-center justify-center w-1/5 gap-1 text-black/60 dark:text-white/60">
            <MaterialIcon name="settings" />
            <span className="text-xs font-medium">Ajustes</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default RefundHistory;