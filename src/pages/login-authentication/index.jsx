import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Calculator, Eye, EyeOff, Shield, Lock, Mail, User, AlertCircle, CheckCircle, Copy } from 'lucide-react';

const LoginAuthentication = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  // Demo credentials from the migration
  const demoCredentials = [
    { email: 'admin@devolusat.mx', password: 'admin123', role: 'Administrador' },
    { email: 'usuario@ejemplo.mx', password: 'usuario123', role: 'Contribuyente' }
  ];

  // Redirect if already logged in
  if (user && !loading) {
    return <Navigate to="/main-dashboard" replace />;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData?.email || !formData?.password) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (isSignUp) {
      if (!formData?.fullName) {
        setError('El nombre completo es requerido');
        return;
      }
      if (formData?.password !== formData?.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (formData?.password?.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      // Sign up
      const { error: signUpError } = await signUp(formData?.email, formData?.password, {
        fullName: formData?.fullName
      });

      if (signUpError) {
        setError(signUpError);
      } else {
        setSuccess('Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.');
      }
    } else {
      // Sign in
      const { error: signInError } = await signIn(formData?.email, formData?.password);

      if (signInError) {
        if (signInError?.includes('Invalid login credentials')) {
          setError('Credenciales inválidas. Verifica tu email y contraseña.');
        } else if (signInError?.includes('Failed to fetch') || signInError?.includes('AuthRetryableFetchError')) {
          setError('No se puede conectar al servicio de autenticación. Tu proyecto de Supabase puede estar pausado o inactivo. Por favor revisa tu panel de Supabase y reanuda tu proyecto si es necesario.');
        } else {
          setError(signInError);
        }
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator?.clipboard?.writeText(text);
  };

  const fillDemoCredentials = (email, password) => {
    setFormData({
      ...formData,
      email,
      password
    });
    setError('');
  };

  const createDemoAccountIfNeeded = async (email, password, role) => {
    try {
      // Intenta crear la cuenta de demostración
      const { error: signUpError } = await signUp(email, password, {
        fullName: role === 'Administrador' ? 'Administrador Demo' : 'Usuario Demo'
      });

      if (signUpError && !signUpError.includes('User already registered')) {
        console.warn('Error creating demo account:', signUpError);
        return false;
      }

      // Esperar un momento para que se complete el registro
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ahora intentar hacer login
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        console.warn('Error signing in after account creation:', signInError);
        return false;
      }

      return true;
    } catch (err) {
      console.warn('Error in demo account creation:', err);
      return false;
    }
  };

  const handleDemoLogin = async (email, password, role) => {
    setError('');
    setSuccess('');

    // Primero intentar login normal
    const { error: signInError } = await signIn(email, password);

    if (!signInError) {
      // Login exitoso
      return;
    }

    if (signInError?.includes('Invalid login credentials')) {
      // Si las credenciales son inválidas, intentar crear la cuenta demo
      setSuccess(`Creando cuenta de demostración para ${role}...`);
      const success = await createDemoAccountIfNeeded(email, password, role);

      if (!success) {
        setError(`No se pudo crear la cuenta de demostración. Puedes registrarte manualmente con el email: ${email}`);
      }
    } else {
      setError(signInError);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-8 mx-auto">
            <Calculator className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            DevoluSAT AI
          </h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            La plataforma más avanzada para gestionar tus devoluciones de impuestos en México
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-300" />
              <span className="text-blue-100">Validación automática de documentos</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="text-blue-100">Cumplimiento total con el SAT</span>
            </div>
            <div className="flex items-center space-x-3">
              <Lock className="w-6 h-6 text-green-300" />
              <span className="text-blue-100">Seguridad bancaria en tus datos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">DevoluSAT AI</h2>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSignUp 
                ? 'Únete a miles de contribuyentes que ya confían en nosotros' :'Accede a tu panel de devoluciones'
              }
            </p>
          </div>

          {/* Demo credentials section */}
          {!isSignUp && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-amber-800 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Credenciales de Demostración
                </h3>
                <button
                  onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                  className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                >
                  {showDemoCredentials ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              
              {showDemoCredentials && (
                <div className="space-y-2">
                  {demoCredentials?.map((cred, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-amber-700">{cred?.role}</span>
                        <div className="space-x-2">
                          <button
                            onClick={() => fillDemoCredentials(cred?.email, cred?.password)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Llenar
                          </button>
                          <button
                            onClick={() => handleDemoLogin(cred?.email, cred?.password, cred?.role)}
                            className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                          >
                            Login
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Email: {cred?.email}</span>
                          <button
                            onClick={() => copyToClipboard(cred?.email)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Contraseña: {cred?.password}</span>
                          <button
                            onClick={() => copyToClipboard(cred?.password)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error/Success messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={isSignUp}
                    value={formData?.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData?.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData?.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required={isSignUp}
                    value={formData?.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirma tu contraseña"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Procesando...
                </div>
              ) : (
                isSignUp ? 'Crear cuenta' : 'Iniciar sesión'
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                  setFormData({
                    email: '',
                    password: '',
                    fullName: '',
                    confirmPassword: ''
                  });
                }}
                className="ml-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
              >
                {isSignUp ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>

          {/* Additional info */}
          <div className="text-center text-xs text-gray-500">
            <p>Al registrarte, aceptas nuestros términos de servicio y política de privacidad.</p>
            <p className="mt-2">Sistema certificado por el SAT para devoluciones fiscales.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAuthentication;