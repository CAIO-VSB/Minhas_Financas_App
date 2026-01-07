<script setup>
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>

<template>
  <v-app>
    <NuxtLoadingIndicator color="#0096FF" :height="5"/>
    <NuxtLayout>
      <VueQueryDevtools />
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
