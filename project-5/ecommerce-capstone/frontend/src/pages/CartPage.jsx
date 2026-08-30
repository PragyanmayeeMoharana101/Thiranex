import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate("/login?redirect=checkout");
  };

  const subtotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you have not added anything to your cart yet.</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cart.map((item) => (
                <li key={item._id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow flex flex-col sm:flex-row w-full items-center justify-between gap-4">
                    <div className="flex-grow">
                      <Link to={"/product/" + item._id} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                    </div>
                    
                    <div className="font-bold text-gray-900 w-24 text-center">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    <select 
                      value={item.qty} 
                      onChange={(e) => addToCart(item, Number(e.target.value))}
                      className="border border-gray-300 rounded-md py-1.5 px-3 bg-white"
                    >
                      {[...Array(item.countInStock).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                    
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 p-2 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="flex justify-between items-center mb-4 text-gray-600">
              <span>Items ({cart.reduce((acc, item) => acc + item.qty, 0)})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-6 text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-center font-bold text-xl text-gray-900">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={checkoutHandler}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
