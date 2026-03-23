<script setup lang="ts">

    import type { NuxtError } from '#app';

    import img404 from "~/assets/robot-404.svg"

    function onClickAction () {
        navigateTo({path: "/login-page"})
    }

    const props = defineProps({
        error: Object as () => NuxtError,
    })

</script>

<template>
    <v-empty-state
    class="text-center my-12 empty-404"
    headline="Página não encontrada"
    title="Código do erro: 404"
    text="Ops! Parece que você tentou acessar uma área que não existe. Verifique a URL ou volte para a tela de login."
    size="420px"
    :image="img404"
    >
  <v-btn
    color="primary"
    class="mt-6"
    rounded
    @click="onClickAction"
  >
    Tela de login
  </v-btn>
</v-empty-state>

</template>

<style scoped>

::v-deep(.v-empty-state__text) {
    font-size: 1.3rem;
    max-width: 750px !important;
    margin-top: 20px;
}

::v-deep(.v-empty-state__title) {
    font-size: 1.2rem;
    margin-top: 5px;
    font-weight: 600;
}

</style>