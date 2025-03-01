<template>
  <v-container>
    <h1>Seller Dashboard</h1>
    <p>Welcome, {{ user.name }}!</p>
    <v-btn @click="logout">Logout</v-btn>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref({});

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem("user") || "{}");
});

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  router.push("/login");
};
</script>
