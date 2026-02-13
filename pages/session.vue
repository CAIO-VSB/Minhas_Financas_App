<script setup lang="ts">

import Restricted from "~/assets/session-unauthorized.svg"

const dialog = ref(false)

const goToLogin = () => {
  navigateTo("/login-page")
}

</script>

<template>
<div class="text-center pa-4">
    <v-dialog
      v-model="dialog"
      max-width="600"
      persistent
    >
      <v-card
        prepend-icon="mdi-shield-lock"
        title="Sessão expirada por segurança"
        text="Por motivos de segurança, sua sessão tem duração de até 1 hora enquanto você estiver ativo no sistema. Se não houver atividade durante esse período, a sessão expira automaticamente e será necessário fazer login novamente para continuar."
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="dialog = false">
            OK
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
  <v-empty-state
    :image="Restricted"
    size="350px"
    title="Código do erro"
  >
    <template #title>
      <div class="text-h3 mt-6 font-weight-medium">
        Sessão expirada
      </div>
      <div style="font-weight: 500; margin-top: 10px;">
        <p>Código do erro: 401</p>
      </div>
    </template>

    <template #text>
      <div class="text-body-5 text-medium-emphasis">
        Sua sessão expirou por segurança.
        Faça login novamente para continuar acompanhando suas finanças.
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
        Entrar novamente
      </v-btn>
      <v-btn
        class="text-none mt-4"
        color="warning"
        elevation="3"
        rounded="lg"
        size="default"
        @click="dialog = true"
      >
        Por que isso aconteceu?
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