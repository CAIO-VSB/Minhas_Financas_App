<script setup lang="ts">

  import logoLogin from "~/assets/logo-login.svg"
  import logoGoogle from "~/assets/logo-google.svg"
  import logoDiscord from "~/assets/logo-discord.svg"

  import { useValidateFields } from "~/composables/useValidateFields";
  import { useValidateSchemas } from "~/composables/useValidateSchema"
  import { useAuthStore } from "~~/store/modules/auth-store";
  import type { TLoginForm } from "~~/types/user/Tuser.types";

  const { notifyError, notifyInfo, notifySuccess } = useNotify()

  const loadingEmail = ref(false);
  const loadingGoogle = ref(false);
  const loadingFacebook = ref(false)
  const showPassword = ref(false);
  const form = ref();
  const loginForm = ref<TLoginForm>({
    email: "caiob7517@gmail.com",
    password: "Caio#2005",
  });

  const authStore = useAuthStore();

  const { emailRules, passwordRules} = useValidateFields()
  const { validateSchemaSignIn} = useValidateSchemas()

  async function handleWidthEmailAndPassword() {

    try {
      loadingEmail.value = true

      const formValid = await form.value.validate()
      const resultSchema = validateSchemaSignIn(loginForm.value)

      if (formValid) {
        if (resultSchema.success) {

          const result = await authStore.login(loginForm.value)

          if (result?.success) {
            navigateTo({ path: "/dashboard" });
          }
        }
      }
    } catch (error) {
      notifyError("Algo deu errado", "Ocorreu um erro inesperado. Tente novamente em alguns instantes.")
      console.log("Erro ao tentar fazer login (geral no catch)" + error)
    } finally {
      loadingEmail.value = false
    }
  }

  async function handleWidthGoogle() {
    try {
      loadingGoogle.value = true

      await authStore.loginGoogle()
      
    } catch (error) {
      notifyError("Algo deu errado", "Ocorreu um erro inesperado. Tente novamente em alguns instantes.")
      console.log("Erro ao autenteicar com o google" + error);
    } finally {
      loadingGoogle.value = true;
    }
  }

  async function handleWidthDiscord() {
    try {
      loadingFacebook.value = true

      await authStore.loginDiscord()

    } catch (error) {
      notifyError("Algo deu errado", "Ocorreu um erro inesperado. Tente novamente em alguns instantes.")
      console.log("Erro ao autenteicar com o google" + error);
    } finally {
      loadingFacebook.value = false
    }
  }

</script>

<template>

  <div class="container w-100 bg-backgroundPrimary d-flex justify-center">
    
    <v-form ref="form" class="bg-surface elevation-2 ma-3 pa-3 rounded-lg form">

      <div class="d-flex align-center justify-center"> 
        <div class="">
          <v-img :width="310" :height="180" :src="logoLogin"></v-img>
        </div>
      </div>

      <div class="mb-2 text-center">
        <span class="font-weight-bold text-h5 text-textSecundary">Acesse sua conta</span>
      </div>

      <div class="pa-2">
        <v-text-field
        v-model="loginForm.email"
        density="compact"
        placeholder="Email*"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        color="primary"
        :rules="emailRules"
        autocomlete="email"
        name="email"
        clearable
        ></v-text-field>

        <v-text-field
        v-model="loginForm.password"
        density="compact"
        placeholder="Senha*"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        color="primary"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        :rules="passwordRules"
        autocomplete="off"
        >
        </v-text-field>

        <div class="mb-3 ">
          <NuxtLink to="/recover-password-page" class="text-decoration-none text-textAlternative auth-link-register font-weight-bold">Esqueceu a senha?</NuxtLink>
        </div>

        <div class="d-flex justify-center aling-center w-100 mt-3">
          <v-btn :disabled="authStore.disableButton" @click="handleWidthEmailAndPassword" :loading="loadingEmail" color="primary" class="text-none btn-login w-100">
            <span class="font-weight-bold" style="font-size: var(--font-button-primary);">Entrar</span>
          </v-btn>
        </div>

        <div class="divider mt-5">
          <span>OU</span>
        </div>

        <div class="d-flex align-center justify-center flex-column ga-3 mt-3">
          <v-btn :disabled="authStore.disableButton"  @click="handleWidthGoogle" :loading="loadingGoogle" class="w-100 text-none">
            <template #prepend>
              <v-avatar :image="logoGoogle" size="20" ></v-avatar>
            </template>
            <span class="font-weight-bold text-textAlternative" style="font-size: var(--text-base);">Entrar com conta Google</span>
          </v-btn>

          <v-btn :disabled="authStore.disableButton" @click="handleWidthDiscord" class="w-100 text-none">
            <template #prepend>
              <v-avatar :image="logoDiscord" size="25" ></v-avatar>
            </template>
            <span class="font-weight-bold text-textAlternative" style="font-size: var(--text-base);">Entrar com conta Discord</span>
          </v-btn>
        </div>

        <div class="mt-5 font-weight-light text-center d-flex justify-center align-center ga-2 flex-nowrap auth-footer">
          <span class="text-textAlternative text-no-wrap font-weight-bold">Ainda não tem uma conta?</span>
          <NuxtLink to="/register-page" class="text-decoration-none text-primary auth-link-register text-textPrimary text-no-wrap font-weight-bold">Cadastre-se</NuxtLink>
        </div>

      </div>
      

    </v-form>
  </div>

</template>

<style scoped>

.container {
  min-height: 100dvh;
  overflow-y: auto;
  align-items: flex-start;
  padding: 32px 16px;
}

.form {
  width: 100%;
  max-width: 520px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color:#757575;
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #757575;
}

.auth-link-register:hover {
  text-decoration: underline !important;
  color: #2563EB !important;
  font-size: clamp(0.85rem, 4wv, 1rem);
}

@media (min-height: 820px) {
  .container {
    align-items: center;
  }
}

</style>
  

