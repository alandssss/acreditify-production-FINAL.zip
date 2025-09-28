import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const MaterialIcon = ({ name, className = "", style = {} }) => (
  <span className={`material-symbols-outlined ${className}`} style={style}>
    {name}
  </span>
);

const MainDashboard = () => {
  const { user, userProfile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock data matching the ZIP design exactly
  const [totalRecovered] = useState(12345.67);
  const [requestsInProcess] = useState(3);

  const recentRequests = [
    {
      id: 12345,
      amount: 2500.00,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnK59c3SxPqqds_hDUcM_8bBk0zqA3KWf2ndkC6pCqSgjgRmh-2SPpS1bcohq-f2RU2zPuD6i0sTquplspA1a4Z2uKWnO1y5tpGIE4tTwIpxnBvBCeziCCA_xNUpM6LQ_9WNKlhQL4-MVOiYxUnFRQlTgrrW_Y-gKn0ZTd91KtXWY-Hh2WhdcLYGVe5oLpY_dwvXC0pCElShXD84YRUgklnQBRUd7DwPNepo0pqZHtZh4DLrVdWhFV3XBthB-yajVSYSHDKFzL3Vo"
    },
    {
      id: 67890,
      amount: 1800.00,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6mGCu5CQIoJBfZifufBl5dKtlPLRIzO2qq3dp2e2A1huZaGsqETqAEwQD0vLRVBPSifSZ36WgCJ8dqL5DG68WqEauKo0FI4m6ADRDhd1aXvMm_lKBJzbmpyg9YQjDemPmBgsv6OP6LzKWhlLBvGJ_a1uiP--UpoDoUxVJ0-dvkGJz8us75v98zwJRWnNH9tWVl0Syk4aDx49TrEe4NOZZShEwPFLiWHqOBHIWI1OL1phq5wyuPR8oEFtgXqX_P4a1T0I4cvabKfQ"
    },
    {
      id: 11223,
      amount: 3200.00,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMlOldsYoTtdvi3_GDwV9NnKK5HdA-Ajixpr-pdeDJqcLS033YdFlroCwuEaBzHE9jTPbPF4F81sWnAwedQSIm6Ar3rBLC6Sl9yWzNtXq_0dWzLoHif7hs9VleeJF7DtOzub3YsJummnTVe7cVcd1n9Hk0cjl1Oj4Op60ztHwsTb-EF2XSOvAnIEMl6jqQa_QEEpX13gDFNLirVvrcq6LjVqFfWF6GCGI3K-cG2TtwMk-4aqslEI3KnOuSYboj0jxe0m4KKW82hRA"
    }
  ];

  const navigationItems = [
    { icon: 'home', label: 'Inicio', path: '/main-dashboard', active: true },
    { icon: 'description', label: 'Solicitudes', path: '/refund-request-wizard' },
    { icon: 'folder', label: 'Documentos', path: '/document-upload-manager' },
    { icon: 'bar_chart', label: 'Reportes', path: '/refund-status-tracking' },
    { icon: 'settings', label: 'Ajustes', path: '/user-registration' }
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
          <p className="text-subtle-light dark:text-subtle-dark">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleNewRequest = () => {
    navigate('/refund-request-wizard');
  };

  const handleUploadDocuments = () => {
    navigate('/document-upload-manager');
  };

  return (
    <div className={`flex flex-col min-h-screen justify-between font-display ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex-grow bg-background-light dark:bg-background-dark">
        {/* Header - Exactly like the ZIP */}
        <header className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark sticky top-0 z-10 border-b border-border-light dark:border-border-dark">
          <div className="w-12"></div>
          <h1 className="text-lg font-bold text-foreground-light dark:text-foreground-dark text-center flex-1">
            Inicio
          </h1>
          <button className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-primary/10 text-foreground-light dark:text-foreground-dark">
            <MaterialIcon name="notifications" />
          </button>
        </header>

        {/* Main Content - Exactly like the ZIP */}
        <main className="p-4 space-y-6">
          {/* Stats Section - Grid with 2 cards exactly as in ZIP */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg flex items-center space-x-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <MaterialIcon name="account_balance_wallet" className="text-primary text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">
                  ${totalRecovered.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">Total Recuperado</p>
              </div>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg flex items-center space-x-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <MaterialIcon name="hourglass_top" className="text-primary text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">
                  {requestsInProcess}
                </p>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">Solicitudes en Proceso</p>
              </div>
            </div>
          </section>

          {/* Recent Requests - Horizontal scroll exactly like ZIP */}
          <section>
            <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-4">
              Solicitudes Recientes
            </h2>
            <div className="flex overflow-x-auto space-x-4 pb-4" style={{
              msScrollbarStyle: 'none',
              scrollbarWidth: 'none'
            }}>
              {recentRequests.map((request) => (
                <div key={request.id} className="flex-shrink-0 w-40 space-y-2">
                  <div
                    className="w-full aspect-square bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url("${request.image}")` }}
                  ></div>
                  <div>
                    <p className="font-medium text-foreground-light dark:text-foreground-dark">
                      Solicitud #{request.id}
                    </p>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">
                      ${request.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions - 2 buttons exactly like ZIP */}
          <section>
            <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-4">
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleNewRequest}
                className="w-full h-12 px-4 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Nueva Solicitud
              </button>
              <button
                onClick={handleUploadDocuments}
                className="w-full h-12 px-4 rounded-lg bg-primary/20 dark:bg-primary/30 text-primary font-bold text-sm hover:bg-primary/30 dark:hover:bg-primary/40 transition-colors"
              >
                Subir Documentos
              </button>
            </div>
          </section>

          {/* Chart Section - Exactly like ZIP with SVG */}
          <section className="bg-card-light dark:bg-card-dark p-4 rounded-lg">
            <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-4">
              Devoluciones a lo largo del tiempo
            </h2>
            <div>
              <p className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">
                ${totalRecovered.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-subtle-light dark:text-subtle-dark">Este año</p>
                <p className="text-sm font-medium text-success-light dark:text-success-dark">+15%</p>
              </div>
            </div>

            {/* SVG Chart - Exact copy from ZIP */}
            <div className="mt-4">
              <svg
                fill="none"
                height="150"
                preserveAspectRatio="none"
                viewBox="0 0 472 150"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="chartGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="150"
                  >
                    <stop stopColor="#067aef" stopOpacity="0.3"></stop>
                    <stop offset="1" stopColor="#067aef" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V150H0V109Z"
                  fill="url(#chartGradient)"
                ></path>
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                  stroke="#067aef"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></path>
              </svg>
            </div>

            {/* Month labels - Exactly like ZIP */}
            <div className="flex justify-around mt-2">
              {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map(month => (
                <p key={month} className="text-xs font-medium text-subtle-light dark:text-subtle-dark">
                  {month}
                </p>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Bottom Navigation - Exactly like ZIP */}
      <footer className="sticky bottom-0 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark py-2 px-4">
        <nav className="flex justify-around">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              className={`flex flex-col items-center gap-1 ${
                item.active
                  ? 'text-primary'
                  : 'text-subtle-light dark:text-subtle-dark'
              }`}
            >
              <MaterialIcon
                name={item.icon}
                style={!item.active ? { fontVariationSettings: "'FILL' 0" } : {}}
              />
              <p className="text-xs font-medium">{item.label}</p>
            </button>
          ))}
        </nav>
      </footer>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .flex.overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MainDashboard;