<template>
  <v-layout>
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Main Content Area -->
    <v-main>
      <v-container fluid>
        <slot></slot>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  user: {
    type: Object,
    default: null,
  },
});
</script>
