import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const MaterialIcon = ({ name, className = "", style = {} }) => (
  <span className={`material-symbols-outlined ${className}`} style={style}>
    {name}
  </span>
);

const TimelineItem = ({ status, date, isCompleted, isActive, isLast }) => (
  <div className={`timeline-item relative ${!isLast ? 'pb-6' : ''}`}>
    <div className={`timeline-dot ${isCompleted || isActive ? 'bg-primary/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
      <div className={`timeline-dot-inner ${isCompleted || isActive ? 'bg-primary' : 'bg-gray-400 dark:bg-gray-500'}`}></div>
    </div>
    <p className={`font-semibold ${isCompleted || isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}>
      {status}
    </p>
    {date && <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>}
  </div>
);

const RefundStatusTracking = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Mock data for active requests
  const activeRequests = [
    {
      id: 'MX-001234',
      type: 'Solicitud de IVA',
      amount: 2450.00,
      amountColor: 'text-primary',
      timeline: [
        { status: 'Enviada', date: '15 de mayo de 2024', isCompleted: true },
        { status: 'En Revisión', date: null, isActive: true },
        { status: 'Aprobada', date: null, isCompleted: false }
      ]
    },
    {
      id: 'MX-001230',
      type: 'Solicitud de ISR',
      amount: 1800.50,
      amountColor: 'text-primary',
      timeline: [
        { status: 'Enviada', date: '20 de abril de 2024', isCompleted: true },
        { status: 'En Revisión', date: '22 de abril de 2024', isCompleted: true },
        { status: 'Aprobada', date: null, isCompleted: false }
      ]
    },
    {
      id: 'MX-001225',
      type: 'Solicitud de IVA',
      amount: 3120.75,
      amountColor: 'text-green-600 dark:text-green-500',
      timeline: [
        { status: 'Enviada', date: '10 de marzo de 2024', isCompleted: true },
        { status: 'En Revisión', date: '12 de marzo de 2024', isCompleted: true },
        { status: 'Aprobada', date: '15 de marzo de 2024', isCompleted: true }
      ]
    }
  ];

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/main-dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-700 dark:text-gray-300"
          >
            <MaterialIcon name="arrow_back_ios_new" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white flex-1 text-center">
            Solicitudes
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Solicitudes Activas
        </h2>

        {/* Requests List */}
        <div className="space-y-4">
          {activeRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white dark:bg-background-dark dark:border dark:border-gray-700 rounded-xl shadow-sm p-4"
            >
              {/* Request Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {request.type}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    #{request.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Monto
                  </p>
                  <p className={`text-lg font-bold ${request.amountColor}`}>
                    ${request.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="timeline">
                {request.timeline.map((item, index) => (
                  <TimelineItem
                    key={index}
                    status={item.status}
                    date={item.date}
                    isCompleted={item.isCompleted}
                    isActive={item.isActive}
                    isLast={index === request.timeline.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Message */}
        {activeRequests.length === 0 && (
          <div className="text-center py-12">
            <MaterialIcon name="description" className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No tienes solicitudes activas
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Crea tu primera solicitud de devolución
            </p>
            <button
              onClick={() => navigate('/refund-request-wizard')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Nueva Solicitud
            </button>
          </div>
        )}
      </main>

      {/* Timeline CSS */}
      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 2rem;
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: 0.5rem;
          top: 0.5rem;
          width: 1px;
          height: calc(100% - 1rem);
          background-color: #e5e7eb;
        }
        .dark .timeline-item::before {
          background-color: #374151;
        }
        .timeline-item:last-child::before {
          display: none;
        }
        .timeline-dot {
          position: absolute;
          left: 0;
          top: 0.5rem;
          transform: translateY(-50%);
          width: 1rem;
          height: 1rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .timeline-dot-inner {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
};

export default RefundStatusTracking;