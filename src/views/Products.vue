<template>
  <DashboardLayout :user="user">
    <v-container fluid>
      <!-- Page Header -->
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h1 class="text-h4">Products</h1>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="openProductForm()"
          >
            Add New Product
          </v-btn>
        </v-col>
      </v-row>
      <!-- Search and Filter -->
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="search"
            label="Search Products"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-4"
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- Products Table -->
      <v-card>
        <v-data-table
          :headers="headers"
          :items="filteredProducts"
          :search="search"
          :loading="loading"
          class="elevation-1"
        >
          <!-- img column -->
          <template #[`item.image`]="{ item }">
            <v-avatar size="40">
              <v-img :src="item.image" :alt="item.name"></v-img>
            </v-avatar>
          </template>
          <!-- Price Column -->
          <template #[`item.price`]="{ item }">
            ${{ item.price.toFixed(2) }}
          </template>
          <!-- Actions Column -->
          <template #[`item.actions`]="{ item }">
            <div class="d-flex action-buttons">
              <v-btn
                icon
                variant="outlined"
                color="primary"
                size="small"
                @click="viewProduct(item)"
                class="mr-1 action-btn"
              >
                <v-icon size="small" color="primary">mdi-eye</v-icon>
              </v-btn>
              <v-btn
                icon
                variant="outlined"
                color="warning"
                size="small"
                @click="editProduct(item)"
                class="mr-1 action-btn"
              >
                <v-icon size="small" color="warning">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                variant="outlined"
                color="error"
                size="small"
                @click="confirmDelete(item)"
                class="action-btn"
              >
                <v-icon size="small" color="error">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">Delete Product</v-card-title>
          <v-card-text>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="deleteDialog = false"
              >Cancel</v-btn
            >
            <v-btn color="error" variant="text" @click="deleteProduct"
              >Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Product Form Dialog -->
      <v-dialog v-model="formDialog" max-width="800px">
        <v-card>
          <v-card-title class="text-h5">
            {{ editMode ? "Edit Product" : "Add New Product" }}
          </v-card-title>
          <v-card-text>
            <ProductForm
              :product="currentProduct"
              :edit-mode="editMode"
              @save="saveProduct"
              @cancel="formDialog = false"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- Product Details Dialog -->
      <v-dialog v-model="detailsDialog" max-width="800px">
        <v-card>
          <v-card-title class="text-h5">Product Details</v-card-title>
          <v-card-text>
            <ProductDetails
              :product="currentProduct"
              @close="detailsDialog = false"
              @edit="editFromDetails"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showGlobalMessage } from "@/eventBus";
import axiosInstance from "@/plugins/axios";

//views
import DashboardLayout from "@/components/layouts/DashboardLayout.vue";
import ProductDetails from "@/components/products/ProductDetails.vue";
import ProductForm from "@/components/products/ProductForm.vue";

//veriables
const router = useRouter();
const loading = ref(true);
const user = ref(null);
const search = ref("");

//tabel headers
const headers = [
  { title: "ID", key: "id", sortable: true },
  { title: "Image", key: "image", sortable: false },
  { title: "Name", key: "name", sortable: true },
  { title: "Price", key: "price", sortable: true },
  { title: "Quantity", key: "quantity", sortable: true },
  { title: "Actions", key: "actions", sortable: false, align: "center" },
];

const products = ref([]);
// dialog control veriable
const deleteDialog = ref(false);
const formDialog = ref(false);
const detailsDialog = ref(false);
const editMode = ref(false);
const currentProduct = ref({
  id: null,
  name: "",
  image: "",
  description: "",
  price: 0,
  quantity: 0,
});

// Fetch products from API
const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await axiosInstance.get("/products");
    console.log(response);
    products.value = response.data.map((product) => ({
      id: product._id,
      name: product.name,
      image: product.image_url || "https://picsum.photos/id/20/150",
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    }));
    showGlobalMessage("Products loaded successfully", "success");
  } catch (error) {
    console.error("Error fetching products:", error);
    showGlobalMessage(
      error.response?.data?.message || "Failed to load products",
      "error"
    );
    // Fallback to empty array if API fails
    products.value = [];
  } finally {
    loading.value = false;
  }
};
const productToDelete = ref(null);

//search filter
//on static data
const filteredProducts = computed(() => {
  if (!search.value) return products.value;

  const searchTerm = search.value.toLowerCase();
  return products.value.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );
});
//on database
// TODO

//main loagic
// All the methods
const openProductForm = () => {
  editMode.value = false;
  currentProduct.value = {
    id: null,
    name: "",
    image: "https://picsum.photos/id/20/150",
    description: "",
    quantity: 0,
    price: 0,
  };
  formDialog.value = true;
};

const viewProduct = (product) => {
  currentProduct.value = { ...product };
  detailsDialog.value = true;
};

const editProduct = (product) => {
  editMode.value = true;
  currentProduct.value = { ...product };
  formDialog.value = true;
};

const editFromDetails = () => {
  detailsDialog.value = false;
  editMode.value = true;
  formDialog.value = true;
};

const confirmDelete = (product) => {
  productToDelete.value = product;
  deleteDialog.value = true;
};
//delet from local
const deleteProduct = () => {
  const index = products.value.findIndex(
    (p) => p.id === productToDelete.value.id
  );
  if (index !== -1) {
    products.value.splice(index, 1);
    showGlobalMessage("Product deleted successfully", "success");
  }
  deleteDialog.value = false;
  productToDelete.value = null;
};
//delete from api / DB
// TODO

//save / update product on local
const saveProduct = async (product) => {
  console.log("product info", product);
  if (editMode.value) {
    //update existing product
    // const index = products.value.findIndex((p) => p.id === product.id);
    // if (index !== -1) {
    //   products.value[index] = { ...product };
    //   showGlobalMessage("Product updated successfully", "success");
    // }

    console.log(product);
    //update existing product
    const response = await axiosInstance.put(`/products/${product.id}`, {
      name: product.name,
      image_url: product.image,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    });
    showGlobalMessage("Product updated successfully", "success");
    fetchProducts();
  } else {
    //add new product
    /***add Product loacally code 
    const newId = Math.max(0, ...products.value.map((p) => p.id)) + 1;
    products.value.push({
      ...product,
      id: newId,
    });
    */
    const response = await axiosInstance.post("/products", {
      name: product.name,
      image_url: product.image,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    });
    console.log(response);
    showGlobalMessage("Product added successfully", "success");
    fetchProducts();
  }
  //API call
  // TODO
  formDialog.value = false;
};

// Load user data on component mount
onMounted(() => {
  const userJson = localStorage.getItem("user"); // Changed from "user" to "currentUser"
  if (userJson) {
    user.value = JSON.parse(userJson);
    // Check if user has permission to access this page
    if (user.value.role !== "SELLER" && user.value.role !== "SUPER_USER") {
      router.push("/");
      showGlobalMessage(
        "You do not have permission to access this page",
        "error"
      );
    } else {
      fetchProducts();
    }
  } else {
    console.log("IN product on mound else loop");

    // Redirect to login if no user data is found
    router.push("/login");
  }

  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style lang="scss" scoped>
.action-btn {
  opacity: 1 !important;
  border: 1px solid;
  margin: 0 2px;
}

.action-btn .v-icon {
  opacity: 1 !important;
  font-size: 18px !important;
}
</style>
