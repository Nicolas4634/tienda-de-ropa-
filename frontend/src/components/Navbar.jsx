import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-brand-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="text-xl md:text-2xl font-semibold tracking-tight text-brand-900">
            STUDIO
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/catalogo"
              className="text-brand-600 hover:text-brand-900 transition-colors text-sm font-medium"
            >
              Catálogo
            </Link>
            <Link to="/carrito" className="relative p-2 -m-2 text-brand-600 hover:text-brand-900 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-900 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-brand-600 hover:text-brand-900 transition-colors text-sm font-medium"
                >
                  <span className="w-8 h-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  {user.name}
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-lg border border-brand-100"
                    >
                      <Link
                        to="/carrito"
                        className="block px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Mi carrito
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Panel admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
                      >
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-brand-600 hover:text-brand-900">
                  Entrar
                </Link>
                <Link
                  to="/registro"
                  className="text-sm font-medium bg-brand-900 text-white px-4 py-2 rounded hover:bg-brand-800 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-3">
            <Link to="/carrito" className="relative p-2 text-brand-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-brand-900 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-brand-600"
              aria-label="Menú"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-brand-100 py-4 space-y-2"
            >
              <Link to="/catalogo" className="block py-2 text-brand-700 font-medium" onClick={() => setMenuOpen(false)}>
                Catálogo
              </Link>
              <Link to="/carrito" className="block py-2 text-brand-700 font-medium" onClick={() => setMenuOpen(false)}>
                Carrito
              </Link>
              {user && (
                <Link to="/admin" className="block py-2 text-brand-700 font-medium" onClick={() => setMenuOpen(false)}>
                  Panel admin
                </Link>
              )}
              {user ? (
                <button onClick={handleLogout} className="block py-2 text-brand-700 font-medium w-full text-left">
                  Cerrar sesión
                </button>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-brand-700 font-medium" onClick={() => setMenuOpen(false)}>
                    Entrar
                  </Link>
                  <Link to="/registro" className="block py-2 text-brand-700 font-medium" onClick={() => setMenuOpen(false)}>
                    Registrarse
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
