<template>
  <v-snackbar
    v-model="isVisible"
    :color="color"
    :timeout="timeout"
    :location="location"
  >
    {{ text }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="isVisible = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  text: String,
  color: {
    type: String,
    default: "success",
  },
  timeout: {
    type: Number,
    default: 3000,
  },
  location: {
    type: String,
    default: "top",
  },
});

const emit = defineEmits(["close"]);
const isVisible = ref(false);

// Show the snackbar when the component is mounted
onMounted(() => {
  console.log("FlotMessage mounted with text:", props.text);
  isVisible.value = true;
});

// Watch for changes to isVisible
watch(isVisible, (newVal) => {
  if (!newVal) {
    emit("close");
  }
});
</script>
