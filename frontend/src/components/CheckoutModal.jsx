import { useState } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { API_BASE_URL } from '../config'

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, subtotal, clearCart } = useCart()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    address: '',
    city: '',
    postal_code: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [orderSuccess, setOrderSuccess] = useState(null)

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const orderPayload = {
      full_name: formData.full_name,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postal_code,
      total_amount: subtotal.toFixed(2),
      items: cart.map((item) => ({
        product: item.id,
        price: parseFloat(item.price).toFixed(2),
        quantity: item.quantity,
      })),
    }

    axios
      .post(`${API_BASE_URL}/api/orders/create/`, orderPayload)
      .then((res) => {
        setLoading(false)
        setOrderSuccess(res.data)
        clearCart()
      })
      .catch((err) => {
        console.error('Order API error:', err)
        setError('Failed to place order. Please check your details and try again.')
        setLoading(false)
      })
  }

  const handleClose = () => {
    setOrderSuccess(null)
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal Container */}
      <div className="relative bg-[#FAF7F2] border border-[#EADECF] rounded-lg max-w-lg w-full p-6 shadow-2xl z-10">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#7A6F68] hover:text-[#2C221E] text-2xl leading-none"
        >
          &times;
        </button>

        {orderSuccess ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-[#8B263E] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              ✓
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#8B263E]">
              Order Confirmed!
            </h3>
            <p className="text-sm text-[#7A6F68] mt-2">
              Thank you for shopping with Vastrika. Your order reference number is:
            </p>
            <p className="text-lg font-bold font-serif text-[#2C221E] mt-1">
              Order #{orderSuccess.id}
            </p>
            <p className="text-xs text-[#7A6F68] mt-4">
              We have dispatched your order details to <span className="font-semibold text-[#2C221E]">{orderSuccess.email}</span>.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 bg-[#8B263E] hover:bg-[#6f1e31] text-white px-6 py-2.5 rounded text-sm font-medium transition-colors shadow-sm"
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-serif font-bold text-[#2C221E] border-b border-[#EADECF] pb-3 mb-4">
              Shipping & Order Details
            </h3>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded border border-red-200 mb-4">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F68] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#EADECF] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8B263E]"
                  placeholder="e.g. Ananya Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F68] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#EADECF] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8B263E]"
                  placeholder="e.g. ananya@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F68] mb-1">
                  Shipping Address
                </label>
                <textarea
                  name="address"
                  required
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#EADECF] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8B263E]"
                  placeholder="House/Flat No., Street, Area"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F68] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#EADECF] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8B263E]"
                    placeholder="e.g. Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F68] mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#EADECF] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8B263E]"
                    placeholder="e.g. 400012"
                  />
                </div>
              </div>

              <div className="border-t border-[#EADECF] pt-4 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7A6F68]">Total Amount</span>
                  <p className="text-lg font-bold font-serif text-[#8B263E]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#8B263E] hover:bg-[#6f1e31] text-white px-6 py-2.5 rounded font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Confirm & Place Order'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}