import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  // Load saved cart from localStorage on initial render
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('vastrika_cart')
    return savedCart ? JSON.parse(savedCart) : []
  })
  
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vastrika_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true) // Automatically slide open drawer when an item is added
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}