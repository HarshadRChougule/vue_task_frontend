<template>
  <v-app>
    <Header />
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <Footer />
    <FlotMessage v-if="message" :text="message.text" :color="message.color" />
  </v-app>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { onBeforeRouteUpdate, useRouter } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import FlotMessage from "./components/FlotMessage.vue";
import { userStore } from "./store/userStore";

const router = useRouter();
const message = ref(null);

onBeforeRouteUpdate((to, from) => {
  if (to.path === "/login" && from.path && from.path !== "/login") {
    message.value = { text: "You have been logged out", color: "info" };
  } else if (to.path !== "/login" && from.path === "/login") {
    const userName =
      userStore.user?.name || `User ${userStore.user?.id?.substr(0, 5) || ""}`;
    message.value = { text: `Welcome, ${userName}!`, color: "success" };
  } else {
    message.value = null;
  }
});

// Clear message after 3 seconds
function clearMessage() {
  setTimeout(() => {
    message.value = null;
  }, 3000);
}

// Watch for message changes and clear after delay
watch(message, (newVal) => {
  if (newVal) {
    clearMessage();
  }
});

export default defineComponent({
  name: "App",
  components: {
    Header,
    Footer,
  },
});
</script>
<style lang="scss"></style>
