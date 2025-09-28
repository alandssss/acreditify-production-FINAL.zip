import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { UserGuidanceTooltip } from './EnhancedUXComponents';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTooltips, setShowTooltips] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Inicio',
      path: '/',
      icon: 'Home',
      tooltip: 'Panel principal con resumen de solicitudes y métricas de devolución'
    },
    {
      label: 'Nueva Solicitud',
      path: '/refund-request-wizard',
      icon: 'FileText',
      tooltip: 'Asistente paso a paso para crear una nueva solicitud de devolución de impuestos'
    },
    {
      label: 'Documentos',
      path: '/document-upload-manager',
      icon: 'Upload',
      tooltip: 'Sube, organiza y valida tus documentos fiscales con OCR automático'
    },
    {
      label: 'Seguimiento',
      path: '/refund-status-tracking',
      icon: 'Search',
      tooltip: 'Monitorea el estado de tus solicitudes en tiempo real con el SAT'
    }
  ];

  const secondaryItems = [
    {
      label: 'Verificación',
      path: '/compliance-verification',
      icon: 'Shield',
      tooltip: 'Valida el cumplimiento de tus documentos con las regulaciones SAT'
    },
    {
      label: 'Preparación',
      path: '/submission-preparation',
      icon: 'CheckCircle',
      tooltip: 'Revisa y prepara tu solicitud final antes del envío oficial'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location?.pathname === '/';
    }
    return location?.pathname?.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleItemHover = (itemLabel) => {
    if (showTooltips) {
      setActiveTooltip(itemLabel);
    }
  };

  const handleItemLeave = () => {
    setActiveTooltip(null);
  };

  return (
    <header className="sticky top-0 z-100 bg-card border-b border-border">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Icon name="Calculator" size={24} color="white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-foreground">DevoluSAT AI</h1>
                <p className="text-xs text-muted-foreground">Sistema de Devoluciones</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation with Enhanced Tooltips */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <div 
                key={item?.path}
                className="relative"
                onMouseEnter={() => handleItemHover(item?.label)}
                onMouseLeave={handleItemLeave}
              >
                <a
                  href={item?.path}
                  className={`nav-item relative ${isActivePath(item?.path) ? 'active' : ''}`}
                  title={item?.tooltip}
                >
                  <Icon name={item?.icon} size={18} className="mr-2" />
                  {item?.label}
                  
                  {/* Enhanced active indicator */}
                  {isActivePath(item?.path) && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
                  )}
                </a>

                {/* Enhanced Tooltip */}
                <UserGuidanceTooltip
                  title={item?.label}
                  content={item?.tooltip}
                  position="bottom"
                  isVisible={activeTooltip === item?.label}
                  onClose={() => setActiveTooltip(null)}
                />
              </div>
            ))}
            
            {/* More Menu with Enhanced Dropdown */}
            <div className="relative group">
              <button className="nav-item flex items-center">
                <Icon name="MoreHorizontal" size={18} className="mr-2" />
                Más
                <Icon name="ChevronDown" size={16} className="ml-1 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              
              <div className="absolute right-0 top-full mt-1 w-56 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-110">
                <div className="py-2">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                    Herramientas Avanzadas
                  </div>
                  {secondaryItems?.map((item) => (
                    <a
                      key={item?.path}
                      href={item?.path}
                      className={`flex items-start px-4 py-3 text-sm hover:bg-muted transition-colors group/item ${
                        isActivePath(item?.path) ? 'bg-primary/10 text-primary' : 'text-foreground'
                      }`}
                      title={item?.tooltip}
                    >
                      <Icon name={item?.icon} size={16} className="mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{item?.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                          {item?.tooltip}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Enhanced User Actions */}
          <div className="flex items-center space-x-3">
            {/* Help Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex"
              onClick={() => setShowTooltips(!showTooltips)}
            >
              <Icon name={showTooltips ? "HelpCircle" : "Info"} size={18} className="mr-2" />
              {showTooltips ? 'Ocultar ayuda' : 'Mostrar ayuda'}
            </Button>

            <Button variant="ghost" size="sm" className="hidden md:flex relative">
              <Icon name="Bell" size={18} className="mr-2" />
              Notificaciones
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">2</span>
              </div>
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">Juan Pérez</p>
                <p className="text-xs text-muted-foreground">Persona Física</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border">
            <nav className="px-4 py-2 space-y-1">
              {navigationItems?.map((item) => (
                <a
                  key={item?.path}
                  href={item?.path}
                  className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon name={item?.icon} size={18} className="mr-3" />
                  <div>
                    <div>{item?.label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{item?.tooltip}</div>
                  </div>
                </a>
              ))}
              
              <div className="border-t border-border pt-2 mt-2">
                <p className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Herramientas
                </p>
                {secondaryItems?.map((item) => (
                  <a
                    key={item?.path}
                    href={item?.path}
                    className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon name={item?.icon} size={18} className="mr-3" />
                    <div>
                      <div>{item?.label}</div>
                      <div className="text-xs opacity-70 mt-0.5">{item?.tooltip}</div>
                    </div>
                  </a>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Add custom navigation styles */}
      <style jsx>{`
        .nav-item {
          @apply px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative;
          @apply text-muted-foreground hover:text-foreground hover:bg-muted/50;
        }
        .nav-item.active {
          @apply text-primary bg-primary/10;
        }
        .nav-item:hover {
          @apply transform scale-105;
        }
      `}</style>
    </header>
  );
};

export default Header;