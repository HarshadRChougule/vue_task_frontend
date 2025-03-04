<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="email"
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login">Login</v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p>
              Don't have an account?
              <router-link to="/signup">Sign Up</router-link>
            </p>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// import axios from "axios";
import { userStore } from "@/store/userStore";
import axiosInstance from "@/plugins/axios";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);

const snackbar = ref({
  show: false,
  message: "",
  color: "success",
});

const showSnackbar = (message, color) => {
  snackbar.value = {
    show: true,
    message,
    color,
  };
};
//login method
const login = async () => {
  //set loader on
  loading.value = true;
  try {
    //call login api
    const res = await axiosInstance.post("auth/login", {
      email: email.value,
      password: password.value,
    });
    console.log(res);
    //check if status get 200, show sucess
    //else show error
    //TODO

    //set data to localstorage
    const userData = res.data;

    // Set data to userStore
    userStore.setUser({
      id: userData.userId,
      role: userData.userType,
      name: `User ${userData.userId.substr(0, 5)}`, // Create a generic name using part of the userId
      ...userData,
    });
    // Set access token
    localStorage.setItem("accessToken", userData.token);

    // Store a message to show after navigation
    sessionStorage.setItem(
      "initialMessage",
      JSON.stringify({
        text: "Login successful",
        color: "success",
      })
    );

    // Navigate to the appropriate dashboard
    if (userData.userType === "SELLER") {
      router.push("/seller/dashboard");
    } else if (userData.userType === "USER") {
      router.push("/");
    } else if (userData.userType === "ADMIN") {
      router.push("/admin/dashboard");
    }
  } catch (error) {
    console.error("Login error:", error);
    showMessage("Login failed. Please check your credentials.", "error");
  } finally {
    loading.value = false;
  }
};
</script>
