import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoginForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateRFC = (rfc) => {
    const rfcPattern = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
    return rfcPattern?.test(rfc?.toUpperCase());
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern?.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (name === 'email' && value) {
      if (!validateEmail(value) && !validateRFC(value)) {
        setErrors(prev => ({
          ...prev,
          email: 'Ingrese un email válido o RFC en formato correcto'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          email: ''
        }));
      }
    }

    if (name === 'password' && value) {
      if (value?.length < 8) {
        setErrors(prev => ({
          ...prev,
          password: 'La contraseña debe tener al menos 8 caracteres'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          password: ''
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email o RFC es requerido';
    } else if (!validateEmail(formData?.email) && !validateRFC(formData?.email)) {
      newErrors.email = 'Formato de email o RFC inválido';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors)?.length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Email o RFC"
          type="text"
          name="email"
          placeholder="ejemplo@correo.com o ABCD123456EF1"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          description="Ingrese su email registrado o RFC"
        />
      </div>
      <div>
        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Ingrese su contraseña"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            description="Mínimo 8 caracteres"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
          />
          <span className="ml-2 text-sm text-muted-foreground">Recordar sesión</span>
        </label>
        
        <a
          href="#"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="right"
      >
        Iniciar Sesión
      </Button>
    </form>
  );
};

export default LoginForm;