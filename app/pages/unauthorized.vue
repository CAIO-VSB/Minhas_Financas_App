<script setup lang="ts">

import Restricted from "~/assets/img-error-401.svg"

const goToLogin = () => {
  navigateTo("/login-page")
}

</script>

<template>
  <v-empty-state
    :image="Restricted"
    size="350px"
    title="Código do erro"
  >
    <template #title>
      <div class="text-h3 mt-6 font-weight-medium">
        Acesso restrito
      </div>
      <div style="font-weight: 500; margin-top: 10px;">
        <p>Código do erro: 401</p>
      </div>
    </template>

    <template #text>
      <div class="text-body-5 text-medium-emphasis">
        Você precisa estar autenticado para acessar esta página.  
        Faça login para continuar acompanhando suas finanças com segurança.
      </div>
    </template>

    <template #actions>
      <v-btn
        class="text-none mt-4"
        color="primary"
        elevation="3"
        rounded="lg"
        size="default"
        @click="goToLogin"
      >
        Ir para o login
      </v-btn>
    </template>
  </v-empty-state>
</template>

<style scoped>
::v-deep(.v-empty-state__text) {
  font-size: 1.2rem;
  max-width: 750px !important;
}
</style>