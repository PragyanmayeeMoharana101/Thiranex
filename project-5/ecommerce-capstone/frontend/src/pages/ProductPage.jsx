import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products/" + id);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate("/cart");
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error || !product) return (
    <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error || "Product not found"}</div>
  );

  return (
    <div className="animate-fadeIn">
      <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-flex items-center transition">
        &larr; Back to Products
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 bg-gray-50 p-8 flex justify-center items-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-w-full h-auto rounded-lg shadow-md object-cover max-h-[500px]" 
            />
          </div>
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="mb-2 text-sm text-gray-500 uppercase tracking-wide font-semibold">
              {product.brand} &bull; {product.category}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400">
                ?????
              </div>
              <span className="ml-2 text-gray-600">({product.numReviews} reviews)</span>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>
            
            <div className="mt-auto">
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-b border-gray-100 py-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-medium">Status</span>
                  <span className={product.countInStock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                
                {product.countInStock > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Quantity</span>
                    <select 
                      value={qty} 
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="border border-gray-300 rounded-md py-2 px-4 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                className={"w-full py-4 rounded-xl text-white font-bold text-lg transition shadow-lg " + (product.countInStock === 0 ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5")}
              >
                {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
