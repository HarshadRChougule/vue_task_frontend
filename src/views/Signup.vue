<template>
  <v-continer class="fill-height" fluid>
    <v-row aligh="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Sign Up</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="signup" ref="form">
              <v-text-field
                v-model="firstName"
                label="First Name"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                v-model="lastName"
                label="Last Name"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="[rules.required, rules.minLength]"
                required
              ></v-text-field>
              <v-select
                v-model="userType"
                :items="userTypes"
                label="User Type"
                :rules="[rules.required]"
                required
              ></v-select>
              <template v-if="userType === 'SELLER'">
                <v-text-field
                  v-model="companyName"
                  label="Company Name"
                  :rules="[rules.required]"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="gstin"
                  label="GSTIN"
                  :rules="[rules.required, rules.gstin]"
                  required
                ></v-text-field>
              </template>
              <v-btn
                color="primary"
                class="mt-4"
                type="submit"
                block
                :loading="loading"
              >
                Sign Up
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p>
              Already have an account?
              <router-link to="/login">Login</router-link>
            </p>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-continer>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axiosInstance from "@/plugins/axios";

const router = useRouter();
const form = ref(null);
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const userType = ref("USER");
const userTypes = ref(["USER", "SELLER"]);
const companyName = ref("");
const gstin = ref("");
const loading = ref(false);

const rules = {
  required: (v) => !!v || "This field is required",
  email: (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
  minLength: (v) =>
    v.length >= 6 || "Password must be at least 6 characters long",
  gstin: (v) =>
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v) ||
    "Invalid GSTIN format",
};
const signup = async () => {
  if (!form.value.validate()) {
    return false;
  }
  loading.value = true;

  try {
    //Set userData
    console.log(userType.value);
    const userData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      userType: userType.value,
      role: userType.value === "SELLER" ? "SELLER" : "USER",
    };
    //check seller and user condition and add Company name and gst
    if (userType.value === "SELLER") {
      userData.companyName = companyName.value;
      userData.GSTIN = gstin.value;
    }
    console.log(userData);
    //save data
    const response = await axiosInstance.post("/auth/signup", userData);
    //is data is saved show sucess
    console.log("Signup successful:", response.data);
    //or show error
    //TODO - show error

    // Store a message to show after navigation
    sessionStorage.setItem(
      "initialMessage",
      JSON.stringify({
        text: "Signup successful! Please login.",
        color: "success",
      })
    );

    router.push("/login");
  } catch (error) {
    console.error("Signup error:", error);
    showMessage("Login failed. Please check your credentials.", "error");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
