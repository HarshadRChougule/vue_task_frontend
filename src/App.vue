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
    <FlotMessage
      v-if="messageState"
      :text="messageState.text"
      :color="messageState.color"
      :timeout="messageState.timeout"
      :location="messageState.location"
      @close="messageState = null"
    />
  </v-app>
</template>

<script setup>
import { ref, provide, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
//import router from "./router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import FlotMessage from "./components/FlotMessage.vue";
//import { userStore } from "./store/userStore";
import { messageState } from "./eventBus";

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

// Check for messages on initial load
onMounted(() => {
  console.log("App mounted, checking for initial message");
  checkForInitialMessage();
});
</script>
