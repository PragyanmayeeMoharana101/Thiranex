import os

base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, "backend")

# Create directories
os.makedirs(os.path.join(backend_dir, "config"), exist_ok=True)
os.makedirs(os.path.join(backend_dir, "controllers"), exist_ok=True)
os.makedirs(os.path.join(backend_dir, "models"), exist_ok=True)
os.makedirs(os.path.join(backend_dir, "routes"), exist_ok=True)
os.makedirs(os.path.join(backend_dir, "middleware"), exist_ok=True)

# Write files
files_to_write = {
    "config/db.js": """import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
""",
    "models/userModel.js": """import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false }
}, { timestamps: true });

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
""",
    "models/productModel.js": """import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
""",
    "controllers/productController.js": """import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
""",
    "routes/productRoutes.js": """import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.express();
// bug fix: express.Router()
""",
    "server.js": """import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
""",
    "package.json": """{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-async-handler": "^1.2.0",
    "jsonwebtoken": "^9.0.1",
    "mongoose": "^7.4.1"
  }
}
"""
}

# Fix route
files_to_write["routes/productRoutes.js"] = """import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';
const router = express.Router();
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
export default router;
"""

for rel_path, content in files_to_write.items():
    full_path = os.path.join(backend_dir, rel_path.replace("/", os.sep))
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Backend files generated successfully.")
