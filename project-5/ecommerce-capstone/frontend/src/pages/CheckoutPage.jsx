import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    clearCart();
    alert("Order Placed Successfully!");
    navigate("/");
  };

  if(cart.length === 0) {
      navigate("/cart");
      return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
        <p className="mb-8 text-gray-600">Review your items and place your order.</p>
        <button 
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white font-bold py-4 px-12 rounded-lg hover:bg-green-700 transition shadow-md"
        >
            Place Order
        </button>
      </div>
    </div>
  );
}
