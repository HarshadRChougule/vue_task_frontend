<template>
  <v-card class="mb-6">
    <v-card-text>
      <div class="d-flex align-center mb-4">
        <v-avatar size="64" class="mr-4">
          <v-img
            :src="
              user?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'
            "
            alt="User Avatar"
          ></v-img>
        </v-avatar>
        <div>
          <h1 class="text-h4">Welcome, {{ user?.name || "Guest User" }}!</h1>
          <p class="text-subtitle-1 text-grey">{{ welcomeMessage }}</p>
        </div>
      </div>

      <v-divider class="mb-4"></v-divider>

      <p>{{ roleSpecificMessage }}</p>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});

// Computed properties for welcome messages
const welcomeMessage = computed(() => {
  const currentTime = new Date().getHours();

  if (currentTime < 12) {
    return "Good morning! Ready to start your day?";
  } else if (currentTime < 18) {
    return "Good afternoon! Hope your day is going well.";
  } else {
    return "Good evening! Wrapping up for the day?";
  }
});

const roleSpecificMessage = computed(() => {
  if (!props.user) return "";

  switch (props.user.role) {
    case "SUPER_ADMIN":
      return "As a Super User, you have full access to all features including user management and product administration.";
    case "SELLER":
      return "As a Seller, you can manage your products and view your sales dashboard.";
    case "USER":
      return "As a User, you can browse products, make purchases, and manage your account.";
    default:
      return "Welcome to our platform!";
  }
});
</script>
