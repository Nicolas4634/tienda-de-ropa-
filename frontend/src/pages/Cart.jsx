import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productsApi } from '../api/client';

export default function Cart() {
  const { user } = useAuth();
  const { getCartItems, updateQuantity, removeFromCart, cartCount, loading: cartLoading } = useCart();
  const [itemsWithProduct, setItemsWithProduct] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const navigate = useNavigate();

  const items = getCartItems();

  useEffect(() => {
    if (!user) {
      if (items.length && items[0].productId) {
        Promise.all(items.map((i) => productsApi.getById(i.productId)))
          .then((products) => {
            setItemsWithProduct(
              items.map((it, idx) => ({
                ...it,
                product: products[idx],
                itemId: `${it.productId}-${it.size}`,
              }))
            );
          })
          .catch(() => setItemsWithProduct([]))
          .finally(() => setLocalLoading(false));
      } else {
        setItemsWithProduct([]);
        setLocalLoading(false);
      }
      return;
    }
    setItemsWithProduct(
      (items || []).map((i) => ({
        ...i,
        product: i.product || { _id: i.product?._id, name: '', price: 0, images: [] },
        itemId: i._id,
      }))
    );
    setLocalLoading(false);
  }, [user, items, cartCount]);

  const loading = user ? cartLoading : localLoading;

  const total = itemsWithProduct.reduce(
    (sum, i) => sum + (i.product?.price || 0) * (i.quantity || 0),
    0
  );

  if (!user && items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto px-4 py-16 text-center"
      >
        <h1 className="text-2xl font-semibold text-brand-900 mb-4">Tu carrito está vacío</h1>
        <p className="text-brand-600 mb-6">
          Inicia sesión para guardar tu carrito o explora el catálogo para añadir productos.
        </p>
        <Link to="/catalogo" className="text-brand-900 font-medium underline">
          Ver catálogo
        </Link>
      </motion.div>
    );
  }

  if (cartCount === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto px-4 py-16 text-center"
      >
        <h1 className="text-2xl font-semibold text-brand-900 mb-4">Tu carrito está vacío</h1>
        <Link to="/catalogo" className="inline-block bg-brand-900 text-white font-medium px-6 py-2.5 rounded hover:bg-brand-800">
          Ver catálogo
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <h1 className="text-2xl md:text-3xl font-semibold text-brand-900 mb-8">
        Carrito ({cartCount} {cartCount === 1 ? 'producto' : 'productos'})
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-brand-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {itemsWithProduct.map((item) => (
            <motion.div
              key={item.itemId}
              layout
              className="flex gap-4 p-4 rounded-xl border border-brand-100 bg-white"
            >
              <div className="w-24 h-32 shrink-0 bg-brand-100 rounded-lg overflow-hidden">
                <img
                  src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200'}
                  alt={item.product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-brand-900">{item.product?.name}</h3>
                <p className="text-sm text-brand-600">Talle: {item.size}</p>
                <p className="font-medium text-brand-900 mt-1">
                  €{((item.product?.price || 0) * item.quantity).toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.itemId, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 rounded border border-brand-200 flex items-center justify-center text-brand-700 hover:bg-brand-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                    className="w-8 h-8 rounded border border-brand-200 flex items-center justify-center text-brand-700 hover:bg-brand-50"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.itemId)}
                    className="ml-4 text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-brand-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-brand-700 font-medium">Total</span>
          <span className="text-xl font-semibold text-brand-900">€{total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => (user ? navigate('/checkout') : navigate('/login'))}
          className="w-full md:w-auto bg-brand-900 text-white font-medium py-3 px-8 rounded-lg hover:bg-brand-800 transition-colors"
        >
          {user ? 'Proceder al pago' : 'Iniciar sesión para comprar'}
        </button>
      </div>
    </motion.div>
  );
}
