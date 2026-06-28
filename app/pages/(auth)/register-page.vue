<script setup lang="ts">

  import type { TRegisterForm } from "~~/types/user/Tuser.types";
  import logoLogin from "~/assets/logo-login.svg"
  import logoGoogle from "~/assets/logo-google.svg"
  import logoDiscord from "~/assets/logo-discord.svg"

  import { useValidateFields } from "~/composables/useValidateFields";
  import { useValidateSchemas } from "~/composables/useValidateSchema"
  import { useAuthStore } from "~~/store/modules/auth-store";
  import type { TLoginForm } from "~~/types/user/Tuser.types";

  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { nameRules, emailRules, passwordRules,  } = useValidateFields()
  const { validateSchemaSignUp } = useValidateSchemas()

  const loadingGoogle = ref(false);
  const loadingFacebook = ref(false)
  const loading = ref(false);
  const showPassword = ref(false);
  const isPasswordValidatorVisible = ref(true);
  const containerItensWithValidator = ref(false);
  const form = ref();
  const registerForm = ref<TRegisterForm>({
    id: "",
    name: "",
    email: "",
    password: "V9#mQ2@xL7!pR4$",
    confirmPassword: "V9#mQ2@xL7!pR4$",
  });

  const authStore = useAuthStore();

  const hasUpperCase = computed(() => /[A-Z]/.test(registerForm.value.password));
  const hasLowerCase = computed(() => /[a-z]/.test(registerForm.value.password));
  const hasNumber = computed(() => /[0-9]/.test(registerForm.value.password));
  const hasCharacterSpecial = computed(() =>
    /[^A-Za-z0-9]/.test(registerForm.value.password)
  );

  const confirmPasswordRules = ref([
    (val: string) => !!val || "Campo confirmar senha é obrigatório",
    (val: string) =>
      val === registerForm.value.password || "As senha não coincidem",
  ]);

  function showListVerificationPassword() {
    isPasswordValidatorVisible.value = false;
    containerItensWithValidator.value = true;
  }

  async function redirectPage() {
    notifySuccess("Cadastro realizado", "Sua conta foi criada com sucesso. Você será redirecionado para a tela de login.", 4000)
    await new Promise((resolve) => setTimeout(resolve, 4000));
    navigateTo({ path: "/login-page" });
  }

  async function handleRegisterUser() {
    try {
      loading.value = true;

      const formValid = await form.value.validate();

      const resultSchema = validateSchemaSignUp(registerForm.value);

      if (formValid) {
        if (resultSchema.success) {
          await authStore.register(registerForm.value);
        }
      }
    } catch (error) {
      notifyError("Algo deu errado", "Ocorreu um erro inesperado. Tente novamente em alguns instantes.")
      console.log("Erro ao criar usuário" + error);
    } finally {
      loading.value = false;
      registerForm.value.confirmPassword = ""
      registerForm.value.email = ""
      registerForm.value.id = ""
      registerForm.value.name = ""
      registerForm.value.password = ""
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

  <div style="min-height: 100dvh; overflow: auto;" class="container w-100 bg-backgroundPrimary d-flex justify-center align-center py-8">
    
    <v-form validate-on="submit" ref="form" class="bg-surface elevation-2 ma-3 pa-3 rounded-lg form" style="width: 100vw; max-width: 520px; height: auto;">

      <div class="d-flex align-center justify-center"> 
        <div class="">
          <v-img :width="310" :height="180" :src="logoLogin"></v-img>
        </div>
      </div>

      <div class="mb-2 text-center d-flex flex-column">
        <span class="font-weight-semibold text-h5 text-textAlternative">Crie sua conta como quiser</span>
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
        ></v-text-field>

        <v-text-field
        v-model="registerForm.email"
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
        v-model="registerForm.password"
        density="compact"
        placeholder="Senha*"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        color="primary"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        :rules="passwordRules"
        @keyup="showListVerificationPassword"
        autocomplete="off"
        >
        </v-text-field>

        <v-list :class="{ 'list-validator': isPasswordValidatorVisible }">
          <v-list-item>
            <template v-slot:prepend>
              <v-icon
                :color="hasUpperCase ? '#00C853' : '#FF0000'"
                :icon="
                  hasUpperCase
                    ? 'mdi mdi-check-circle'
                    : 'mdi mdi-close-circle'
                "
              ></v-icon>
            </template>

            <v-list-item-title class="font-weight-semibold text-h7 text-textAlternative">Contém letra maiúscula</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon
                :color="hasLowerCase ? '#00C853' : '#FF0000'"
                :icon="
                  hasLowerCase
                    ? 'mdi mdi-check-circle'
                    : 'mdi mdi-close-circle'
                "
              ></v-icon>
            </template>

            <v-list-item-title class="font-weight-semibold text-h7 text-textAlternative">Contém letra minúscula</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon
                :color="hasNumber ? '#00C853' : '#FF0000'"
                :icon="
                  hasNumber
                    ? 'mdi mdi-check-circle'
                    : 'mdi mdi-close-circle'
                "
              ></v-icon>
            </template>

            <v-list-item-title class="font-weight-semibold text-h7 text-textAlternative">Contém número</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon
                :color="hasCharacterSpecial ? '#00C853' : '#FF0000'"
                :icon="
                  hasCharacterSpecial
                    ? 'mdi mdi-check-circle'
                    : 'mdi mdi-close-circle'
                "
              ></v-icon>
            </template>

            <v-list-item-title class="font-weight-semibold text-h7 text-textAlternative">Contém caractere especial</v-list-item-title
            >
          </v-list-item>
        </v-list>

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
            <span class="text-h7 font-weight-bold">Criar conta</span>
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
            <span class="text-h7 font-weight-bold">Criar conta com Google</span>
          </v-btn>

          <v-btn @click="handleWidthDiscord" class="w-100 text-none">
            <template #prepend>
              <v-avatar :image="logoDiscord" size="25" ></v-avatar>
            </template>
            <span class="text-h7 font-weight-bold">Criar conta com Discord</span>
          </v-btn>
        </div>

        <div class="mt-5 font-weight-light text-center d-flex justify-center align-center ga-2">
          <span class="text-textAlternative">Já sou cadastrado.</span>
          <NuxtLink to="/login-page" class="text-decoration-none text-primary link-register text-textPrimary">Quero fazer login</NuxtLink>
        </div>

        <div class="mt-5 font-weight-light text-center d-flex justify-center align-center ga-2">
          <NuxtLink to="/login-page" class="text-decoration-none text-primary link-register text-textPrimary">Voltar</NuxtLink>
        </div>

      </div>
      

    </v-form>
  </div>

</template>

<style escoped>

.form {
  max-height: 90dvh;
  overflow-y: auto;
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

</style>