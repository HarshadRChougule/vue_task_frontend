import { showGlobalMessage } from "@/eventBus";

// Load liked products from localStorage
export const loadLikedProducts = () => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  if (userId) {
    const liked = JSON.parse(
      localStorage.getItem(`likedProducts_${userId}`) || "[]"
    );
    return liked;
  }
  return [];
};

// Check if product is liked
export const isProductLiked = (productId, likedProducts = []) => {
  // Add null/undefined check to prevent the error
  if (!likedProducts || !Array.isArray(likedProducts)) {
    return false;
  }
  return likedProducts.includes(productId);
};

// Toggle like
export const toggleLike = (productId, likedProducts = []) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  if (!userId) {
    showGlobalMessage("Please login to like products", "error");
    return likedProducts || [];
  }

  // Ensure likedProducts is an array
  let updatedLikedProducts = Array.isArray(likedProducts)
    ? [...likedProducts]
    : [];

  if (isProductLiked(productId, updatedLikedProducts)) {
    updatedLikedProducts = updatedLikedProducts.filter(
      (id) => id !== productId
    );
    showGlobalMessage("Product removed from liked items", "info");
  } else {
    updatedLikedProducts.push(productId);
    showGlobalMessage("Product liked successfully", "success");
  }

  // Save to localStorage
  localStorage.setItem(
    `likedProducts_${user.id}`,
    JSON.stringify(updatedLikedProducts)
  );

  return updatedLikedProducts;
};

// Buy product
export const buyProduct = (product) => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  if (!userId) {
    showGlobalMessage("Please login to like products", "error");
    return 0;
  }
  showGlobalMessage(`Successfully purchased ${product.name}`, "success");
};

// Load reviews for a product
export const loadProductReviews = (productId) => {
  const reviews = JSON.parse(
    localStorage.getItem(`reviews_${productId}`) || "[]"
  );
  return reviews;
};

// Save a new review
export const saveReview = (productId, reviewText) => {
  if (!productId) {
    return false;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    showGlobalMessage("Please login to add a review", "error");
    return false;
  }

  const newReview = {
    id: Date.now().toString(),
    userId: user.id,
    userName: user.name || `User ${user.id.substring(0, 5)}`,
    productId: productId,
    text: reviewText,
    date: new Date().toISOString(),
    likes: 0,
  };

  // Get existing reviews
  const reviews = loadProductReviews(productId);

  // Add new review
  reviews.unshift(newReview);

  // Save to localStorage
  localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));

  showGlobalMessage("Review submitted successfully", "success");
  return true;
};

// Load liked reviews
export const loadLikedReviews = () => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  if (userId) {
    const liked = JSON.parse(
      localStorage.getItem(`likedReviews_${userId}`) || "[]"
    );
    return liked;
  }
  return [];
};

// Check if review is liked
export const isReviewLiked = (reviewId, likedReviews = []) => {
  if (!likedReviews || !Array.isArray(likedReviews)) {
    return false;
  }
  return likedReviews.includes(reviewId);
};

// Toggle like for a review
export const toggleReviewLike = (reviewId, productId, likedReviews = []) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  if (!userId) {
    showGlobalMessage("Please login to like reviews", "error");
    return likedReviews || [];
  }

  // Ensure likedReviews is an array
  let updatedLikedReviews = Array.isArray(likedReviews)
    ? [...likedReviews]
    : [];

  // Get all reviews for the product
  const reviews = loadProductReviews(productId);
  const reviewIndex = reviews.findIndex((review) => review.id === reviewId);

  if (reviewIndex === -1) {
    return updatedLikedReviews;
  }

  if (isReviewLiked(reviewId, updatedLikedReviews)) {
    // Unlike
    updatedLikedReviews = updatedLikedReviews.filter((id) => id !== reviewId);
    if (reviews[reviewIndex].likes > 0) {
      reviews[reviewIndex].likes -= 1;
    }
    showGlobalMessage("Review unliked", "info");
  } else {
    // Like
    updatedLikedReviews.push(reviewId);
    reviews[reviewIndex].likes += 1;
    showGlobalMessage("Review liked successfully", "success");
  }

  // Save updated reviews
  localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));

  // Save liked reviews
  localStorage.setItem(
    `likedReviews_${user.id}`,
    JSON.stringify(updatedLikedReviews)
  );

  return updatedLikedReviews;
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Add to recently visited products
export const addToRecentlyVisited = (productId) => {
  if (!productId) return;

  // Get existing recently visited products
  let recentlyVisited = JSON.parse(
    sessionStorage.getItem("recentlyVisited") || "[]"
  );

  // Remove if already exists (to move it to the front)
  recentlyVisited = recentlyVisited.filter((id) => id !== productId);

  // Add to beginning of array
  recentlyVisited.unshift(productId);

  // Limit to 6 items
  recentlyVisited = recentlyVisited.slice(0, 6);

  // Save to sessionStorage
  sessionStorage.setItem("recentlyVisited", JSON.stringify(recentlyVisited));
};

// Load recently visited products
export const loadRecentlyVisitedProducts = (allProducts) => {
  console.log("in the session sessionStorage");
  const recentlyVisitedIds = JSON.parse(
    sessionStorage.getItem("recentlyVisited") || "[]"
  );
  if (!allProducts._rawValue || !Array.isArray(allProducts._rawValue)) {
    return [];
  }

  // Map IDs to actual product objects
  return recentlyVisitedIds
    .map((id) => allProducts._rawValue.find((product) => product.id === id))
    .filter(Boolean); // Remove any undefined products
};
