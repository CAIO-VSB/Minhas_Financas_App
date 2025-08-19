<!-- <script setup lang="ts">
    definePageMeta({
    layout: "layout-auth"
   })

   import Toasts from '~/components/Toasts.vue'
   import type { UserForm } from '~/types/TypeUserForm'

   const loading = ref(false)
   const showPassword = ref(false)

   const logiForm = ref<UserForm>({
    email: "",
    password: ""
   })

   const errorEmail = ref(false)
   const errorPassword = ref(false)
   const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


   const listMessage = {
    emptyField: "Campo obrigatório vazio",
    userNotFound: "Email ou senhas incorretos. Tente novamente",
    formatEmail: "Formato de e-mail inválido. Por favor, verifique e tente novamente",
    formatPassword: "A senha deve conter no mínimo 6 caracteres. Corrija e tente novamente"

   }

   const errorMessage = ref(false)
   const alertMessage = ref(false)
   const currentMessage = ref("")

   const validateData = () => {

    if (!logiForm.value.email.trim()) {
        errorEmail.value = true
        errorMessage.value = true
        currentMessage.value = listMessage.emptyField
        return false
    }

    if (!regexEmail.test(logiForm.value.email)) {
        alertMessage.value = true
        currentMessage.value = listMessage.formatEmail
        return false
    }

    if (!logiForm.value.password.trim()) {
        errorPassword.value = true
        errorMessage.value = true
        currentMessage.value = listMessage.emptyField
        return false
    }

    if (logiForm.value.password.length < 6) {
        alertMessage.value = true
        currentMessage.value = listMessage.formatPassword
        return false
    }

    errorEmail.value = false
    errorPassword.value = false
    errorMessage.value = false
    return true

   }

</script>

<template>
    <v-form class="login-form">
        <div class="login__form-container flex flex-col !p-4">
            <div class="flex items-center justify-center !p-3 gap-1">
                <img src="/assets/money.png" alt="">
                <h2 class="text-2xl login__title">Minhas<strong>Finanças</strong></h2>
            </div>

            <div class="flex flex-col items-center justify-center !p-4">
                <h3 class="text-[1.3rem] !p-1 font-['Montserrat'] !font-semibold">Bem-vindo de volta!</h3>
                <p class="text-[0.82rem] text-gray-700 font-['Montserrat'] font-semibold">Acesse sua conta para continuar</p>
            </div>

            <div>
                <div>
                    <v-text-field label="E-mail"
                    title="E-mail"
                    v-model="logiForm.email"
                    type="email"
                    name="email"
                    clearable
                    prepend-inner-icon="mdi mdi-email-alert"
                    variant="filled"
                    density="comfortable"
                    :error="errorEmail"
                    ></v-text-field>
                </div>
                <div>
                    <v-text-field label="Senha"
                    title="Senha"
                    v-model="logiForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi mdi-lock-alert"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    class="cursor-pointer"
                    clearable
                    variant="filled"
                    density="comfortable"
                    :error="errorPassword"
                    >
                </v-text-field>
                </div>
            </div>

            <div>
                <v-btn
                :disabled="loading"
                :loading="loading"
                class="text-none mb-4 font-['Montserrat'] login__button"
                size="large"
                variant="flat"
                color="indigo-darken-3"
                block
                @click="validateData"
                >
                Fazer login 
                </v-btn>
            </div>

            <div class="flex justify-center items-center !p-2 text-sm login__recover-password">
                <p class="font-['Montserrat'] text-base"><nuxt-link title="Clique aqui para recuperar sua senha" to="/RecoverPage">Esqueceu sua senha?</nuxt-link></p>
            </div>

            <div class="flex justify-center items-center !p-2 text-sm login__more-login">
                <div class="bg-[#cbd5e1] flex-1 h-px"></div>
                <p class="!p-3 font-['Montserrat'] font-semibold">Ou acesse com</p>
                <div class="bg-[#cbd5e1] flex-1 h-px"></div>
            </div>

            <div class="flex justify-center items-center !p-3"> 
                <v-btn class="flex justify-center items-center font-1['Montserrat']  gap-1 login__button-google" title="Login com google">
                <template #prepend>
                    <img src="/assets/google.png" alt="">
                </template>
                </v-btn>
            </div>

            <hr style="color: #cbd5e1; margin: 15px;">

            <div class="flex justify-center items-center text-sm login__recover-password">
                <p class="font-['Montserrat'] text-base"><nuxt-link to="/RegisterPage" title="Crie sua conta">Não tem uma conta? Cadastre-se</nuxt-link></p>
            </div>

            <div>
                <Toasts 
                color="error-primary"
                :text="currentMessage"
                timer="#E57373"
                v-model="errorMessage"
                icon="mdi-alert"
                size="x-large"
                color-icon="white"
                >
                </Toasts>
            </div>

            <div>
                <Toasts 
                color="alert-primary"
                :text="currentMessage"
                timer="#F0F4C3"
                v-model="alertMessage"
                icon="mdi-information"
                size="x-large"
                color-icon="black"
                >
                </Toasts>
            </div>

        </div>

    </v-form>
</template>

<style lang="scss" scoped>

.login-form {
    max-width: 600px;
    width: 100%;
    height: auto;
    padding: 10px;
    z-index: 1;
}

.login__form-container {
    padding: 10px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    font-family: "Montserrat",sans-serif;
}

.login__title {
    font-weight: 400;
    color: #2c3e50;
    font-family: "Montserrat", sans-serif;
}

.login__recover-password {
    color: $color-primary-link;
}

.login__recover-password:hover {
    color: #2c3e50;
}

.login__button-google {
    width: 100%;
    box-shadow: none;
    background-color: white;
    border: 1px solid rgba(128, 128, 128, 0.425);
    border-radius: 20px;
}

.login__button-google:hover {
    transform: translateY(-5px);
}

.login__button {
   background-color: $color-primary-button !important;
   border-radius: 20px;
}

.login__button:hover {
    transform: translateY(-5px);
}


</style> -->

<script lang="ts" setup>

import img01 from "@/assets/img-01.svg"
import img02 from "@/assets/img-02.svg"
import img03 from "@/assets/img-03.svg"

const items = [
  { src: img01 },
  { src: img02 },
  {src: img03}
]

</script>

<template>

    <v-carousel cycle :interval="6000" :show-arrows="false">
        <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
        cover
        ></v-carousel-item>
    </v-carousel>

</template>

<style scoped>

</style>