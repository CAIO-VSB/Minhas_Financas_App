<script setup lang="ts">

    definePageMeta({
        title: "Confirme seu novo e-mail"
    })

    import imgConfirmEmail from "~/assets/confirmEmail.svg"

    function onClickAction() {
        navigateTo({ path: "/login-page" })
    }

</script>

<template>
    <div class="container">
        <v-empty-state
        class="text-center my-12 empty-404"
        headline="Falta só mais um passo"
        title="Confirme seu novo e-mail"
        :text="'Enviamos um link de confirmação para o seu novo e-mail. Acesse essa caixa de entrada e clique no link para finalizar a alteração.'"
        size="310px"
        icon="mdi-email-check-outline"
        :image="imgConfirmEmail"
    >
        <v-btn
            color="primary"
            class="mt-6"
            rounded
            @click="onClickAction"
        >
            Voltar para o login
        </v-btn>
        </v-empty-state>
    </div>

</template>

<style scoped>

.container {
    overflow: auto;
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