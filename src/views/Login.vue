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
import axios from "axios";

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
    const res = await axios.post("http://localhost:6004/api/auth/login", {
      email: email.value,
      password: password.value,
    });
    console.log(res);
    //check if status get 200, show sucess
    //else show error

    //set data to localstorage
    const user = res.data;

    user.role = user.userType;
    const accessToken = res.data.token;
    // const {accessToken, user } = res.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    showSnackbar("Login successful", "success");

    //navigate to the user dashobard
    if (user.role === "SELLER") {
      router.push("/seller/dashboard");
    } else if (user.role === "USER") {
      router.push("/");
    } else if (user.role === "ADMIN") {
      router.push("/admin/dashboard"); // Assuming there's an admin dashboard
    }
  } catch (error) {
    console.error("Login error:", error);
    showSnackbar("Login failed. Please check your credentials.", "error");
  } finally {
    loading.value = false;
  }
};
</script>
