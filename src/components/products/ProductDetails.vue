<template>
  <v-container>
    <v-row>
      <!-- Product Image -->
      <v-col cols="12" md="4" class="d-flex justify-center align-center">
        <v-img
          :src="product.image"
          max-width="300"
          contain
          class="rounded"
        ></v-img>
      </v-col>

      <!-- Product Details -->
      <v-col cols="12" md="8">
        <h2 class="text-h4 mb-2">{{ product.name }}</h2>

        <v-chip color="success" class="mb-4" v-if="product.quantity > 0">
          In Stock: {{ product.quantity }}
        </v-chip>
        <v-chip color="error" class="mb-4" v-else> Out of Stock </v-chip>

        <div class="text-h5 mb-4 primary--text">
          ₹{{ product.price.toFixed(2) }}
        </div>

        <div class="text-subtitle-1 mb-4">Product ID: {{ product.id }}</div>

        <v-divider class="mb-4"></v-divider>

        <div class="text-body-1 mb-6">{{ product.description }}</div>

        <v-row>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              color="primary"
              variant="text"
              class="mr-2"
              @click="$emit('edit')"
            >
              Edit
            </v-btn>
            <v-btn color="primary" @click="$emit('close')"> Close </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
});

defineEmits(["close", "edit"]);
</script>
<style lang="scss" scoped></style>
