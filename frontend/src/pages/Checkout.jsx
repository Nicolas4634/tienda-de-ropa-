import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/client';

export default function Checkout() {
  const { getCartItems, clearCart, fetchCart } = useCart();
  const [address, setAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'España',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const items = getCartItems();
  const total = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * (i.quantity || 0),
    0
  );

  const handleChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.fullName || !address.address || !address.city || !address.postalCode || !address.country) {
      setError('Completa todos los campos de la dirección.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await ordersApi.create({ shippingAddress: address });
      await clearCart();
      navigate('/');
      // En una app real aquí irías a una página de confirmación
    } catch (err) {
      setError(err.message || 'Error al crear el pedido.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-brand-600 mb-4">No hay productos en el carrito.</p>
        <button onClick={() => navigate('/catalogo')} className="text-brand-900 font-medium underline">
          Ir al catálogo
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <h1 className="text-2xl md:text-3xl font-semibold text-brand-900 mb-8">
        Checkout
      </h1>

      <div className="mb-8 p-4 rounded-xl bg-brand-50 border border-brand-100">
        <h2 className="font-medium text-brand-900 mb-2">Resumen</h2>
        <p className="text-sm text-brand-600">
          {items.length} {items.length === 1 ? 'producto' : 'productos'} — Total €{total.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Nombre completo</label>
          <input
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Dirección</label>
          <input
            name="address"
            value={address.address}
            onChange={handleChange}
            className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Ciudad</label>
            <input
              name="city"
              value={address.city}
              onChange={handleChange}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Código postal</label>
            <input
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">País</label>
          <input
            name="country"
            value={address.country}
            onChange={handleChange}
            className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-900 text-white font-medium py-3 rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-70"
        >
          {loading ? 'Procesando...' : 'Confirmar pedido'}
        </button>
      </form>
    </motion.div>
  );
}
