import { useState } from 'react'
import { useCart } from '../context/CartContext'
import CheckoutModal from './CheckoutModal'
import { getImageUrl } from '../config'

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems
  } = useCart()

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  if (!isCartOpen) return null

  const handleOpenCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#EADECF] flex flex-col shadow-2xl">
            
            {/* Drawer Header */}
            <div className="p-6 bg-white border-b border-[#EADECF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-[#2C221E]">Shopping Bag</h2>
                <span className="text-xs font-semibold bg-[#8B263E] text-white px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-[#7A6F68] hover:text-[#2C221E] text-2xl font-light leading-none p-1"
              >
                &times;
              </button>
            </div>

            {/* Cart Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-[#7A6F68]">
                  <p className="font-serif text-lg">Your bag is currently empty.</p>
                  <p className="text-xs mt-1">Explore our collection to add handcrafted sarees.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white p-4 rounded-lg border border-[#EADECF] flex gap-4 items-center"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-24 bg-[#F2ECE4] rounded overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-[#7A6F68]">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-semibold text-[#2C221E] text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#8B263E] font-bold mt-0.5">
                        ₹{parseFloat(item.price).toLocaleString('en-IN')}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-[#EADECF] rounded bg-[#FAF7F2]">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-[#2C221E] hover:bg-[#EADECF] transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold text-[#2C221E]">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-[#2C221E] hover:bg-[#EADECF] transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer / Subtotal */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-[#EADECF] space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#7A6F68] font-serif">Subtotal</span>
                  <span className="text-lg font-bold text-[#8B263E] font-serif">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A6F68]">Shipping and taxes calculated at checkout.</p>
                
                <button 
                  onClick={handleOpenCheckout}
                  className="w-full bg-[#8B263E] hover:bg-[#6f1e31] text-white py-3 rounded font-medium text-sm transition-colors shadow-sm"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  )
}