<script setup>
  import MiddlewareToast from "~/components/MiddlewareToast.vue";

</script>

<template>
  <v-app>
    <NuxtLoadingIndicator color="#0096FF" :height="5"/>
    <NuxtLayout>
      <MiddlewareToast />
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
