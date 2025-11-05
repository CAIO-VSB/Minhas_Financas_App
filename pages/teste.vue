<script setup lang="ts">
import MiddlewareToast from '~/components/MiddlewareToast.vue';

definePageMeta({
  layout: "layout-default"
})

</script>

<!-- <script setup>

  definePageMeta({
    layout: "layout-auth",
  });

import { useAuthStore } from '~/store/modules/auth-store';

    const authStore = useAuthStore()

</script>

<template>
    <div style="background-color: red;">
    <v-snackbar
      v-model="authStore.showToastError"
      multi-line
    >
      Testando toast global

      <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    </div>
</template> -->

<template>
  <MiddlewareToast />
</template>