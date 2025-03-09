<template>
  <v-container>
    <!-- Loading indicator -->
    <div v-if="loading" class="d-flex justify-center align-center my-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </div>
    <!-- Error message -->
    <v-alert v-else-if="error" type="error" class="mb-6">
      {{ error }}
    </v-alert>

    <!-- Product details -->
    <div v-else-if="product">
      <v-row>
        <!-- Back button -->
        <v-col cols="12">
          <v-btn
            prepend-icon="mdi-arrow-left"
            variant="text"
            @click="router.back()"
          >
            Back to Products
          </v-btn>
        </v-col>

        <!-- Product image -->
        <v-col cols="12" md="6">
          <v-img
            :src="product.image"
            height="400"
            cover
            class="rounded-lg bg-grey-lighten-2"
          ></v-img>
        </v-col>

        <!-- Product info -->
        <v-col cols="12" md="6">
          <h1 class="text-h3 mb-2">{{ product.name }}</h1>

          <div class="text-subtitle-1 mb-2" v-if="product.sellerName">
            Seller: {{ product.sellerName }}
          </div>

          <div class="text-h4 mb-4 primary--text">
            ₹{{ product.price.toFixed(2) }}
          </div>

          <v-chip
            class="mb-6"
            :color="product.quantity > 0 ? 'success' : 'error'"
          >
            {{
              product.quantity > 0
                ? `In Stock (${product.quantity})`
                : "Out of Stock"
            }}
          </v-chip>

          <!-- Truncated description with See More button -->
          <div class="text-body-1 mb-6">
            <p v-if="!showFullDescription && product.description.length > 100">
              {{ product.description.substring(0, 100) }}...
              <v-btn
                variant="text"
                color="primary"
                size="small"
                @click="showFullDescription = true"
              >
                See More
              </v-btn>
            </p>
            <p v-else>
              {{ product.description }}
              <v-btn
                v-if="product.description.length > 100"
                variant="text"
                color="primary"
                size="small"
                @click="showFullDescription = false"
              >
                See Less
              </v-btn>
            </p>
          </div>

          <div class="d-flex mb-6">
            <v-btn
              variant="outlined"
              :color="
                isProductLiked(product.id, likedProducts) ? 'grey' : 'primary'
              "
              class="mr-4"
              @click="handleToggleLike(product.id)"
            >
              {{ isProductLiked(product.id, likedProducts) ? "Liked" : "Like" }}
            </v-btn>

            <v-btn
              color="primary"
              size="large"
              @click="handleBuyProduct(product)"
              :disabled="product.quantity <= 0"
            >
              Buy Now
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Reviews Section -->
      <v-divider class="my-8"></v-divider>

      <h2 class="text-h5 mb-6">Customer Reviews</h2>

      <!-- Add Review Form (only for users) -->
      <v-card v-if="isUser" class="mb-6 pa-4">
        <v-card-title>Write a Review</v-card-title>

        <v-card-text>
          <v-form @submit.prevent="submitReview" ref="reviewForm">
            <v-textarea
              v-model="newReview"
              label="Your Review"
              :rules="[rules.required, rules.maxLength]"
              rows="3"
              counter="500"
              required
            ></v-textarea>

            <v-btn
              type="submit"
              color="primary"
              class="mt-2"
              :loading="submitting"
              :disabled="!newReview.trim()"
            >
              Submit Review
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- No reviews message -->
      <v-alert v-if="reviews.length === 0" type="info" class="mt-4">
        No reviews yet. Be the first to review this product!
      </v-alert>
      <!-- Reviews List -->
      <div v-else>
        <v-card v-for="review in reviews" :key="review.id" class="mb-4">
          <v-card-title class="d-flex justify-space-between">
            <div>
              <span class="text-h6">{{ review.userName }}</span>
              <span class="text-caption ml-2">{{
                formatDate(review.date)
              }}</span>
            </div>
            <v-chip size="small" color="primary" v-if="review.likes > 0">
              {{ review.likes }} {{ review.likes === 1 ? "like" : "likes" }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            {{ review.text }}
          </v-card-text>

          <v-card-actions>
            <v-btn
              variant="text"
              size="small"
              :color="
                isReviewLiked(review.id, likedReviews) ? 'grey' : 'primary'
              "
              @click="handleToggleReviewLike(review.id)"
            >
              {{ isReviewLiked(review.id, likedReviews) ? "Liked" : "Like" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>

    <!-- Product not found -->
    <v-alert v-else type="warning" class="mt-4"> Product not found. </v-alert>
  </v-container>
</template>

<script setup>
import { showGlobalMessage } from "@/eventBus";
import axiosInstance from "@/plugins/axios";
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  loadLikedProducts,
  isProductLiked,
  toggleLike,
  buyProduct,
  loadProductReviews,
  saveReview,
  loadLikedReviews,
  isReviewLiked,
  toggleReviewLike,
  formatDate,
} from "@/utils/productUtils";

const router = useRouter();
const route = useRoute();
const user = ref([]);
const loading = ref(true);
const error = ref(null);
const product = ref(null);
const likedProducts = ref([]);
const likedReviews = ref([]);
const reviews = ref([]);
const showFullDescription = ref(false);
const newReview = ref("");
const submitting = ref(false);
const reviewForm = ref(null);

// Validation rules
const rules = {
  required: (v) => !!v || "This field is required",
  maxLength: (v) => (v && v.length <= 500) || "Maximum 500 characters allowed",
};

// Check if current user is a regular user not seller or useradmin
const isUser = computed(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === "USER";
});

const fetchProductDetails = async (productId) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    product.value = {
      id: response.data.id,
      name: response.data.name,
      image: response.data.image_url || "https://picsum.photos/id/20/150",
      description: response.data.description,
      price: response.data.price,
      quantity: response.data.quantity,
      sellerName: response.data.user.firstName || "Unknown Seller",
    };
    // Load reviews for this product
    reviews.value = loadProductReviews(productId);
  } catch (error) {
    console.error("Error fetching product details:", error);
    error.value = "Failed to load product details. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Handle toggle like for product
const handleToggleLike = (productId) => {
  likedProducts.value = toggleLike(productId, likedProducts.value);
};

// Handle buy product
const handleBuyProduct = (product) => {
  buyProduct(product);
};

// Handle toggle like for review
const handleToggleReviewLike = (reviewId) => {
  likedReviews.value = toggleReviewLike(
    reviewId,
    product.value.id,
    likedReviews.value
  );
};

// Submit a new review
const submitReview = async () => {
  if (!newReview.value.trim()) {
    return;
  }

  submitting.value = true;

  try {
    const success = saveReview(product.value.id, newReview.value);

    if (success) {
      // Reload reviews
      reviews.value = loadProductReviews(product.value.id);
      newReview.value = "";
      reviewForm.value.resetValidation();
    }
  } catch (err) {
    console.error("Error submitting review:", err);
  } finally {
    submitting.value = false;
  }
};

// Function to add product to recently visited
const addToRecentlyVisited = (productId) => {
  console.log("in addToRecentlyVisited");
  if (!productId) return;

  try {
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
  } catch (error) {
    console.error("Error adding to recently visited:", error);
  }
};

// Load data on component mount
onMounted(() => {
  const productId = route.params.id;
  if (productId) {
    console.log("On Mounted function");
    fetchProductDetails(productId);
    likedProducts.value = loadLikedProducts() || [];
    likedReviews.value = loadLikedReviews() || [];
    // Add to recently visited
    addToRecentlyVisited(productId);
  } else {
    error.value = "Product ID is missing.";
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
