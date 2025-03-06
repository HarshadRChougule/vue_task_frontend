<template>
  <v-app>
    <Header />
    <v-main>
      <router-view></router-view>
    </v-main>
    <Footer />
    <FlotMessage
      v-if="message"
      :text="message.text"
      :color="message.color"
      :timeout="message.timeout"
      :location="message.location"
      @close="clearMessage"
    />
    <!-- Global Message Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, provide, onMounted, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
//import router from "./router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import FlotMessage from "./components/FlotMessage.vue";
//import { userStore } from "./store/userStore";
import { checkStoredMessage } from "@/eventBus";

// Snackbar state
const snackbar = ref({
  show: false,
  text: "",
  color: "info",
});

// Event handler for global messages
const handleShowMessage = (event) => {
  const { text, type } = event.detail;

  // Map type to color
  let color;
  switch (type) {
    case "success":
      color = "success";
      break;
    case "error":
      color = "error";
      break;
    case "warning":
      color = "warning";
      break;
    default:
      color = "info";
  }

  // Update snackbar
  snackbar.value = {
    show: true,
    text,
    color,
  };
};

// Message state
const message = ref(null);
const route = useRoute();

// Message functions
const showMessage = (
  text,
  color = "success",
  timeout = 3000,
  location = "top-right"
) => {
  console.log("Showing message:", text);
  message.value = { text, color, timeout, location };
};

const clearMessage = () => {
  message.value = null;
};

// Provide message functions to child components
provide("showMessage", showMessage);

//Check for messages on route changes
watch(
  () => route.path,
  () => {
    console.log("Route changed to:", route.path);
    checkForInitialMessage();
  }
);

// Check for initial message
const checkForInitialMessage = () => {
  console.log("in checkForInitialMessage ----------------");
  const initialMessage = sessionStorage.getItem("initialMessage");
  console.log("Checking for initial message:", initialMessage);

  if (initialMessage) {
    try {
      const { text, color } = JSON.parse(initialMessage);
      console.log("Found message:", text, color);

      if (text) {
        showMessage(text, color);
      }
      sessionStorage.removeItem("initialMessage");
    } catch (error) {
      console.error("Error parsing initial message:", error);
      sessionStorage.removeItem("initialMessage");
    }
  }
};

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener("show-message", handleShowMessage);
});

// Check for messages on initial load
onMounted(() => {
  console.log("App mounted, checking for initial message");
  window.addEventListener("show-message", handleShowMessage);
  // Check for stored messages
  checkStoredMessage();
  checkForInitialMessage();
});
</script>
