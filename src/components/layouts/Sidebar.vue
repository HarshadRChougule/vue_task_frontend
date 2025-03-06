<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
    color="grey-lighten-4"
    border="none"
  >
    <v-list-item
      prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
      :title="user?.name || 'User'"
      :subtitle="user?.role || ''"
      @click="rail = !rail"
    >
      <template v-slot:append>
        <v-btn
          variant="text"
          icon="mdi-chevron-left"
          @click.stop="rail = !rail"
        ></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        value="dashboard"
        to="/dashboard"
        :active="$route.path === '/dashboard'"
      ></v-list-item>

      <v-list-item
        v-if="isSeller || isSuperAdmin"
        prepend-icon="mdi-package-variant-closed"
        title="Products"
        value="products"
        to="/products"
        :active="$route.path === '/products'"
      ></v-list-item>

      <v-list-item
        v-if="isSuperAdmin"
        prepend-icon="mdi-account-multiple"
        title="Users"
        value="users"
        to="/users"
        :active="$route.path === '/users'"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-home"
        title="Home"
        value="home"
        to="/"
        :active="$route.path === '/'"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-logout"
        title="Logout"
        value="logout"
        @click="logout"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { showGlobalMessage } from "@/eventBus";

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});

const router = useRouter();
const drawer = ref(true);
const rail = ref(false);

// Computed properties for role-based access
const isSeller = computed(() => {
  return props.user && props.user.role === "SELLER";
});

const isSuperAdmin = computed(() => {
  return props.user && props.user.role === "SUPER_ADMIN";
});

// Logout function
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showGlobalMessage("Logged out successfully", "success");
  router.push("/login");
};
</script>
