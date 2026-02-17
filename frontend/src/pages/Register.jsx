import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[70vh] flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-brand-900 mb-2">Crear cuenta</h1>
        <p className="text-brand-600 mb-8">Regístrate para guardar tu carrito y comprar</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-brand-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brand-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Contraseña (mín. 6)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-brand-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
              required
              minLength={6}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-900 text-white font-medium py-3 rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-70"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-6 text-center text-brand-600 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand-900 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
