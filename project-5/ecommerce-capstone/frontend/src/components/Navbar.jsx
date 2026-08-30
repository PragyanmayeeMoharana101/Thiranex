import { Link } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">E-Shop</Link>
        <nav className="flex items-center space-x-6 mt-4 sm:mt-0">
          <Link to="/cart" className="relative flex items-center text-gray-700 hover:text-blue-600 transition">
            <ShoppingCart className="w-6 h-6 mr-1" /> 
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center text-gray-700 hover:text-blue-600 transition">
                <User className="w-5 h-5 mr-1" /> <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <button onClick={logout} className="flex items-center text-gray-700 hover:text-red-600 transition">
                <LogOut className="w-5 h-5 mr-1" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center text-gray-700 hover:text-blue-600 transition">
              <User className="w-5 h-5 mr-1" /> <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
