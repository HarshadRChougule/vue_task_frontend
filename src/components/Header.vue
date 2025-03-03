<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-title>My Vue App</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn text to="/">Home</v-btn>
    <template v-if="isLoggedIn">
      <v-btn text to="/seller/dashboard" v-if="isSeller">Dashboard</v-btn>
      <v-btn text to="/" v-if="isUser"> My Orders</v-btn>
      <v-btn text @click="logout">Logout</v-btn>
    </template>
    <template v-if="!isLoggedIn">
      <v-btn text to="/login">Login</v-btn>
      <v-btn text to="/signup">Sign Up</v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "@/store/userStore";

const router = useRouter();

const isLoggedIn = computed(() => {
  return userStore.user && Object.keys(userStore.user).length > 0;
});

const isSeller = computed(() => {
  return userStore.user && userStore.user.role === "SELLER";
});

const isUser = computed(() => {
  return userStore.user && userStore.user.role === "USER";
});

const logout = () => {
  userStore.clearUser();
  router.push("/login");
};
</script>
