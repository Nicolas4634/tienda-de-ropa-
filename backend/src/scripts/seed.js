import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';

const products = [
  {
    name: 'Camiseta Oversize Essential',
    description: 'Camiseta de algodón orgánico corte oversize. Cómoda y versátil para el día a día.',
    price: 29.99,
    category: 'camisetas',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
    featured: true,
    stock: 50,
  },
  {
    name: 'Pantalón Cargo Urban',
    description: 'Pantalón cargo con múltiples bolsillos. Tela resistente y diseño urbano.',
    price: 79.99,
    category: 'pantalones',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'],
    featured: true,
    stock: 30,
  },
  {
    name: 'Vestido Midi Minimal',
    description: 'Vestido midi de línea recta. Perfecto para ocasiones elegantes y casuales.',
    price: 89.99,
    category: 'vestidos',
    sizes: ['XS', 'S', 'M', 'L'],
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'],
    featured: true,
    stock: 25,
  },
  {
    name: 'Abrigo Lana Oversize',
    description: 'Abrigo de lana merino, corte oversize. Ideal para temporada fría.',
    price: 189.99,
    category: 'abrigos',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600'],
    featured: true,
    stock: 20,
  },
  {
    name: 'Sneakers Urban White',
    description: 'Zapatillas urbanas en blanco. Suela de goma y diseño atemporal.',
    price: 119.99,
    category: 'calzado',
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    featured: true,
    stock: 40,
  },
  {
    name: 'Camiseta Polo Classic',
    description: 'Polo clásico en algodón pima. Cuello ribeteado y botones.',
    price: 45.99,
    category: 'camisetas',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600'],
    featured: false,
    stock: 35,
  },
  {
    name: 'Chino Slim Fit',
    description: 'Pantalón chino slim fit. Tela stretch para mayor comodidad.',
    price: 69.99,
    category: 'pantalones',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'],
    featured: false,
    stock: 28,
  },
  {
    name: 'Cinturón Cuero Negro',
    description: 'Cinturón de cuero genuino, hebilla minimalista.',
    price: 39.99,
    category: 'accesorios',
    sizes: ['S', 'M', 'L'],
    images: ['https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=600'],
    featured: false,
    stock: 60,
  },
  {
    name: 'Chaqueta Bomber',
    description: 'Chaqueta bomber ligera. Interior forrado y cierre frontal.',
    price: 129.99,
    category: 'abrigos',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'],
    featured: false,
    stock: 22,
  },
  {
    name: 'Zapatillas Running',
    description: 'Zapatillas para running. Amortiguación y suela antideslizante.',
    price: 139.99,
    category: 'calzado',
    sizes: ['38', '39', '40', '41', '42'],
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'],
    featured: false,
    stock: 30,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);

    const adminExists = await User.findOne({ email: 'admin@tienda.com' });
    if (!adminExists) {
      await User.create({
        email: 'admin@tienda.com',
        password: 'admin123',
        name: 'Administrador',
        role: 'admin',
      });
      console.log('Usuario admin creado: admin@tienda.com / admin123');
    }

    console.log('Productos de ejemplo cargados:', products.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
