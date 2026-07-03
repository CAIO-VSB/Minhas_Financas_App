<script setup lang="ts">

  //Import de componentes
  import { useValidateFields } from "~/composables/useValidateFields";
  import type { TResetForm } from "~~/types/user/Tuser.types";
  import { useValidateSchemas } from "~/composables/useValidateSchema"
  import Password from "vue-password-strength-meter"
  import 'vue-password-strength-meter/style.css'

  import logoLogin from "~/assets/logo-login.svg"


  //Variáveis reativas
  const loading = ref(false);
  const showPassword = ref(true);
  const form = ref();
  const formPassword = ref<TResetForm>({
    password: "",
    confirmPassword: "",
  });
  
  const { $authClient } = useNuxtApp()

  const { passwordRules } = useValidateFields();
  const { validateSchemaPassword } = useValidateSchemas()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()

  const confirmPasswordRules = ref([
    (val: string) => !!val || "Campo confirmar senha é obrigatório",
    (val: string) =>
      val === formPassword.value.password || "As senha não coincidem",
  ]);

  async function handleResetPassword() {
    try {
      loading.value = true;

      const formValid = await form.value.validate();

      const resultSchema = validateSchemaPassword(formPassword.value);

      if (formValid) {
        if (resultSchema.success) {
          const token = new URLSearchParams(window.location.search).get("token");

          console.log("Esse é o token " + token);
          if (!token) {
            alert("Token inválido");
            return;
          }

          await $authClient.resetPassword(
            {
              newPassword: formPassword.value.confirmPassword,
              token,
            },
            {
              onRequest() {
                loading.value = true;
              },
              onSuccess() {
                notifySuccess("Senha redefinida", "Sua senha foi alterada com sucesso. Você já pode fazer login com a nova senha.", 7000)
                formPassword.value.password = ""
                formPassword.value.confirmPassword = ""

              },
              onError(context) {
                console.log("Erro ao salvar nova senha", context.error.message);
              },
            }
          );
        }
      }
    } catch (error) {
      notifyError("Algo deu errado", "Ocorreu um erro inesperado. Tente novamente em alguns instantes.", 7000)
      console.log("Erro ao criar usuário" + error);
    } finally {
      loading.value = false;
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
        <span class="font-weight-bold text-h5 text-textAlternative">Redefinir senha de acesso</span>
        <span class="font-weight-semibold text-h7 text-textSecundary">Insira sua nova senha logo abaixo</span>
      </div>

      <div class="pa-2">

        <v-text-field
        v-model="formPassword.password"
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
        >
        </v-text-field>
        <div class="password-meter">
          <Password
            v-model="formPassword.password"
            :strength-meter-only="true"
          />
      </div>
        
        <v-text-field
        v-model="formPassword.confirmPassword"
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
          <v-btn @click="handleResetPassword" :loading="loading" color="primary" class="text-none btn-login w-100">
            <span class="font-weight-bold" style="font-size: var(--font-button-primary);">Redefinir senha</span>
          </v-btn>
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
