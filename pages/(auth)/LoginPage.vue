<script setup lang="ts">
    definePageMeta({
    layout: "layout-auth"
   })

   import Toasts from '~/components/Toasts.vue'

   const loading = ref(false)
   const showPassword = ref(false)
   const email = ref("")
   const password = ref("")
   const error = ref(false)
   const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   const listMessage = {
    emptyField: "Campo obrigatório vazio",
    userNotFound: "Email ou senhas incorretos. Tente novamente"
   }

   const teste = ref(false)

   const validateData = () => {

    if (!email.value.trim()) {
        error.value = true
        teste.value = true
        return false
    }

    if (!password.value.trim()) {
        error.value = true
        teste.value = true
        return false
    }

    return true

   }

</script>

<template>
    <v-form class="login-form">
        <div class="login__form-container !p-4">
            <div class="flex items-center justify-center !p-3 gap-3">
                <img src="/assets/money.png" alt="">
                <h2 class="text-2xl login__title">Minhas finanças</h2>
            </div>

            <hr style="color: #cbd5e1; margin: 10px;">

            <div class="flex flex-col items-center justify-center !p-4">
                <h3 class="text-2xl !p-1 font-['Poppins'] !font-medium">Bem-vindo de volta!</h3>
                <p class="text-sm text-gray-700 font-['Poppins']">Acesse sua conta para continuar</p>
            </div>

            <div>
                <div>
                    <v-text-field label="E-mail"
                    title="E-mail"
                    v-model="email"
                    type="email"
                    name="email"
                    focused
                    clearable
                    prepend-inner-icon="mdi mdi-email-alert"
                    variant="filled"
                    :error="error"
                    ></v-text-field>
                </div>
                <div>
                    <v-text-field label="Senha"
                    title="Senha"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi mdi-lock-alert"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    class="cursor-pointer"
                    clearable
                    variant="filled"
                    :error="error"
                    >
                </v-text-field>
                </div>
            </div>

            <div>
                <v-btn
                :disabled="loading"
                :loading="loading"
                class="text-none mb-4 login__button"
                size="large"
                variant="flat"
                color="indigo-darken-3"
                block
                @click="validateData"
                >
                Entrar
                </v-btn>
            </div>

            <div class="flex justify-center items-center !p-2 text-sm login__recover-password">
                <p class="font-['Poppins']"><nuxt-link title="Clique aqui para recuperar sua senha" to="/RecoverPage">Esqueceu sua senha?</nuxt-link></p>
            </div>

            <div class="flex justify-center items-center !p-2 text-sm login__more-login">
                <div class="bg-[#cbd5e1] flex-1 h-px"></div>
                <p class="!p-3 font-['Poppins']">Outras formas de login</p>
                <div class="bg-[#cbd5e1] flex-1 h-px"></div>
            </div>

            <div class="flex justify-center items-center !p-3"> 
                <v-btn class="flex justify-center items-center  gap-1 login__button-google" title="Login com google">
                Google
                <template #prepend>
                    <img src="/assets/google.png" alt="">
                </template>
                </v-btn>
            </div>

            <hr style="color: #cbd5e1; margin: 15px;">

            <div class="flex justify-center items-center !p-2 !mb-2 text-sm login__recover-password">
                <p class="font-['Poppins']"><nuxt-link to="/RegisterPage" title="Crie sua conta">Não tem uma conta? Cadastre-se</nuxt-link></p>
            </div>

            <div>
                <Toasts 
                color="red"
                text="Testando"
                timer="greem"
                v-model="teste"
                ></Toasts>
            </div>

        </div>
    </v-form>
</template>

<style lang="scss" scoped>

@import url('https://fonts.googleapis.com/css2?family=Edu+NSW+ACT+Hand+Pre:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Edu+NSW+ACT+Hand+Pre:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

.login-form {
    max-width: 650px;
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
    font-family: "Poppins", sans-serif;
}

.login__title {
    font-weight: 700;
    color: #2c3e50;
    font-family: "Poppins", sans-serif;
}

.login__recover-password {
    color: $color-primary-link;
}

.login__recover-password:hover {
    color: #2c3e50;
}

.login__button-google {
    width: 30%;
}

.login__button-google:hover {
    transform: translateY(-3px);
}

.login__button {
   background-color: $color-primary-button !important;
}

.login__button:hover {
    transform: translateY(-4px);
}

@media (max-width: 680px) {

    .login__button-google {
    width: 50%;
}
}

</style>