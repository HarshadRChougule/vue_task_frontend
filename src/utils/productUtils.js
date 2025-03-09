import { showGlobalMessage } from "@/eventBus"

// Load liked products from localStorage
export const loadLikedProducts = () => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id
  if (userId) {
    const liked = JSON.parse(localStorage.getItem(`likedProducts_${userId}`) || "[]")
    return liked
  }
  return []
}

// Check if product is liked
export const isProductLiked = (productId, likedProducts = []) => {
  // Add null/undefined check to prevent the error
  if (!likedProducts || !Array.isArray(likedProducts)) {
    return false
  }
  return likedProducts.includes(productId)
}

// Toggle like
export const toggleLike = (productId, likedProducts = []) => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id
  if (!userId) {
    showGlobalMessage("Please login to like products", "error")
    return likedProducts || []
  }

  // Ensure likedProducts is an array
  let updatedLikedProducts = Array.isArray(likedProducts) ? [...likedProducts] : []

  if (isProductLiked(productId, updatedLikedProducts)) {
    updatedLikedProducts = updatedLikedProducts.filter((id) => id !== productId)
    showGlobalMessage("Product removed from liked items", "info")
  } else {
    updatedLikedProducts.push(productId)
    showGlobalMessage("Product liked successfully", "success")
  }

  // Save to localStorage
  localStorage.setItem(`likedProducts_${userId}`, JSON.stringify(updatedLikedProducts))

  return updatedLikedProducts
}

// Buy product
export const buyProduct = (product) => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id
    if (!userId) {
      showGlobalMessage("Please login to like products", "error")
      return 0;
    }
  showGlobalMessage(`Successfully purchased ${product.name}`, "success")
}

