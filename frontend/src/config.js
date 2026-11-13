const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1')


export const API_BASE_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://127.0.0.1:8000' : 'https://vastrika-70sv.onrender.com')

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${API_BASE_URL}${imagePath}`
}