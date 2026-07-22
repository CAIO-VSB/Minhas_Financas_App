<script setup lang="ts">

  import type { TRegisterForm } from "~~/types/user/Tuser.types";
  import logoLogin from "~/assets/logo-login.svg"
  import logoGoogle from "~/assets/logo-google.svg"
  import logoDiscord from "~/assets/logo-discord.svg"

  import { useValidateFields } from "~/composables/useValidateFields";
  import { useValidateSchemas } from "~/composables/useValidateSchema"
  import { useAuthStore } from "~~/store/modules/auth-store";
  import Password from "vue-password-strength-meter"
  import 'vue-password-strength-meter/style.css'


  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { nameRules, emailRules, passwordRules,  } = useValidateFields()
  const { validateSchemaSignUp } = useValidateSchemas()

  const loadingGoogle = ref(false);
  const loadingFacebook = ref(false)
  const loading = ref(false);
  const showPassword = ref(false);
  const form = ref();
  const showValidatePassword = ref(false)
  const registerForm = ref<TRegisterForm>({
    id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const authStore = useAuthStore();

  const confirmPasswordRules = ref([
    (val: string) => !!val || "Campo confirmar senha é obrigatório",
    (val: string) =>
      val === registerForm.value.password || "As senha não coincidem",
  ]);

  function resetForm() {
    registerForm.value.name = ""
    registerForm.value.email = ""
    registerForm.value.password = ""
    registerForm.value.confirmPassword = ""
  }

  const regexValidateNumber = computed(() => {
    return /\d/.test(registerForm.value.password)
  })

  const regexValidateMaiuscula = computed(() => {
    return /[A-Z]/.test(registerForm.value.password)
  })

  const regexValidateMinuscula = computed(() => {
    return /[a-z]/.test(registerForm.value.password)
  })

  const regexValidateEspecial = computed(() => {
    return /[^A-Za-z0-9]/.test(registerForm.value.password)
  })

  const regexValidateMinimoSeis = computed(() => {
    return registerForm.value.password.length >= 6
  })

  function validateRulesPassword() {
    regexValidateEspecial
    regexValidateMaiuscula
    regexValidateMinimoSeis
    regexValidateMinuscula
    regexValidateNumber
    showValidatePassword.value = true
  }
  
  async function handleRegisterUser() {
    try {
      loading.value = true;

      const formValid = await form.value.validate();

      const resultSchema = validateSchemaSignUp(registerForm.value);

      if (formValid) {
        if (resultSchema.success) {
          await authStore.register(registerForm.value);
          resetForm()
        }
      }
    } catch (error) {
      notifyError("Algo deu errado", "Ocorreu um erro inesperado. Tente novamente em alguns instantes.")
      console.log("Erro ao criar usuário" + error);
    } finally {
      loading.value = false;
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

  <div  class="container w-100 bg-backgroundPrimary d-flex justify-center">
    
    <v-form validate-on="submit" ref="form" class="bg-surface elevation-2 ma-3 pa-3 rounded-lg form">

      <div class="d-flex align-center justify-center"> 
        <div class="">
          <v-img :width="310" :height="180" :src="logoLogin"></v-img>
        </div>
      </div>

      <div class="mb-2 text-center d-flex flex-column">
        <span class="font-weight-bold text-h5 text-textAlternative">Crie sua conta como quiser</span>
        <span class="font-weight-semibold text-h7 text-textSecundary">Crie sua conta para começar a controlar sua grana</span>
      </div>

      <div class="pa-2">

        <v-text-field
        v-model="registerForm.name"
        density="compact"
        placeholder="Nome*"
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
        color="primary"
        autocomlete="name"
        name="name"
        clearable
        :rules="nameRules"
        @keyup.enter="handleRegisterUser"
        ></v-text-field>

        <v-text-field
        v-model="registerForm.email"
        density="compact"
        placeholder="E-mail*"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        color="primary"
        :rules="emailRules"
        autocomlete="email"
        name="email"
        clearable
        @keyup.enter="handleRegisterUser"
        ></v-text-field>

        <v-text-field
        v-model="registerForm.password"
        placeholder="Senha*"
        density="compact"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        color="primary"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        :rules="passwordRules"
        autocomplete="off"
        hide-details="auto"
        @keyup="validateRulesPassword"
        @keyup.enter="handleRegisterUser"
        >
        </v-text-field>
        <div class="password-meter">
          <Password
            v-model="registerForm.password"
            :strength-meter-only="true"
          />
          <v-expand-transition>
          <div v-if="showValidatePassword" class="ml-1">          
            <div>
              <v-icon :color="regexValidateMinimoSeis ? 'green':'red'" :icon="regexValidateMinimoSeis ? 'mdi-check-circle-outline': 'mdi-close-circle-outline'" size="small"></v-icon>
              Pelo menos 6 caracteres
            </div>
            <div>
              <v-icon :color="regexValidateMaiuscula ? 'green':'red'" :icon="regexValidateMaiuscula ? 'mdi-check-circle-outline': 'mdi-close-circle-outline'"  size="small"></v-icon>
              Uma letra maiúscula
            </div>
            <div>
              <v-icon :color="regexValidateMinuscula ? 'green':'red'" :icon="regexValidateMinuscula ? 'mdi-check-circle-outline': 'mdi-close-circle-outline'" size="small"></v-icon>
              Uma letra minúscula
            </div>
            <div>
              <v-icon :color="regexValidateNumber ? 'green':'red'" :icon="regexValidateNumber ? 'mdi-check-circle-outline': 'mdi-close-circle-outline'" size="small"></v-icon>
              Um número
            </div>
            <div>
              <v-icon :color="regexValidateEspecial ? 'green':'red'" :icon="regexValidateEspecial ? 'mdi-check-circle-outline': 'mdi-close-circle-outline'" size="small"></v-icon>
              Um caractere especial
            </div>
          </div>
          </v-expand-transition>
      </div>

        
        <v-text-field
        v-model="registerForm.confirmPassword"
        density="compact"
        placeholder="Confirmar senha*"
        prepend-inner-icon="mdi-lock-check-outline"
        variant="outlined"
        color="primary"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        :rules="confirmPasswordRules"
        autocomplete="off"
        >
        </v-text-field>

        <div class="d-flex justify-center aling-center w-100 mt-3">
          <v-btn @click="handleRegisterUser" :loading="loading" color="primary" class="text-none btn-login w-100">
            <span class="font-weight-bold" style="font-size: var(--font-button-primary);">Criar conta</span>
          </v-btn>
        </div>

        <div class="divider mt-5">
          <span>OU</span>
        </div>

        <div class="d-flex align-center justify-center flex-column ga-3 mt-3">
          <v-btn  @click="handleWidthGoogle" :loading="loadingGoogle" class="w-100 text-none">
            <template #prepend>
              <v-avatar :image="logoGoogle" size="20" ></v-avatar>
            </template>
            <span class="font-weight-bold text-textAlternative" style="font-size: var(--text-base);">Criar conta com Google</span>
          </v-btn>

          <v-btn @click="handleWidthDiscord" class="w-100 text-none">
            <template #prepend>
              <v-avatar :image="logoDiscord" size="25" ></v-avatar>
            </template>
            <span class="font-weight-bold text-textAlternative" style="font-size: var(--text-base);">Criar conta com Discord</span>
          </v-btn>
        </div>

        <div class="mt-5 font-weight-light text-center d-flex justify-center align-center ga-2 auth-footer">
          <span class="text-textAlternative text-no-wrap font-weight-bold">Já sou cadastrado.</span>
          <NuxtLink to="/login-page" class="text-decoration-none text-primary link-register text-textPrimary text-no-wrap font-weight-bold" >Quero fazer login</NuxtLink>
        </div>

        <div class="mt-5 font-weight-light text-center d-flex justify-center align-center ga-2">
          <NuxtLink to="/login-page" class="text-decoration-none text-primary link-register text-textPrimary text-no-wrap font-weight-bold">Voltar</NuxtLink>
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
  padding: 55px 16px;
}

.form {
  width: 100%;
  max-width: 520px;
}

.password-meter {
  width: 100%;
  width: 100%;
  margin: 10px 0 10px;
}

.Password {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
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

.link-register:hover {
  text-decoration: underline !important;
  color: #2563EB !important;
}

.list-validator {
  display: none;
}

@media (min-height: 1200px) {
  .container {
    align-items: center;
  }
}

</style>