<template>
  <DashboardLayout :user="user">
    <WelcomeMessage :user="user" />
    <v-row v-if="isSeller || isSuperAdmin">
      <v-col col="12" sm="6" md="3">
        <v-card> </v-card>
      </v-col>
    </v-row>
    <!-- Quick Actions -->
    <v-card class="mt-6" v-if="isSeller || isSuperUser">
      <v-card-title>
        <v-icon start icon="mdi-lightning-bolt"></v-icon>
        Quick Actions
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-btn block color="primary" prepend-icon="mdi-plus" to="/products">
              Add New Product
            </v-btn>
          </v-col>

          <v-col cols="12" sm="6" md="3" v-if="isSuperUser">
            <v-btn
              block
              color="warning"
              prepend-icon="mdi-account-plus"
              to="/users"
            >
              Add New User
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "@/store/userStore";
import DashboardLayout from "../components/layouts/DashboardLayout.vue";
import WelcomeMessage from "../components/dahboard/WelcomeMessage.vue";

const router = useRouter();
const user = ref(null);

// Mock data for dashboard stats
const stats = ref({
  totalProducts: 124,
  totalSales: 45750,
  totalOrders: 267,
  pendingOrders: 18,
});

// Computed properties for role-based access
const isSeller = computed(() => {
  return user.value && user.value.role === "SELLER";
});

const isSuperUser = computed(() => {
  return user.value && user.value.role === "SUPER_USER";
});

// Load user data on component mount
onMounted(() => {
  const userJson = localStorage.getItem("user");
  if (userJson) {
    user.value = JSON.parse(userJson);
  } else {
    // Redirect to login if no user data is found
    router.push("/login");
  }
});

// Dynamic section title
//TODO
const sectionTitle = computed(() => {
  switch (currentSection.value) {
    case "dashboard":
      return "Dashboard Overview";
    case "products":
      return "Products Management";
    case "users":
      return "Users Management";
    case "settings":
      return "Settings";
    default:
      return "Dashboard";
  }
});
</script>
