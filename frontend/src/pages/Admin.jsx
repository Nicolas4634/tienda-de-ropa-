import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi } from '../api/client';

const CATEGORIES = ['camisetas', 'pantalones', 'vestidos', 'abrigos', 'accesorios', 'calzado'];
const SIZES_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '36', '37', '38', '39', '40', '41', '42'];

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: 'camisetas',
  sizes: ['S', 'M', 'L'],
  images: [''],
  featured: false,
  stock: 0,
};

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [error, setError] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    productsApi.getAll().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  };

  useEffect(() => fetchProducts(), []);

  const openCreate = () => {
    setEditing('new');
    setForm(emptyProduct);
    setError('');
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      sizes: p.sizes?.length ? [...p.sizes] : ['S', 'M', 'L'],
      images: p.images?.length ? [...p.images] : [''],
      featured: !!p.featured,
      stock: p.stock ?? 0,
    });
    setError('');
  };

  const closeModal = () => {
    setEditing(null);
    setForm(emptyProduct);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSizesChange = (e) => {
    const opts = [...e.target.options];
    const selected = opts.filter((o) => o.selected).map((o) => o.value);
    setForm((prev) => ({ ...prev, sizes: selected.length ? selected : ['S'] }));
  };

  const handleImageChange = (idx, value) => {
    setForm((prev) => {
      const next = [...(prev.images || [''])];
      next[idx] = value;
      return { ...prev, images: next };
    });
  };

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...(prev.images || []), ''] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock, 10) || 0,
      images: form.images?.filter(Boolean) || [],
    };
    if (!payload.images.length) payload.images = ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'];
    try {
      if (editing === 'new') {
        await productsApi.create(payload);
      } else {
        await productsApi.update(editing, payload);
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await productsApi.delete(id);
      fetchProducts();
      closeModal();
    } catch (err) {
      setError(err.message || 'Error al eliminar');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-brand-900">
          Panel de administración
        </h1>
        <button
          onClick={openCreate}
          className="bg-brand-900 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-brand-800 transition-colors"
        >
          + Nuevo producto
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-brand-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-brand-200 rounded-lg overflow-hidden">
            <thead className="bg-brand-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-brand-700">Producto</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-brand-700">Categoría</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-brand-700">Precio</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-brand-700">Stock</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-brand-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-brand-100 hover:bg-brand-50/50">
                  <td className="py-3 px-4 text-brand-900 font-medium">{p.name}</td>
                  <td className="py-3 px-4 text-brand-600">{p.category}</td>
                  <td className="py-3 px-4 text-brand-600">€{p.price?.toFixed(2)}</td>
                  <td className="py-3 px-4 text-brand-600">{p.stock ?? 0}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-brand-700 hover:underline text-sm mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <h2 className="text-xl font-semibold text-brand-900 mb-4">
                {editing === 'new' ? 'Nuevo producto' : 'Editar producto'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Nombre</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-900 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Descripción</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-900 outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Precio (€)</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-900 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={handleChange}
                      className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-900 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Categoría</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-900 outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Talles (mantén Ctrl para varios)</label>
                  <select
                    multiple
                    value={form.sizes}
                    onChange={handleSizesChange}
                    className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-900 outline-none"
                  >
                    {SIZES_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">URLs de imágenes</label>
                  {(form.images || []).map((url, idx) => (
                    <input
                      key={idx}
                      value={url}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                      placeholder="https://..."
                      className="w-full border border-brand-200 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-brand-900 outline-none"
                    />
                  ))}
                  <button type="button" onClick={addImageField} className="text-sm text-brand-600 hover:underline">
                    + Añadir imagen
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="rounded border-brand-300"
                  />
                  <label htmlFor="featured" className="text-sm text-brand-700">Destacado</label>
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-900 text-white font-medium py-2.5 rounded-lg hover:bg-brand-800"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 border border-brand-200 rounded-lg text-brand-700 hover:bg-brand-50"
                  >
                    Cancelar
                  </button>
                  {editing !== 'new' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(editing)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
