<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-title>My Vue App</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn text to="/">Home</v-btn>
    <template v-if="user">
      <v-btn text to="/seller/dashboard" v-if="user.role === 'SELLER'"
        >Dashboard</v-btn
      >
      <v-btn text @click="logout">Logout</v-btn>
    </template>
    <v-btn text to="/login" v-else>Login</v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem("user") || "null");
  console.log(user);
});

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  user.value = null;
  router.push("/login");
};
</script>
