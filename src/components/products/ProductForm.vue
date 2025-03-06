<template>
  <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid">
    <v-container>
      <v-row>
        <!-- Product Name -->
        <v-col cols="12">
          <v-text-field
            v-model="formData.name"
            label="Product Name"
            :rules="[rules.required]"
            required
            variant="outlined"
          ></v-text-field>
        </v-col>

        <!-- Product Image URL -->
        <v-col cols="12">
          <v-text-field
            v-model="formData.image"
            label="Image URL"
            :rules="[rules.required, rules.url]"
            required
            variant="outlined"
            hint="Enter a valid URL for the product image"
          ></v-text-field>
        </v-col>

        <!-- Image Preview -->
        <v-col cols="12" class="d-flex justify-center">
          <v-img
            :src="formData.image"
            max-width="200"
            max-height="200"
            contain
            class="bg-grey-lighten-2 rounded"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey-lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>

        <!-- Product Description -->
        <v-col cols="12">
          <v-textarea
            v-model="formData.description"
            label="Description"
            :rules="[rules.required, rules.maxLength]"
            required
            variant="outlined"
            counter="2000"
            rows="4"
            auto-grow
          ></v-textarea>
        </v-col>

        <!-- Product Price -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="formData.price"
            label="Price"
            :rules="[rules.required, rules.positiveNumber]"
            required
            variant="outlined"
            type="number"
            step="0.01"
            min="0"
            prefix="$"
          ></v-text-field>
        </v-col>

        <!-- Product Quantity -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="formData.quantity"
            label="Quantity"
            :rules="[rules.required, rules.integer, rules.positiveNumber]"
            required
            variant="outlined"
            type="number"
            step="1"
            min="0"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Form Actions -->
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn
            variant="text"
            color="primary"
            class="mr-4"
            @click="$emit('cancel')"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            :disabled="!isFormValid"
            :loading="loading"
          >
            {{ editMode ? "Update" : "Save" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save", "cancel"]);

const form = ref(null);
const isFormValid = ref(false);
const loading = ref(false);

//form validation rule
const rules = {
  required: (v) => !!v || "This field is required",
  url: (v) => {
    const pattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return pattern.test(v) || "Please enter a valid URL";
  },
  maxLength: (v) =>
    (v && v.length <= 2000) || "Maximum 2000 characters allowed",
  positiveNumber: (v) => v >= 0 || "Value must be positive",
  integer: (v) => Number.isInteger(v) || "Value must be an integer",
};

// Form data
const formData = reactive({
  id: null,
  name: "",
  image: "",
  description: "",
  price: 0,
  quantity: 0,
});
// Initialize form data from props
onMounted(() => {
  if (props.product) {
    Object.keys(formData).forEach((key) => {
      formData[key] = props.product[key];
    });
  }
});

// Watch for changes in the product prop
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      Object.keys(formData).forEach((key) => {
        formData[key] = newProduct[key];
      });
    }
  },
  { deep: true }
);

//submit form
const submitForm = async () => {
  const isValid = await form.value.validate();

  if (isValid.valid) {
    loading.value = true;

    try {
      // API call
      // TODO

      // Emit save event with form data
      emit("save", { ...formData });
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      loading.value = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
