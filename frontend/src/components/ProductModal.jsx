import { useCart } from '../context/CartContext'
import { getImageUrl } from '../config'

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart()

  if (!product) return null

  const isOutOfStock = product.stock <= 0

  const handleAddToBag = () => {
    if (isOutOfStock) return
    addToCart(product)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#FAF7F2] border border-[#EADECF] rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-[#7A6F68] hover:text-[#2C221E] text-2xl leading-none z-20"
        >
          &times;
        </button>

        {/* Left: Full Saree Image */}
        <div className="h-80 md:h-full bg-[#F2ECE4] flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[#7A6F68] font-serif">[ Saree Image ]</span>
          )}
        </div>

        {/* Right: Craft & Product Details */}
        <div className="p-6 flex flex-col justify-between bg-white">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#8B263E] bg-[#FAF7F2] px-2.5 py-1 rounded">
              {product.category_name || 'Handcrafted Weave'}
            </span>

            <h3 className="text-2xl font-serif font-bold text-[#2C221E] mt-3">
              {product.name}
            </h3>

            <p className="text-xl font-bold text-[#8B263E] mt-2">
              ₹{parseFloat(product.price).toLocaleString('en-IN')}
            </p>

            <div className="border-t border-[#EADECF] my-4 pt-4">
              <p className="text-sm text-[#2C221E] leading-relaxed">
                {product.description ||
                  'Handwoven heirloom saree crafted by master artisans with traditional zari detailing.'}
              </p>

              <ul className="mt-4 space-y-1.5 text-xs text-[#7A6F68]">
                <li>• Length: 6.3 meters (includes unstitched blouse piece)</li>
                <li>• Care: Dry clean only to preserve natural silk sheen</li>
                <li>• Authenticity: Handloom certified boutique edition</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EADECF]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#7A6F68]">Availability</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  isOutOfStock
                    ? 'bg-red-50 text-red-600'
                    : 'bg-[#F2ECE4] text-[#2C221E]'
                }`}
              >
                {isOutOfStock ? 'Sold Out' : `${product.stock} pieces in stock`}
              </span>
            </div>

            <button
              onClick={handleAddToBag}
              disabled={isOutOfStock}
              className={`w-full py-2.5 rounded font-medium text-sm transition-colors ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#8B263E] hover:bg-[#6f1e31] text-white shadow-sm'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}