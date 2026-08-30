import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
      <Link to={"/product/" + product._id} className="relative group block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
            <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-64 object-cover object-center group-hover:opacity-75 transition-opacity" 
            />
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <Link to={"/product/" + product._id}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-4">{product.brand}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <Link 
            to={"/product/" + product._id}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
