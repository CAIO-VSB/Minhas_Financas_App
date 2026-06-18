<script setup>
</script>

<template>
  <v-app class="fill-height">
    <NuxtLoadingIndicator color="#0096FF" :height="5"/>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<style>



body, html, #__nuxt {
  font-family: var(--font-main);
  height: 100%;
}

body {
  overflow: hidden;
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
