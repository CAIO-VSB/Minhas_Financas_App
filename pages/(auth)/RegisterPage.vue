<script setup lang="ts">

   definePageMeta({
    layout: "layout-auth"
   })

   const loading = ref(false)
   const showPassword = ref(false)

</script>

<template>
    <v-form class="register-form">
        <div class="register__form-container !p-4">
            <div class="flex items-center justify-center !p-3 gap-2">
                <img src="/assets/money.png" alt="">
                <h2 class="text-2xl register__title">Minhas finanças</h2>
            </div>

            <hr style="color: #cbd5e1; margin: 10px;">

            <div class="flex flex-col items-center justify-center !p-4">
                <h3 class="text-2xl !p-1 font-['Roboto']">Criação de usuário</h3>
                <p class="text-sm text-gray-700 font-['Roboto']">Insira suas credenciais logo abaixo</p>
            </div>

            <div>
                <div>
                    <v-text-field label="Nome"
                    type="name"
                    name="name"
                    clearable
                    focused
                    prepend-inner-icon="mdi mdi-email-alert"
                    variant="filled"
                    ></v-text-field>
                </div>
                <div>
                    <v-text-field label="E-mail"
                    type="email"
                    name="email"
                    clearable
                    prepend-inner-icon="mdi mdi-email-alert"
                    variant="filled"
                    ></v-text-field>
                </div>
                <div>
                    <v-text-field label="Senha"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi mdi-lock-alert"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    class="cursor-pointer"
                    clearable
                    variant="filled"
                    >
                </v-text-field>
                </div>
                <div>
                    <v-text-field label="Confirmar Senha"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi mdi-lock-alert"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    class="cursor-pointer"
                    clearable
                    variant="filled"
                    >
                </v-text-field>
                </div>
            </div>

            <div>
                <v-btn
                :disabled="loading"
                :loading="loading"
                class="text-none mb-5 register__button"
                size="large"
                variant="flat"
                color="indigo-darken-3"
                block
                @click="loading = !loading"
                >
                Entrar
                </v-btn>
            </div>

        </div>
    </v-form>
</template>

<style lang="scss" scoped>

@import url('https://fonts.googleapis.com/css2?family=Edu+NSW+ACT+Hand+Pre:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Edu+NSW+ACT+Hand+Pre:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

.register-form {
    max-width: 650px;
    width: 100%;
    height: auto;
    padding: 10px;
    z-index: 1;
}

.register__form-container {
    padding: 10px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    font-family: "Poppins", sans-serif;
}

.register__title {
    font-weight: 700;
    color: #2c3e50;
    font-family: "Poppins", sans-serif;
}

.register__recover-password {
    color: $color-primary-link;
}

.register__recover-password:hover {
    color: #2c3e50;
}

.register__button {
   background-color: $color-primary-button !important;
}

.register__button:hover {
    transform: translateY(-4px);
}

</style>