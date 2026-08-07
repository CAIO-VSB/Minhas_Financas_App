<script setup lang="ts">
    definePageMeta({ title: "Confirmação de e-mail" })
</script>

<template>
    <div class="container">
        <v-empty-state
        headline="Confirmação recebida"
        title="Link confirmado com sucesso"
        text="Se esta era a última etapa pendente, seu e-mail já foi atualizado e você pode fazer login normalmente. Caso ainda tenha recebido outro e-mail de confirmação, é só clicar nele também para concluir a alteração."
        size="420px"
        color="success"
        icon="mdi-email-check"
        class="mt-3 pa-2"
    >
        <v-btn color="primary" class="mt-6" rounded @click="navigateTo('/login-page')">
            Ir para o login
        </v-btn>
    </v-empty-state>
    </div>

</template>

<style scoped>

.container {
    overflow: auto;
    display: flex;
    justify-content: center;
}

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