export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`
}