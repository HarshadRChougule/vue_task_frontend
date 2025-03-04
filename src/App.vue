<template>
  <v-app>
    <Header />
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <Footer />
    <FlotMessage
      v-if="messagingSystem.message"
      :text="messagingSystem.message.text"
      :color="messagingSystem.message.color"
      :timeout="messagingSystem.message.timeout"
      :location="messagingSystem.message.location"
    />
  </v-app>
</template>

<script>
import { provide, onMounted } from "vue";
import { useRouter } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import FlotMessage from "./components/FlotMessage.vue";
import { userStore } from "./store/userStore";
import { createMessagingSystem } from "./plugins/messaging";

const router = useRouter();
const messagingSystem = createMessagingSystem();

// Provide the messaging system to all components
provide("messagingSystem", messagingSystem);
console.log(router);
// Handle route changes for showing messages
router.afterEach((to, from) => {
  if (
    to.path === "/login" &&
    from.path &&
    from.path !== "/login" &&
    from.path !== "/signup"
  ) {
    messagingSystem.showMessage("You have been logged out", "info");
  } else if (from.path === "/login" && to.path !== "/login") {
    const userName = userStore.user?.name || "User";
    messagingSystem.showMessage(`Welcome, ${userName}!`, "success");
  }
});

// Check if we need to show a message on initial load
onMounted(() => {
  const initialMessage = sessionStorage.getItem("initialMessage");
  if (initialMessage) {
    const { text, color } = JSON.parse(initialMessage);
    messagingSystem.showMessage(text, color);
    sessionStorage.removeItem("initialMessage");
  }
});

// Clear message after 3 seconds
// function clearMessage() {
//   setTimeout(() => {
//     message.value = null;
//   }, 3000);
// }

// Watch for message changes and clear after delay
// watch(message, (newVal) => {
//   if (newVal) {
//     clearMessage();
//   }
// });

export default defineComponent({
  name: "App",
  components: {
    Header,
    Footer,
  },
});
</script>
<style lang="scss"></style>
