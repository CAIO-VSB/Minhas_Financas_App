<script setup lang="ts">

  import { useValidateFields } from "~/composables/useValidateFields";
  import type { TRecoveryForm } from "~~/types/user/Tuser.types";
  import { useValidateSchemas } from "~/composables/useValidateSchema"

  import logoLogin from "~/assets/logo-login.svg"

  //Variáveis reativas
  const loading = ref(false)
  const formEmail = ref<TRecoveryForm>({
    email: "",
  })

  const form = ref()

  const { $authClient } = useNuxtApp()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { emailRules } = useValidateFields();
  const { validateSchemaEmail } = useValidateSchemas()

  async function handleRecoverPassword() {
    try {
      const formValid = await form.value.validate(formEmail.value);
      const resultSchema = validateSchemaEmail(formEmail.value);

      if (formValid) {
        if (resultSchema.success) {
          await $authClient.requestPasswordReset(
            {
              email: formEmail.value.email,
              redirectTo: "http://10.20.20.7:3000/reset-password-page",
            },
            {
              onRequest() {
                loading.value = true;
              },
              onError(error) {
                handleErrorApplication(error.response.status)
                return
              },
              onSuccess() {
                notifySuccess(
                  "Solicitação recebida",
                  "Se o e-mail informado estiver cadastrado, enviaremos um link para redefinição de senha. Verifique sua caixa de entrada e, se necessário, a pasta de spam.",
                  8000
                )
                formEmail.value.email = ""
              },
            }
          );
        }
      }
    } catch (error) {
      notifyError("Algo deu errado", "Ocorreu um erro inesperado. Tente novamente em alguns instantes.", 7000)
      console.log("Erro ao enviar e-mail de reset de senha" + error);
    } finally {
      loading.value = false;
    }
}
</script>

<template>

  <div class="container w-100 bg-backgroundPrimary d-flex justify-center">
    
    <v-form validate-on="submit" ref="form" class="bg-surface elevation-2 ma-3 pa-3 rounded-lg form">

      <div class="d-flex align-center justify-center"> 
        <div class="">
          <v-img :width="310" :height="180" :src="logoLogin"></v-img>
        </div>
      </div>

      <div class="mb-2 text-center d-flex flex-column">
        <span class="font-weight-bold text-h5 text-textAlternative">Recuperar senha</span>
        <span class="font-weight-semibold text-h7 text-textSecundary">Informe seu e-mail para recuperar sua senha de acesso.</span>
      </div>

      <div class="pa-2">
        <v-text-field
        v-model="formEmail.email"
        density="compact"
        placeholder="Adicionar seu e-mail*"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        color="primary"
        :rules="emailRules"
        autocomlete="email"
        name="email"
        clearable
        ></v-text-field>

        <div class="d-flex justify-center aling-center w-100 mt-3">
          <v-btn @click="handleRecoverPassword" :loading="loading" color="primary" class="text-none btn-login w-100">
            <span class="font-weight-bold" style="font-size: var(--font-button-primary);">Recuperar</span>
          </v-btn>
        </div>

        <div class="mt-5 font-weight-light text-center d-flex justify-center align-center ga-2">
          <NuxtLink to="/login-page" class="text-decoration-none font-weight-bold link-register text-textPrimary">Voltar</NuxtLink>
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

.link-register:hover {
  text-decoration: underline !important;
  color: #2563EB !important;
}


@media (min-height: 550px) {
  .container {
    align-items: center;
  }
}

</style>
  

