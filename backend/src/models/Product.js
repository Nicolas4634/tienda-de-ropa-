import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['camisetas', 'pantalones', 'vestidos', 'abrigos', 'accesorios', 'calzado'],
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', '36', '37', '38', '39', '40', '41', '42'],
  }],
  images: [{
    type: String,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Product', productSchema);
