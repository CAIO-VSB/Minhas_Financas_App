<script setup>
</script>

<template>
  <v-app>
    <NuxtLoadingIndicator color="#0096FF" :height="5"/>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<style>

body, html {
  font-family: "Sora", sans-serif !important; 
}

::-webkit-scrollbar-track {
  background-color: #F4F4F4;
}

::-webkit-scrollbar {
  width: 4px;
  border-radius: 15px;
  background: #F4F4F4;
}

::-webkit-scrollbar-thumb {
  background: #dad7d7;
}
</style>
