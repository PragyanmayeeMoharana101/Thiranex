import os
base_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.join(base_dir, "frontend")

dirs = ["src/context", "src/hooks", "src/layouts", "src/components", "src/pages"]
for d in dirs:
    os.makedirs(os.path.join(frontend_dir, d.replace("/", os.sep)), exist_ok=True)

files = {
    "src/App.jsx": """import { BrowserRouter as Router, Routes, Route } from \\"react-router-dom\\";
import Navbar from \\"./components/Navbar\\";
import Footer from \\"./components/Footer\\";
import HomePage from \\"./pages/HomePage\\";
import ProductPage from \\"./pages/ProductPage\\";
import CartPage from \\"./pages/CartPage\\";
import LoginPage from \\"./pages/LoginPage\\";
import RegisterPage from \\"./pages/RegisterPage\\";
import CheckoutPage from \\"./pages/CheckoutPage\\";
import ProfilePage from \\"./pages/ProfilePage\\";
import { CartProvider } from \\"./context/CartContext\\";
import { AuthProvider } from \\"./context/AuthContext\\";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className=\\"flex flex-col min-h-screen bg-gray-50\\">
            <Navbar />
            <main className=\\"flex-grow container mx-auto px-4 py-8\\">
              <Routes>
                <Route path=\\"/\\" element={<HomePage />} />
                <Route path=\\"/product/:id\\" element={<ProductPage />} />
                <Route path=\\"/cart\\" element={<CartPage />} />
                <Route path=\\"/login\\" element={<LoginPage />} />
                <Route path=\\"/register\\" element={<RegisterPage />} />
                <Route path=\\"/checkout\\" element={<CheckoutPage />} />
                <Route path=\\"/profile\\" element={<ProfilePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
""",
    "src/components/Footer.jsx": """export default function Footer() {
  return (
    <footer className=\\"bg-gray-800 text-white text-center py-6 mt-12\\">
      <div className=\\"container mx-auto px-4\\">
        <p className=\\"text-sm\\">&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        <p className=\\"text-xs text-gray-400 mt-2\\">Built with React & Tailwind CSS</p>
      </div>
    </footer>
  );
}
""",
    "src/components/Navbar.jsx": """import { Link } from \\"react-router-dom\\";
import { ShoppingCart, User, LogOut } from \\"lucide-react\\";
import { useCart } from \\"../context/CartContext\\";
import { useAuth } from \\"../context/AuthContext\\";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className=\\"bg-white shadow-md sticky top-0 z-50\\">
      <div className=\\"container mx-auto px-4 py-4 flex flex-wrap justify-between items-center\\">
        <Link to=\\"/\\" className=\\"text-2xl font-bold text-blue-600 tracking-tight\\">E-Shop</Link>
        <nav className=\\"flex items-center space-x-6 mt-4 sm:mt-0\\">
          <Link to=\\"/cart\\" className=\\"relative flex items-center text-gray-700 hover:text-blue-600 transition\\">
            <ShoppingCart className=\\"w-6 h-6 mr-1\\" /> 
            <span className=\\"hidden sm:inline\\">Cart</span>
            {cartCount > 0 && (
              <span className=\\"absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full\\">
                {cartCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className=\\"flex items-center space-x-4\\">
              <Link to=\\"/profile\\" className=\\"flex items-center text-gray-700 hover:text-blue-600 transition\\">
                <User className=\\"w-5 h-5 mr-1\\" /> <span className=\\"hidden sm:inline\\">{user.name}</span>
              </Link>
              <button onClick={logout} className=\\"flex items-center text-gray-700 hover:text-red-600 transition\\">
                <LogOut className=\\"w-5 h-5 mr-1\\" /> <span className=\\"hidden sm:inline\\">Logout</span>
              </button>
            </div>
          ) : (
            <Link to=\\"/login\\" className=\\"flex items-center text-gray-700 hover:text-blue-600 transition\\">
              <User className=\\"w-5 h-5 mr-1\\" /> <span className=\\"hidden sm:inline\\">Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
""",
    "src/components/ProductCard.jsx": """import { Link } from \\"react-router-dom\\";

export default function ProductCard({ product }) {
  return (
    <div className=\\"bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full\\">
      <Link to={`/product/${product._id}`} className=\\"relative group block\\">
        <div className=\\"aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8\\">
            <img 
            src={product.image} 
            alt={product.name} 
            className=\\"w-full h-64 object-cover object-center group-hover:opacity-75 transition-opacity\\" 
            />
        </div>
      </Link>
      <div className=\\"p-5 flex flex-col flex-grow\\">
        <Link to={`/product/${product._id}`}>
          <h3 className=\\"text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mb-2\\">
            {product.name}
          </h3>
        </Link>
        <p className=\\"text-sm text-gray-500 mb-4\\">{product.brand}</p>
        <div className=\\"mt-auto flex items-center justify-between\\">
          <span className=\\"text-2xl font-bold text-gray-900\\">${product.price.toFixed(2)}</span>
          <Link 
            to={`/product/${product._id}`}
            className=\\"bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium\\"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
""",
    "src/context/CartContext.jsx": """import { createContext, useContext, useState, useEffect } from \\"react\\";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(\\"cart\\");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(\\"cart\\", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty) => {
    setCart((prev) => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, qty: Number(qty) } : item);
      }
      return [...prev, { ...product, qty: Number(qty) }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter(item => item._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
""",
    "src/context/AuthContext.jsx": """import { createContext, useContext, useState, useEffect } from \\"react\\";
import axios from \\"axios\\";

const AuthContext = createContext();
const API_URL = \\"http://localhost:5000/api\\";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(\\"userInfo\\");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(\\"userInfo\\", JSON.stringify(user));
    } else {
      localStorage.removeItem(\\"userInfo\\");
    }
  }, [user]);

  const login = async (email, password) => {
    // Mock login since no DB
    setUser({ _id: \\"1\\", name: \\"Test User\\", email, isAdmin: false });
  };

  const register = async (name, email, password) => {
    // Mock register
    setUser({ _id: \\"1\\", name, email, isAdmin: false });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
""",
    "src/pages/HomePage.jsx": """import { useState, useEffect } from \\"react\\";
import axios from \\"axios\\";
import ProductCard from \\"../components/ProductCard\\";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(\\"\\");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(\\"http://localhost:5000/api/products\\");
        setProducts(data);
      } catch (err) {
        setError(err.message || \\"Failed to fetch products\\");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className=\\"animate-fadeIn\\">
      {/* Hero Section */}
      <div className=\\"bg-blue-600 rounded-2xl p-8 sm:p-12 mb-12 text-white shadow-lg\\">
        <h1 className=\\"text-4xl sm:text-5xl font-extrabold mb-4\\">Welcome to E-Shop</h1>
        <p className=\\"text-lg sm:text-xl text-blue-100 max-w-2xl\\">
          Discover the latest electronics, gadgets, and accessories at unbeatable prices. Fast shipping and guaranteed quality.
        </p>
      </div>

      <div className=\\"flex justify-between items-center mb-8\\">
        <h2 className=\\"text-3xl font-bold text-gray-900\\">Featured Products</h2>
      </div>

      {loading ? (
        <div className=\\"flex justify-center items-center h-64\\">
          <div className=\\"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600\\"></div>
        </div>
      ) : error ? (
        <div className=\\"bg-red-50 text-red-600 p-4 rounded-lg border border-red-200\\">{error}</div>
      ) : (
        <div className=\\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8\\">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
""",
    "src/pages/ProductPage.jsx": """import { useState, useEffect } from \\"react\\";
import { useParams, Link, useNavigate } from \\"react\\-router-dom\\";
import axios from \\"axios\\";
import { useCart } from \\"../context/CartContext\\";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(\\"\\");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.message || \\"Failed to fetch product\\");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate(\\"/cart\\");
  };

  if (loading) return (
    <div className=\\"flex justify-center items-center h-64\\">
      <div className=\\"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600\\"></div>
    </div>
  );

  if (error || !product) return (
    <div className=\\"bg-red-50 text-red-600 p-4 rounded-lg\\">{error || \\"Product not found\\"}</div>
  );

  return (
    <div className=\\"animate-fadeIn\\">
      <Link to=\\"/\\" className=\\"text-blue-600 hover:text-blue-800 font-medium mb-6 inline-flex items-center transition\\">
        &larr; Back to Products
      </Link>
      
      <div className=\\"bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden\\">
        <div className=\\"flex flex-col lg:flex-row\\">
          {/* Image Gallery */}
          <div className=\\"lg:w-1/2 bg-gray-50 p-8 flex justify-center items-center\\">
            <img 
              src={product.image} 
              alt={product.name} 
              className=\\"max-w-full h-auto rounded-lg shadow-md object-cover max-h-[500px]\\" 
            />
          </div>
          
          {/* Product Details */}
          <div className=\\"lg:w-1/2 p-8 lg:p-12 flex flex-col\\">
            <div className=\\"mb-2 text-sm text-gray-500 uppercase tracking-wide font-semibold\\">
              {product.brand} &bull; {product.category}
            </div>
            <h1 className=\\"text-3xl lg:text-4xl font-bold text-gray-900 mb-4\\">{product.name}</h1>
            
            <div className=\\"flex items-center mb-6\\">
              <div className=\\"flex text-yellow-400\\">
                {/* Mock stars */}
                ?????
              </div>
              <span className=\\"ml-2 text-gray-600\\">({product.numReviews} reviews)</span>
            </div>
            
            <p className=\\"text-gray-600 text-lg leading-relaxed mb-8\\">
              {product.description}
            </p>
            
            <div className=\\"mt-auto\\">
              <div className=\\"flex items-baseline mb-6\\">
                <span className=\\"text-4xl font-extrabold text-gray-900\\">${product.price.toFixed(2)}</span>
              </div>
              
              <div className=\\"border-t border-b border-gray-100 py-4 mb-6\\">
                <div className=\\"flex justify-between items-center mb-4\\">
                  <span className=\\"text-gray-700 font-medium\\">Status</span>
                  <span className={product.countInStock > 0 ? \\"text-green-600 font-bold\\" : \\"text-red-600 font-bold\\"}>
                    {product.countInStock > 0 ? \\"In Stock\\" : \\"Out of Stock\\"}
                  </span>
                </div>
                
                {product.countInStock > 0 && (
                  <div className=\\"flex justify-between items-center\\">
                    <span className=\\"text-gray-700 font-medium\\">Quantity</span>
                    <select 
                      value={qty} 
                      onChange={(e) => setQty(Number(e.target.value))}
                      className=\\"border border-gray-300 rounded-md py-2 px-4 focus:ring-blue-500 focus:border-blue-500 bg-white\\"
                    >
                      {[...Array(product.countInStock).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg transition shadow-lg ${
                  product.countInStock === 0 
                  ? \\"bg-gray-400 cursor-not-allowed shadow-none\\" 
                  : \\"bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5\\"
                }`}
              >
                {product.countInStock === 0 ? \\"Out of Stock\\" : \\"Add to Cart\\"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
""",
    "src/pages/CartPage.jsx": """import { Link, useNavigate } from \\"react-router-dom\\";
import { useCart } from \\"../context/CartContext\\";
import { Trash2 } from \\"lucide-react\\";

export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate(\\"/login?redirect=checkout\\");
  };

  const subtotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  if (cart.length === 0) {
    return (
      <div className=\\"max-w-4xl mx-auto text-center py-20\\">
        <h2 className=\\"text-3xl font-bold text-gray-800 mb-6\\">Your Cart is Empty</h2>
        <p className=\\"text-gray-600 mb-8\\">Looks like you have not added anything to your cart yet.</p>
        <Link to=\\"/\\" className=\\"bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition\\">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className=\\"max-w-6xl mx-auto\\">
      <h1 className=\\"text-3xl font-bold text-gray-900 mb-8\\">Shopping Cart</h1>
      
      <div className=\\"flex flex-col lg:flex-row gap-8\\">
        {/* Cart Items */}
        <div className=\\"lg:w-2/3\\">
          <div className=\\"bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden\\">
            <ul className=\\"divide-y divide-gray-100\\">
              {cart.map((item) => (
                <li key={item._id} className=\\"p-6 flex flex-col sm:flex-row items-center gap-6\\">
                  <div className=\\"w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden\\">
                    <img src={item.image} alt={item.name} className=\\"w-full h-full object-cover\\" />
                  </div>
                  
                  <div className=\\"flex-grow flex flex-col sm:flex-row w-full items-center justify-between gap-4\\">
                    <div className=\\"flex-grow\\">
                      <Link to={`/product/${item._id}`} className=\\"text-lg font-semibold text-gray-900 hover:text-blue-600\\">
                        {item.name}
                      </Link>
                      <p className=\\"text-sm text-gray-500\\">{item.brand}</p>
                    </div>
                    
                    <div className=\\"font-bold text-gray-900 w-24 text-center\\">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    <select 
                      value={item.qty} 
                      onChange={(e) => addToCart(item, Number(e.target.value))}
                      className=\\"border border-gray-300 rounded-md py-1.5 px-3 bg-white\\"
                    >
                      {[...Array(item.countInStock).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                    
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className=\\"text-red-500 hover:text-red-700 p-2 transition\\"
                      aria-label=\\"Remove item\\"
                    >
                      <Trash2 className=\\"w-5 h-5\\" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className=\\"lg:w-1/3\\">
          <div className=\\"bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24\\">
            <h2 className=\\"text-xl font-bold text-gray-900 mb-6\\">Order Summary</h2>
            
            <div className=\\"flex justify-between items-center mb-4 text-gray-600\\">
              <span>Items ({cart.reduce((acc, item) => acc + item.qty, 0)})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className=\\"flex justify-between items-center mb-6 text-gray-600\\">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className=\\"border-t border-gray-100 pt-4 mb-8\\">
              <div className=\\"flex justify-between items-center font-bold text-xl text-gray-900\\">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={checkoutHandler}
              className=\\"w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition shadow-md\\"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
""",
    "src/pages/LoginPage.jsx": """import { useState, useEffect } from \\"react\\";
import { Link, useNavigate, useLocation } from \\"react-router-dom\\";
import { useAuth } from \\"../context/AuthContext\\";

export default function LoginPage() {
  const [email, setEmail] = useState(\\"\\");
  const [password, setPassword] = useState(\\"\\");
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirect = new URLSearchParams(location.search).get(\\"redirect\\") || \\"/\\";

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className=\\"max-w-md mx-auto mt-10\\">
      <div className=\\"bg-white p-8 rounded-2xl shadow-sm border border-gray-100\\">
        <h1 className=\\"text-3xl font-bold text-gray-900 mb-6 text-center\\">Sign In</h1>
        
        <form onSubmit={submitHandler} className=\\"space-y-6\\">
          <div>
            <label className=\\"block text-sm font-medium text-gray-700 mb-2\\">Email Address</label>
            <input 
              type=\\"email\\" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=\\"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition\\"
              placeholder=\\"you@example.com\\"
            />
          </div>
          
          <div>
            <label className=\\"block text-sm font-medium text-gray-700 mb-2\\">Password</label>
            <input 
              type=\\"password\\" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=\\"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition\\"
              placeholder=\\"••••••••\\"
            />
          </div>
          
          <button 
            type=\\"submit\\" 
            className=\\"w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md\\"
          >
            Sign In
          </button>
        </form>
        
        <div className=\\"mt-6 text-center text-gray-600\\">
          New Customer?{` `}
          <Link to={redirect ? `/register?redirect=${redirect}` : \\"/register\\"} className=\\"text-blue-600 font-semibold hover:underline\\">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
""",
    "src/pages/RegisterPage.jsx": """import { useState, useEffect } from \\"react\\";
import { Link, useNavigate, useLocation } from \\"react-router-dom\\";
import { useAuth } from \\"../context/AuthContext\\";

export default function RegisterPage() {
  const [name, setName] = useState(\\"\\");
  const [email, setEmail] = useState(\\"\\");
  const [password, setPassword] = useState(\\"\\");
  const [confirmPassword, setConfirmPassword] = useState(\\"\\");
  const [message, setMessage] = useState(\\"\\");
  
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirect = new URLSearchParams(location.search).get(\\"redirect\\") || \\"/\\";

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
        setMessage(\\"Passwords do not match\\");
    } else {
        register(name, email, password);
    }
  };

  return (
    <div className=\\"max-w-md mx-auto mt-10\\">
      <div className=\\"bg-white p-8 rounded-2xl shadow-sm border border-gray-100\\">
        <h1 className=\\"text-3xl font-bold text-gray-900 mb-6 text-center\\">Register</h1>
        
        {message && <div className=\\"bg-red-50 text-red-600 p-3 rounded mb-4 text-sm\\">{message}</div>}

        <form onSubmit={submitHandler} className=\\"space-y-4\\">
          <div>
            <label className=\\"block text-sm font-medium text-gray-700 mb-1\\">Full Name</label>
            <input 
              type=\\"text\\" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=\\"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition\\"
            />
          </div>

          <div>
            <label className=\\"block text-sm font-medium text-gray-700 mb-1\\">Email Address</label>
            <input 
              type=\\"email\\" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=\\"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition\\"
            />
          </div>
          
          <div>
            <label className=\\"block text-sm font-medium text-gray-700 mb-1\\">Password</label>
            <input 
              type=\\"password\\" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=\\"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition\\"
            />
          </div>

          <div>
            <label className=\\"block text-sm font-medium text-gray-700 mb-1\\">Confirm Password</label>
            <input 
              type=\\"password\\" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className=\\"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition\\"
            />
          </div>
          
          <button 
            type=\\"submit\\" 
            className=\\"w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md mt-4\\"
          >
            Register
          </button>
        </form>
        
        <div className=\\"mt-6 text-center text-gray-600\\">
          Already have an account?{` `}
          <Link to={redirect ? `/login?redirect=${redirect}` : \\"/login\\"} className=\\"text-blue-600 font-semibold hover:underline\\">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
""",
    "src/pages/CheckoutPage.jsx": """import { useNavigate } from \\"react-router-dom\\";
import { useCart } from \\"../context/CartContext\\";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    clearCart();
    alert(\\"Order Placed Successfully!\\");
    navigate(\\"/\\");
  };

  if(cart.length === 0) {
      navigate(\\"/cart\\");
      return null;
  }

  return (
    <div className=\\"max-w-2xl mx-auto mt-10\\">
      <div className=\\"bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center\\">
        <h1 className=\\"text-3xl font-bold text-gray-900 mb-6\\">Checkout</h1>
        <p className=\\"mb-8 text-gray-600\\">Review your items and place your order.</p>
        <button 
            onClick={handlePlaceOrder}
            className=\\"bg-green-600 text-white font-bold py-4 px-12 rounded-lg hover:bg-green-700 transition shadow-md\\"
        >
            Place Order
        </button>
      </div>
    </div>
  );
}
""",
    "src/pages/ProfilePage.jsx": """import { useAuth } from \\"../context/AuthContext\\";

export default function ProfilePage() {
  const { user } = useAuth();

  if(!user) return <div className=\\"text-center mt-10\\">Please log in.</div>;

  return (
    <div className=\\"max-w-4xl mx-auto mt-10\\">
      <h1 className=\\"text-3xl font-bold text-gray-900 mb-8\\">User Profile</h1>
      <div className=\\"bg-white p-8 rounded-2xl shadow-sm border border-gray-100\\">
        <p className=\\"text-lg\\"><strong>Name:</strong> {user.name}</p>
        <p className=\\"text-lg mt-2\\"><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}
"""
}

for rel, cont in files.items():
    with open(os.path.join(frontend_dir, rel.replace("/", os.sep)), "w", encoding="utf-8") as f:
        f.write(cont)

print("Frontend files generated successfully!")

