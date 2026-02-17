import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi } from '../api/client';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { value: '', label: 'Todas' },
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'pantalones', label: 'Pantalones' },
  { value: 'vestidos', label: 'Vestidos' },
  { value: 'abrigos', label: 'Abrigos' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'calzado', label: 'Calzado' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '36', '37', '38', '39', '40', '41', '42'];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [size, setSize] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (minPrice !== '') params.minPrice = minPrice;
    if (maxPrice !== '') params.maxPrice = maxPrice;
    if (size) params.size = size;
    if (search.trim()) params.search = search.trim();
    productsApi
      .getAll(params)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, minPrice, maxPrice, size, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-semibold text-brand-900 mb-8"
      >
        Catálogo
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-8"
      >
        <aside className="lg:w-64 shrink-0 space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">Buscar</label>
            <input
              type="search"
              placeholder="Nombre o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value || 'all'} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">Precio mín. (€)</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">Precio máx. (€)</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">Talle</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900 focus:border-transparent outline-none"
            >
              <option value="">Todos</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              setCategory('');
              setMinPrice('');
              setMaxPrice('');
              setSize('');
              setSearch('');
            }}
            className="text-sm text-brand-600 hover:text-brand-900 underline"
          >
            Limpiar filtros
          </button>
        </aside>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-brand-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {products.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-brand-600 py-12 text-center"
                >
                  No hay productos con esos filtros.
                </motion.p>
              ) : (
                <motion.div
                  key={`${category}-${minPrice}-${maxPrice}-${size}-${search}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                >
                  {products.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
