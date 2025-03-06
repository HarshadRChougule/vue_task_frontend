<template>
  <DashboardLayout :user="user">
    <WelcomeMessage :user="user" />
    <v-container class="fill-hight" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6" md="8">
          <v-card class="elevation-12">
            <v-card-text class="text-center">
              <h1 class="text-h4 font-weight-bold md-4">
                Welcome to E-comm vue app
              </h1>
              <p class="text-body-1">This is a basic home page.</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </DashboardLayout>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const user = ref(null);

import DashboardLayout from "../components/layouts/DashboardLayout.vue";
import WelcomeMessage from "../components/dahboard/WelcomeMessage.vue";
//Load user data on component mount
onMounted(() => {
  const userJson = localStorage.getItem("user");
  if (userJson) {
    user.value = JSON.parse(userJson);
  } else {
    //TODO
  }
});
</script>
