<template>
  <DashboardLayout :user="user">
    <WelcomeMessage :user="user" />

    <!-- Dashboard Stats for Sellers and Super Users -->
    <v-row v-if="isSeller || isSuperAdmin">
      <v-col
        v-for="(card, index) in dashboardCards"
        :key="index"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card class="mx-auto" :color="card.cardColor">
          <v-card-text>
            <div class="text-overline mb-1">{{ card.cardTitle }}</div>
            <div class="text-h4 mb-2">
              {{ card.prefix }}{{ formatCardStat(card) }}{{ card.suffix }}
            </div>
            <v-icon :icon="card.icon" size="large"></v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-card class="mt-6" v-if="isSeller || isSuperAdmin">
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

          <v-col cols="12" sm="6" md="3" v-if="isSuperAdmin">
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

// Dashboard cards data
const dashboardCards = ref([
  {
    cardTitle: "TOTAL PRODUCTS",
    cardColor: "primary",
    cardStat: 124,
    icon: "mdi-package-variant-closed",
    prefix: "",
    suffix: "",
    format: "number",
  },
  {
    cardTitle: "TOTAL SALES",
    cardColor: "success",
    cardStat: 45750,
    icon: "mdi-currency-usd",
    prefix: "₹",
    suffix: "",
    format: "currency",
  },
  {
    cardTitle: "TOTAL ORDERS",
    cardColor: "info",
    cardStat: 267,
    icon: "mdi-cart",
    prefix: "",
    suffix: "",
    format: "number",
  },
  {
    cardTitle: "PENDING ORDERS",
    cardColor: "warning",
    cardStat: 19,
    icon: "mdi-clock-outline",
    prefix: "",
    suffix: "",
    format: "number",
  },
]);

// Format card stat based on its type
const formatCardStat = (card) => {
  if (card.format === "currency") {
    return card.cardStat.toLocaleString();
  }
  return card.cardStat;
};

// Computed properties for role-based access
const isSeller = computed(() => {
  return user.value && user.value.role === "SELLER";
});

const isSuperAdmin = computed(() => {
  return user.value && user.value.role === "SUPER_ADMIN";
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
