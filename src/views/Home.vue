<template>
  <DashboardLayout :user="user">
    <WelcomeMessage :user="user" />
    <v-container class="fill-hight" fluid>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6">Recommended Products</h1>
          <!-- Product Lodaing -->
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
          <!-- Recommended Products Horizontal Scroll -->
          <div v-else-if="products.length > 0">
            <v-sheet class="mx-auto">
              <v-slide-group show-arrows class="pa-4">
                <v-slide-group-item
                  v-for="product in products"
                  :key="product.id"
                >
                  <v-card
                    class="ma-2"
                    width="280"
                    height="380"
                    @click="navigateToProduct(product.id)"
                  >
                    <v-img
                      :src="product.image"
                      height="180"
                      cover
                      class="bg-grey-lighten-2"
                    ></v-img>

                    <v-card-title class="text-truncate">
                      {{ product.name }}
                    </v-card-title>

                    <v-card-subtitle class="text-h6 font-weight-bold">
                      ₹{{ product.price.toFixed(2) }}
                    </v-card-subtitle>

                    <v-card-text class="text-truncate">
                      {{ product.description }}
                    </v-card-text>

                    <v-card-actions>
                      <v-btn
                        variant="outlined"
                        :color="isProductLiked(product.id) ? 'grey' : 'primary'"
                        size="small"
                        class="mr-2"
                        @click.stop="toggleLike(product.id)"
                      >
                        {{ isProductLiked(product.id) ? "Liked" : "Like" }}
                      </v-btn>

                      <v-btn
                        color="primary"
                        size="small"
                        @click.stop="buyProduct(product)"
                      >
                        Buy
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-slide-group-item>
              </v-slide-group>
            </v-sheet>
          </div>
          <!-- No products message -->
          <v-alert v-else type="info" class="mt-4">
            No products available at the moment.
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </DashboardLayout>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

import DashboardLayout from "../components/layouts/DashboardLayout.vue";
import WelcomeMessage from "../components/dahboard/WelcomeMessage.vue";
import axiosInstance from "@/plugins/axios";
import { showGlobalMessage } from "@/eventBus";

const router = useRouter();
const user = ref(null);
const loading = ref(false);
const error = ref(null);
const products = ref([]);
const likedProducts = ref([]);

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axiosInstance.get("products");
    console.log("fetchProducts", response);
    products.value = response.data.map((product) => ({
      id: product._id,
      name: product.name,
      image: product.image_url || "https://picsum.photos/id/20/150",
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    }));
  } catch (error) {
    console.error("Error featching Product ", error);
    error.value = "Failed to load products. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Load liked products from localStorage
const loadLikedProducts = () => {
  const userId = JSON.parse(localStorage.getItem(user))?.id;
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

//toggle like
const toggleLike = (productId) => {
  console.log(productId);
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  if (!userId) {
    showGlobalMessage("Please login to like products", "error");
    return 0;
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
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  if (!userId) {
    showGlobalMessage("Please login to like products", "error");
    return 0;
  }
  showGlobalMessage(`Successfully purchased ${product.name}`, "success");
};

// Navigate to product details
const navigateToProduct = (productId) => {
  router.push(`/product/${productId}`);
};

//Load user data on component mount
onMounted(() => {
  const userJson = localStorage.getItem("user");
  if (userJson) {
    user.value = JSON.parse(userJson);
    loadLikedProducts();
  } else {
    //TODO
  }
  fetchProducts();
});
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
  cursor: pointer;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
</style>
