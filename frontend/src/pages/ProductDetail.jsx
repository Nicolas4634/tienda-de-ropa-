import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsApi } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    productsApi
      .getById(id)
      .then((data) => {
        setProduct(data);
        if (data.sizes?.length) setSize(data.sizes[0]);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!size) return;
    try {
      await addToCart(product._id, quantity, size);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.message || 'Error al agregar');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-[3/4] bg-brand-100 rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-brand-100 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-brand-100 rounded w-1/2 animate-pulse" />
            <div className="h-24 bg-brand-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-brand-600 mb-4">Producto no encontrado.</p>
        <button onClick={() => navigate('/catalogo')} className="text-brand-900 font-medium underline">
          Volver al catálogo
        </button>
      </div>
    );
  }

  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="aspect-[3/4] bg-brand-100 rounded-xl overflow-hidden">
          <img src={image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-brand-900 mb-2">
            {product.name}
          </h1>
          <p className="text-xl font-medium text-brand-700 mb-6">
            €{product.price.toFixed(2)}
          </p>
          <p className="text-brand-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-brand-700 mb-2">Talle</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                    size === s
                      ? 'border-brand-900 bg-brand-900 text-white'
                      : 'border-brand-200 text-brand-700 hover:border-brand-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-brand-700 mb-2">Cantidad</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded border border-brand-200 flex items-center justify-center text-brand-700 hover:bg-brand-50"
              >
                −
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded border border-brand-200 flex items-center justify-center text-brand-700 hover:bg-brand-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!size || added}
              className="flex-1 bg-brand-900 text-white font-medium py-3 px-6 rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {added ? 'Añadido al carrito' : 'Añadir al carrito'}
            </button>
            {user && (
              <button
                onClick={async () => {
                  await addToCart(product._id, quantity, size);
                  navigate('/carrito');
                }}
                className="border border-brand-900 text-brand-900 font-medium py-3 px-6 rounded-lg hover:bg-brand-50 transition-colors"
              >
                Ir al carrito
              </button>
            )}
          </div>

          {!user && (
            <p className="mt-4 text-sm text-brand-500">
              Inicia sesión para guardar el carrito y finalizar la compra.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
