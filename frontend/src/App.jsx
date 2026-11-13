import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useCart } from './context/CartContext'
import CartDrawer from './components/CartDrawer'
import ProductModal from './components/ProductModal'
import { API_BASE_URL, getImageUrl } from './config'

const CURATED_WEAVE_MENU = [
  {
    keyword: 'maheshwari',
    title: 'MAHESHWARI HANDLOOMS',
    subtitle: 'reversible zari borders & silk-cotton',
  },
  {
    keyword: 'banarasi',
    title: 'BANARASI KATAN & KADWA',
    subtitle: 'pure silk brocades from varanasi',
  },
  {
    keyword: 'chanderi',
    title: 'CHANDERI SHEER TISSUE',
    subtitle: 'gossamer silks with gold booti',
  },
  {
    keyword: 'kanjeevaram',
    title: 'KANJEEVARAM KORVAI',
    subtitle: 'three-shuttle interlock temple silks',
  },
  {
    keyword: 'organza',
    title: 'ORGANZA LUXURY FLORA',
    subtitle: 'hand-painted botanical cutwork',
  },
]

function App() {
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Interactive Boutique UI States
  const [isWeavesOpen, setIsWeavesOpen] = useState(false)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('apsara_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [showWishlistOnly, setShowWishlistOnly] = useState(false)
  const [isTrackOpen, setIsTrackOpen] = useState(false)
  const [trackOrderId, setTrackOrderId] = useState('')
  const [trackStatus, setTrackStatus] = useState(null)
  const [isStylistOpen, setIsStylistOpen] = useState(false)

  const catalogRef = useRef(null)
  const dropdownRef = useRef(null)
  const { addToCart, totalItems, setIsCartOpen } = useCart()

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('apsara_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsWeavesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch categories & full catalog counts on mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/categories/`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to fetch categories:', err))

    axios
      .get(`${API_BASE_URL}/api/products/`)
      .then((res) => setAllProducts(res.data))
      .catch((err) => console.error('Failed to fetch full catalog:', err))
  }, [])

  // Fetch filtered products whenever selectedCategory changes
  useEffect(() => {
    setLoading(true)
    const url = selectedCategory
      ? `${API_BASE_URL}/api/products/?category=${selectedCategory}`
      : `${API_BASE_URL}/api/products/`

    axios
      .get(url)
      .then((response) => {
        setProducts(response.data)
        if (!selectedCategory) {
          setAllProducts(response.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('API Error:', err)
        setError('Failed to load products from Django server.')
        setLoading(false)
      })
  }, [selectedCategory])

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSelectCategory = (slug) => {
    setShowWishlistOnly(false)
    setSelectedCategory(slug)
    setIsWeavesOpen(false)
    scrollToCatalog()
  }

  const handleWeaveMenuClick = (keyword) => {
    const matched = categories.find(
      (c) =>
        c.slug.toLowerCase().includes(keyword) ||
        c.name.toLowerCase().includes(keyword)
    )
    handleSelectCategory(matched ? matched.slug : '')
  }

  const toggleWishlist = (e, productId) => {
    e.stopPropagation()
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const getDesignCount = (cat) => {
    return allProducts.filter(
      (p) =>
        p.category === cat.id ||
        (p.category_name &&
          p.category_name.toLowerCase() === cat.name.toLowerCase())
    ).length
  }

  // Filter displayed products by search & wishlist toggle
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.category_name &&
        product.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesWishlist = showWishlistOnly
      ? wishlist.includes(product.id)
      : true
    return matchesSearch && matchesWishlist
  })

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory)

  const handleTrackSubmit = (e) => {
    e.preventDefault()
    if (!trackOrderId.trim()) return
    setTrackStatus({
      id: trackOrderId.replace('#', ''),
      stage: 'Artisan Quality Check & Insured Dispatch',
      eta: '2–4 Business Days via BlueDart Insured',
    })
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C221E] flex flex-col">
      {/* 1. Top Atelier Announcement Bar */}
      <div className="bg-[#1F1714] text-[#EADECF] text-[11px] tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex flex-wrap justify-between items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-[#C8B9AC]">
            <span>Atelier: Bandra West, Mumbai</span>
            <span>•</span>
            <span>Mon–Sat 10:00 AM – 7:00 PM IST</span>
          </div>
          <div className="mx-auto md:mx-0 font-medium text-[#FAF7F2] flex items-center gap-1.5">
            <span className="text-[#D4AF37]">✦</span>
            <span>Complimentary Insured Shipping Across India</span>
          </div>
          <div className="hidden sm:block text-[#D4AF37] font-medium">
            Code: <span className="font-bold tracking-wider">APSARA10</span> for 10% Off
          </div>
        </div>
      </div>

      {/* 2. Luxury Editorial Header */}
      <header className="bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADECF] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          {/* Left Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4A3D37]">
            <a href="#atelier" className="hover:text-[#8B263E] transition-colors">
              Atelier
            </a>

            {/* Curated Weaves Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsWeavesOpen((prev) => !prev)}
                className="flex items-center gap-1.5 hover:text-[#8B263E] transition-colors uppercase tracking-[0.14em]"
              >
                <span>Curated Weaves</span>
                <span className="text-[9px]">{isWeavesOpen ? '▲' : '▼'}</span>
              </button>

              {isWeavesOpen && (
                <div className="absolute left-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-[#EADECF] p-5 z-50 text-left normal-case tracking-normal">
                  <div className="space-y-4">
                    {CURATED_WEAVE_MENU.map((item) => (
                      <button
                        key={item.keyword}
                        onClick={() => handleWeaveMenuClick(item.keyword)}
                        className="block w-full text-left group"
                      >
                        <p className="text-xs font-bold tracking-[0.1em] text-[#2C221E] group-hover:text-[#8B263E] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#7A6F68] mt-0.5">
                          {item.subtitle}
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#EADECF] mt-4 pt-3.5">
                    <button
                      onClick={() => handleSelectCategory('')}
                      className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#8B263E] hover:text-[#6f1e31] flex items-center gap-1.5"
                    >
                      <span>View Complete Catalog</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleSelectCategory('')}
              className="hover:text-[#8B263E] transition-colors uppercase tracking-[0.14em]"
            >
              Collections
            </button>
            <a href="#our-story" className="hover:text-[#8B263E] transition-colors">
              Our Story
            </a>
          </nav>

          {/* Center Brand Crest */}
          <button
            onClick={() => {
              setSelectedCategory('')
              setSearchQuery('')
              setShowWishlistOnly(false)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="text-center mx-auto lg:mx-0 focus:outline-none"
          >
            <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.22em] text-[#2C221E] font-semibold">
              APSARA
            </h1>
            <p className="text-[9px] tracking-[0.22em] uppercase text-[#7A6F68] mt-0.5">
              By Urvashi Shah • Luxury Handlooms
            </p>
          </button>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Pill */}
            <div className="relative hidden sm:block">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B263E] text-xs">
                ⌕
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Weaves..."
                className="bg-[#FAF7F2] border border-[#EADECF] rounded-full pl-8 pr-4 py-1.5 text-xs text-[#2C221E] placeholder-[#8C7F77] focus:outline-none focus:border-[#8B263E] w-40 md:w-48 transition-all"
              />
            </div>

            {/* Track Order */}
            <button
              onClick={() => {
                setTrackStatus(null)
                setIsTrackOpen(true)
              }}
              className="hidden md:flex items-center gap-1 text-xs text-[#4A3D37] hover:text-[#8B263E] transition-colors"
              title="Track Order"
            >
              <span>🧭</span>
              <span>Track</span>
            </button>

            {/* Wishlist Toggle */}
            <button
              onClick={() => {
                setShowWishlistOnly((prev) => !prev)
                scrollToCatalog()
              }}
              className={`relative p-1.5 rounded-full transition-colors ${
                showWishlistOnly
                  ? 'text-[#8B263E] bg-[#F2ECE4]'
                  : 'text-[#2C221E] hover:text-[#8B263E]'
              }`}
              title="Saved Wishlist"
            >
              <span className="text-base leading-none">
                {wishlist.length > 0 ? '♥' : '♡'}
              </span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#1F1714] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#2C221E] hover:text-[#8B263E] transition-colors"
            >
              <span className="text-sm">🛍</span>
              <span>BAG</span>
              <span className="bg-[#8B263E] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Full-Bleed Heritage Hero Banner */}
      <section className="relative overflow-hidden bg-[#3B0D18] text-white">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
          alt="Apsara by Urvashi Shah Heritage Saree"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D0A12]/95 via-[#4A1120]/85 to-[#2D0A12]/90" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/40 backdrop-blur-sm text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-[#F3E5AB] mb-6">
            <span>✦</span>
            <span>Apsara by Urvashi Shah • Heritage Atelier</span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-medium leading-[1.1] tracking-tight text-white">
            The Poetry of Weaves,
            <span className="block italic text-[#E2C068] mt-1">
              Draped in Pure Grace
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#EADECF]/90 mt-6 leading-relaxed font-normal">
            Curated handloom luxury. From royal Maheshwari silk-cottons and Banarasi
            Katans to whisper-sheer floral organzas and temple Kanjeevarams.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleWeaveMenuClick('maheshwari')}
              className="bg-[#9E2A47] hover:bg-[#8B263E] text-white text-xs font-semibold tracking-[0.15em] uppercase px-7 py-3.5 rounded-full shadow-lg transition-all flex items-center gap-2"
            >
              <span>Explore Maheshwari</span>
              <span>→</span>
            </button>
            <button
              onClick={() => handleSelectCategory('')}
              className="bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-sm text-white text-xs font-semibold tracking-[0.15em] uppercase px-7 py-3.5 rounded-full transition-all"
            >
              Complete Collection
            </button>
          </div>
        </div>
      </section>

      {/* 4. Shop by Sacred Fabric Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B263E]">
            Curated Textile Archives
          </p>
          <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2C221E] mt-2">
            Shop by Sacred Fabric
          </h3>
          <p className="text-xs sm:text-sm text-[#7A6F68] mt-2.5 leading-relaxed">
            Each textile represents centuries of regional devotion, master handlooms,
            and uncompromised fiber purity.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            onClick={() => handleSelectCategory('')}
            className={`group rounded-2xl p-6 text-center transition-all border ${
              selectedCategory === '' && !showWishlistOnly
                ? 'bg-white border-[#8B263E] shadow-md ring-1 ring-[#8B263E]/20'
                : 'bg-[#FFFDF9] border-[#EADECF] hover:border-[#C8B9AC] hover:shadow-sm'
            }`}
          >
            <div className="w-11 h-11 rounded-full bg-[#F5EFE6] group-hover:bg-[#8B263E]/10 mx-auto flex items-center justify-center text-[#8B263E] text-sm transition-colors">
              ✦
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#2C221E] mt-3.5">
              All Weaves
            </h4>
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A6F68] mt-1">
              {allProducts.length} {allProducts.length === 1 ? 'Design' : 'Designs'}
            </p>
          </button>
          {categories.map((cat) => {
            const count = getDesignCount(cat)
            const isSelected = selectedCategory === cat.slug && !showWishlistOnly
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.slug)}
                className={`group rounded-2xl p-6 text-center transition-all border ${
                  isSelected
                    ? 'bg-white border-[#8B263E] shadow-md ring-1 ring-[#8B263E]/20'
                    : 'bg-[#FFFDF9] border-[#EADECF] hover:border-[#C8B9AC] hover:shadow-sm'
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-[#F5EFE6] group-hover:bg-[#8B263E]/10 mx-auto flex items-center justify-center text-[#8B263E] text-sm transition-colors">
                  ✦
                </div>
                <h4 className="font-serif text-lg font-semibold text-[#2C221E] mt-3.5">
                  {cat.name.replace(' Silk', '').replace(' Zari', '').replace(' Weave', '')}
                </h4>
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A6F68] mt-1">
                  {count} {count === 1 ? 'Design' : 'Designs'}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* 5. Signature Catalog Grid */}
      <main
        ref={catalogRef}
        className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full scroll-mt-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EADECF] pb-5 mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B263E]">
              {showWishlistOnly
                ? 'Your Private Selection'
                : activeCategoryObj
                ? 'Curated Heritage Archive'
                : 'The Apsara Handloom Legacy'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2C221E] mt-1">
              {showWishlistOnly
                ? 'Saved Wishlist Pieces'
                : activeCategoryObj
                ? `Signature ${activeCategoryObj.name}`
                : 'Signature Handloom Weaves'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sarees..."
              className="sm:hidden bg-white border border-[#EADECF] rounded-full px-3.5 py-1.5 text-xs focus:outline-none focus:border-[#8B263E]"
            />
            {(selectedCategory || showWishlistOnly || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setShowWishlistOnly(false)
                  setSearchQuery('')
                }}
                className="text-xs font-semibold text-[#8B263E] hover:text-[#6f1e31] flex items-center gap-1"
              >
                <span>View All Weaves</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
        {loading && (
          <p className="text-sm text-[#7A6F68] animate-pulse py-12 text-center font-serif italic text-lg">
            Curating handloom pieces from the atelier...
          </p>
        )}
        {error && (
          <p className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 text-sm">
            {error}
          </p>
        )}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#FFFDF9] rounded-2xl border border-[#EADECF]">
                <p className="font-serif text-2xl text-[#2C221E]">
                  No weaves match your current selection.
                </p>
                <p className="text-xs text-[#7A6F68] mt-1.5">
                  Explore our complete archive of handcrafted silk and organza sarees.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('')
                    setSearchQuery('')
                    setShowWishlistOnly(false)
                  }}
                  className="mt-5 bg-[#8B263E] text-white text-xs uppercase tracking-widest px-6 py-2.5 rounded-full font-semibold"
                >
                  View Complete Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0
                  const isWishlisted = wishlist.includes(product.id)
                  const numericPrice = parseFloat(product.price)
                  const compareAtPrice = Math.round(numericPrice * 1.18)
                  return (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="group bg-white rounded-2xl border border-[#EADECF]/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] bg-[#F2ECE4] overflow-hidden">
                        {product.image ? (
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#7A6F68] font-serif">
                            [ Handloom Saree ]
                          </div>
                        )}
                        <div className="absolute top-3.5 left-3.5 flex flex-col items-start gap-1.5">
                          <span className="bg-[#6D1D31]/95 text-white text-[9px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full shadow-sm">
                            Signature Piece
                          </span>
                          <span className="bg-white/95 text-[#2C221E] text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full shadow-sm">
                            {product.category_name || 'Handloom'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => toggleWishlist(e, product.id)}
                          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-md flex items-center justify-center transition-transform hover:scale-105"
                          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                        >
                          <span
                            className={`text-base leading-none ${
                              isWishlisted ? 'text-[#8B263E]' : 'text-[#2C221E]'
                            }`}
                          >
                            {isWishlisted ? '♥' : '♡'}
                          </span>
                        </button>
                        <div className="absolute inset-x-3.5 bottom-3.5 flex items-center gap-2 opacity-95 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedProduct(product)
                            }}
                            className="flex-1 bg-white/95 hover:bg-white text-[#2C221E] text-xs font-semibold py-2.5 px-3 rounded-full shadow-md flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <span>👁</span>
                            <span>Quick View</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!isOutOfStock) addToCart(product)
                            }}
                            disabled={isOutOfStock}
                            className={`flex-1 text-xs font-semibold py-2.5 px-3 rounded-full shadow-md flex items-center justify-center gap-1.5 transition-colors ${
                              isOutOfStock
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-[#1F1714] hover:bg-[#8B263E] text-white'
                            }`}
                          >
                            <span>🛍</span>
                            <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                          </button>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                        <div>
                          <div className="flex items-center justify-between text-[10px] tracking-[0.12em] uppercase text-[#7A6F68]">
                            <span className="font-semibold">Handloom Pit Loom</span>
                            <span
                              className={`flex items-center gap-1 font-medium normal-case tracking-normal ${
                                isOutOfStock ? 'text-red-600' : 'text-[#4A3D37]'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isOutOfStock ? 'bg-red-500' : 'bg-emerald-600'
                                }`}
                              />
                              {isOutOfStock ? 'Out of stock' : `${product.stock} left`}
                            </span>
                          </div>
                          <h3 className="text-xl font-serif font-semibold text-[#2C221E] group-hover:text-[#8B263E] transition-colors mt-1.5 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-[#7A6F68] mt-1 line-clamp-1">
                            {product.description ||
                              'Timeless handwoven body with glistening zari border.'}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#F2ECE4] flex items-baseline gap-2.5">
                          <span className="text-lg font-serif font-bold text-[#2C221E]">
                            ₹{numericPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-[#9E928B] line-through">
                            ₹{compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* 6. Heritage Atelier & Story Editorial Band */}
      <section
        id="our-story"
        className="bg-[#FFFDF9] border-t border-[#EADECF] py-16 px-4 sm:px-8 scroll-mt-20"
      >
        <div
          id="atelier"
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EADECF]">
            <span className="text-[#8B263E] text-lg">✦</span>
            <h4 className="font-serif text-xl font-semibold text-[#2C221E] mt-2">
              Handloom Mark Certified
            </h4>
            <p className="text-xs text-[#7A6F68] mt-2 leading-relaxed">
              Every drape is sourced directly from master weaver clusters in Maheshwar,
              Varanasi, and Chanderi.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EADECF]">
            <span className="text-[#8B263E] text-lg">✦</span>
            <h4 className="font-serif text-xl font-semibold text-[#2C221E] mt-2">
              Bandra West Flagship
            </h4>
            <p className="text-xs text-[#7A6F68] mt-2 leading-relaxed">
              Experience private drape consultations at our Mumbai atelier, Mon–Sat
              10:00 AM – 7:00 PM IST.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EADECF]">
            <span className="text-[#8B263E] text-lg">✦</span>
            <h4 className="font-serif text-xl font-semibold text-[#2C221E] mt-2">
              Insured Heirloom Delivery
            </h4>
            <p className="text-xs text-[#7A6F68] mt-2 leading-relaxed">
              Dispatched in signature breathable muslin keepsake bags with full transit
              insurance across India.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Boutique Footer */}
      <footer className="bg-[#1F1714] text-[#EADECF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-serif text-2xl tracking-[0.22em] text-white">
              APSARA
            </h4>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#C8B9AC] mt-1">
              By Urvashi Shah • Luxury Handlooms
            </p>
          </div>
          <div className="text-xs text-[#C8B9AC] text-center">
            Curated Weaves • Direct Artisan Sourcing • Mumbai Atelier
          </div>
          <div className="text-xs text-[#D4AF37]">
            © {new Date().getFullYear()} Apsara by Urvashi Shah
          </div>
        </div>
      </footer>

      {/* Floating Stylist Help Concierge Button */}
      <div className="fixed bottom-5 right-5 z-40">
        {isStylistOpen && (
          <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-[#EADECF] p-4 text-left">
            <div className="flex justify-between items-center border-b border-[#EADECF] pb-2.5">
              <div>
                <p className="text-xs font-bold text-[#2C221E]">Apsara Stylist Desk</p>
                <p className="text-[10px] text-emerald-600 font-medium">
                  ● Online • Mumbai Studio
                </p>
              </div>
              <button
                onClick={() => setIsStylistOpen(false)}
                className="text-[#7A6F68] hover:text-[#2C221E] text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-[#4A3D37] mt-3 leading-relaxed">
              Need help choosing between Maheshwari silk-cotton, Banarasi Katan, or sheer
              Organza for an occasion?
            </p>
            <button
              onClick={() => {
                setIsStylistOpen(false)
                handleSelectCategory('')
              }}
              className="mt-3 w-full bg-[#8B263E] text-white text-xs font-semibold py-2 rounded-full hover:bg-[#6f1e31] transition-colors"
            >
              Browse Curated Collection
            </button>
          </div>
        )}
        <button
          onClick={() => setIsStylistOpen((prev) => !prev)}
          className="ml-auto bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span>💬</span>
          <span>Stylist Help</span>
        </button>
      </div>

      {/* Order Tracking Modal */}
      {isTrackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsTrackOpen(false)}
          />
          <div className="relative bg-[#FAF7F2] border border-[#EADECF] rounded-2xl max-w-md w-full p-6 shadow-2xl z-10">
            <button
              onClick={() => setIsTrackOpen(false)}
              className="absolute top-4 right-4 text-[#7A6F68] hover:text-[#2C221E] text-2xl leading-none"
            >
              &times;
            </button>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8B263E]">
              Concierge Dispatch
            </p>
            <h3 className="text-2xl font-serif font-semibold text-[#2C221E] mt-1">
              Track Your Handloom Order
            </h3>
            <form onSubmit={handleTrackSubmit} className="mt-4 flex gap-2">
              <input
                type="text"
                required
                value={trackOrderId}
                onChange={(e) => setTrackOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. 1)"
                className="flex-1 bg-white border border-[#EADECF] rounded-full px-4 py-2 text-xs focus:outline-none focus:border-[#8B263E]"
              />
              <button
                type="submit"
                className="bg-[#8B263E] text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-[#6f1e31]"
              >
                Track
              </button>
            </form>
            {trackStatus && (
              <div className="mt-4 p-3.5 bg-white rounded-xl border border-[#EADECF] text-xs space-y-1">
                <p className="font-bold text-[#2C221E]">
                  Order #{trackStatus.id} Confirmed
                </p>
                <p className="text-[#8B263E] font-medium">
                  Status: {trackStatus.stage}
                </p>
                <p className="text-[#7A6F68]">{trackStatus.eta}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Existing Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartDrawer />
    </div>
  )
}

export default App