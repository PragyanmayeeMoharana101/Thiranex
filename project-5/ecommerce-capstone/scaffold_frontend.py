import os

base_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")

# Create directories
os.makedirs(os.path.join(base_dir, "src", "components"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "src", "pages"), exist_ok=True)

files_to_write = {
    "src/App.jsx": """import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white text-center py-4">
          <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
""",
    "src/components/Navbar.jsx": """import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">E-Shop</Link>
        <nav className="flex space-x-6">
          <Link to="/cart" className="flex items-center text-gray-700 hover:text-blue-600">
            <ShoppingCart className="w-5 h-5 mr-1" /> Cart
          </Link>
          <Link to="/login" className="flex items-center text-gray-700 hover:text-blue-600">
            <User className="w-5 h-5 mr-1" /> Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
""",
    "src/components/ProductCard.jsx": """import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2 truncate">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
""",
    "src/pages/HomePage.jsx": """import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fallback for mockup if backend not running
        const res = await axios.get('http://localhost:5000/api/products').catch(() => ({
          data: [
            { _id: '1', name: 'Airpods Wireless Bluetooth', image: 'https://images.unsplash.com/photo-1606220588913-b3aecb48a0fb?w=500', price: 89.99 },
            { _id: '2', name: 'iPhone 13 Pro 256GB', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', price: 999.99 },
            { _id: '3', name: 'Cannon EOS 80D', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', price: 929.99 },
            { _id: '4', name: 'Sony Playstation 5', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500', price: 499.99 }
          ]
        }));
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading products...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Latest Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
""",
    "src/pages/ProductPage.jsx": """import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`).catch(() => ({
          data: { _id: id, name: 'Sample Product', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', price: 99.99, description: 'A high quality sample product.', countInStock: 5 }
        }));
        setProduct(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div>
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Go Back</Link>
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow">
        <div className="md:w-1/2">
          <img src={product.image} alt={product.name} className="w-full rounded-lg object-cover" />
        </div>
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h2>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="text-2xl font-bold text-gray-900 mb-4">${product.price}</div>
            <div className="mb-6">
              Status: <span className={product.countInStock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
          <button 
            disabled={product.countInStock === 0}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${product.countInStock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
""",
    "src/pages/CartPage.jsx": """export default function CartPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Your cart is currently empty.
      </div>
    </div>
  );
}
""",
    "tailwind.config.js": """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
""",
    "src/index.css": """@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
"""
}

for rel_path, content in files_to_write.items():
    full_path = os.path.join(base_dir, rel_path.replace("/", os.sep))
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Frontend files generated successfully.")
