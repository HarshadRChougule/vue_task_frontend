<template>
  <v-snackbar
    v-model="show"
    :color="color"
    :timeout="timeout"
    :location="location"
  >
    {{ text }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="show = false"> Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  text: String,
  color: {
    type: String,
    default: "success",
  },
  timeout: {
    type: Number,
    default: 300,
  },
  location: {
    type: String,
    default: "top",
  },
});

const show = ref(true);
</script>

<style lang="scss" scoped></style>
