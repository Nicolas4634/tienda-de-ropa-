import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProductCard({ product, index = 0 }) {
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/producto/${product._id}`}
        className="group block"
      >
        <div className="aspect-[3/4] bg-brand-100 overflow-hidden rounded-lg mb-3 relative">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-brand-900 text-white text-xs font-medium px-2 py-1 rounded">
              Destacado
            </span>
          )}
        </div>
        <h3 className="font-medium text-brand-900 group-hover:underline underline-offset-2">
          {product.name}
        </h3>
        <p className="text-brand-600 mt-0.5 font-medium">
          €{product.price.toFixed(2)}
        </p>
      </Link>
    </motion.div>
  );
}
