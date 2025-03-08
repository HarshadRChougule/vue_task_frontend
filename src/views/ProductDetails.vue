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
        <v-col cols="12">
          <v-btn
            prepend-icon="mdi-arrow-left"
            variant="text"
            @click="router.back()"
          >
            Back to the Products
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-img
            height="400"
            cover
            :src="product.image"
            class="rounded-lg bg-grey-lighten-2"
          >
          </v-img>
        </v-col>
        <v-col cols="12" md="6">
          <h1 class="text-h3 mb-2">{{ product.name }}</h1>

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

          <p class="text-body-1 mb-6">{{ product.description }}</p>

          <div class="d-flex mb-6">
            <v-btn
              variant="outlined"
              :color="isProductLiked(product.id) ? 'grey' : 'primary'"
              class="mr-4"
              @click="toggleLike(product.id)"
            >
              {{ isProductLiked(product.id) ? "Liked" : "Like" }}
            </v-btn>

            <v-btn
              color="primary"
              size="large"
              @click="buyProduct(product)"
              :disabled="product.quantity <= 0"
            >
              Buy Now
            </v-btn>
          </div>
        </v-col>
      </v-row>
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

const router = useRouter();
const route = useRoute();
const user = ref([]);
const loading = ref(true);
const error = ref(null);
const product = ref(null);
const likedProducts = ref([]);

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
    };
  } catch (error) {
    console.error("Error fetching product details:", err);
    error.value = "Failed to load product details. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Load liked products from localStorage
const loadLikedProducts = () => {
  const userId = JSON.parse(localStorage.getItem("currentUser"))?.id;
  if (userId) {
    const liked = JSON.parse(
      localStorage.getItem(`likedProducts_${userId}`) || "[]"
    );
    likedProducts.value = liked;
  }
};

// Check if product is liked
const isProductLiked = (productId) => {
  return likedProducts.value.includes(productId);
};

// Toggle like
const toggleLike = (productId) => {
  const userId = JSON.parse(localStorage.getItem("currentUser"))?.id;
  if (!userId) {
    showGlobalMessage("Please login to like products", "error");
    return;
  }

  if (isProductLiked(productId)) {
    likedProducts.value = likedProducts.value.filter((id) => id !== productId);
    showGlobalMessage("Product removed from liked items", "info");
  } else {
    likedProducts.value.push(productId);
    showGlobalMessage("Product liked successfully", "success");
  }

  // Save to localStorage
  localStorage.setItem(
    `likedProducts_${userId}`,
    JSON.stringify(likedProducts.value)
  );
};

// Buy product
const buyProduct = (product) => {
  showGlobalMessage(`Successfully purchased ${product.name}`, "success");
};

// Load data on component mount
onMounted(() => {
  const productId = route.params.id;
  if (productId) {
    fetchProductDetails(productId);
    loadLikedProducts();
  } else {
    error.value = "Product ID is missing.";
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
