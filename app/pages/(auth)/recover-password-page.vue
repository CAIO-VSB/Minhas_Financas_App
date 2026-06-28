<script setup lang="ts">

//Import de componentes
  import BaseToast from "~/components/ui/BaseToast.vue";
  import { useValidateFields } from "~/composables/useValidateFields";
  import type { TRecoveryForm } from "~~/types/user/Tuser.types";
  import { useValidateSchemas } from "~/composables/useValidateSchema"

  definePageMeta({
    layout: "layout-auth",
  });


  //Variáveis reativas
  const loading = ref(false)
  const dialogSuccess = ref(false)
  const dialogError = ref(false)
  const userEmail = ref<TRecoveryForm>({
    email: "",
  })

  const form = ref()

  const { $authClient } = useNuxtApp()

  const { emailRules } = useValidateFields();
  const { validateSchemaEmail } = useValidateSchemas()

  async function handleRecoverPassword() {
    try {
      const formValid = await form.value.validate();
      const resultSchema = validateSchemaEmail(userEmail.value);

      if (formValid) {
        if (resultSchema.success) {
          await $authClient.requestPasswordReset(
            {
              email: userEmail.value.email,
              redirectTo: "http://localhost:3000/reset-password-page",
            },
            {
              onRequest() {
                loading.value = true;
              },
              onSuccess() {
                dialogSuccess.value = true;
              },
            }
          );
        }
      }
    } catch (error) {
      console.log("Erro ao enviar e-mail de reset de senha" + error);
    } finally {
      loading.value = false;
    }
}
</script>

<template>
  <div class="flex login-container">
    <div class="flex container-itens">
      <div
        class="flex flex-col items-center justify-center rounded-l-4xl inset-shadow-sm !p-4 w-full side-left"
      >
        <h4
          class="text-center text-3xl mt-2 text-[#0096FF] font-['Montserrat'] font-semibold"
        >
          Domine suas finanças.
        </h4>
        <h4 class="text-center text-3xl mt-2 font-semibold">
          Antes que elas dominem <u>Você.</u>
        </h4>
        <Carrossel></Carrossel>
      </div>

      <div
        class="rounded-r-4xl w-full flex items-center justify-center side-right"
      >
        <v-form
          class="login-form w-full !p-5 !m-5 rounded-3xl overflow-hidden"
          @submit.prevent
          ref="form"
        >
          <div
            class="flex items-center justify-center gap-3 bg-ambere-800 h-[100px]"
          >
            <img class="logo" src="/assets/report.png" alt="" />
            <h2
              class="text-3xl text-center font-normal font-[Montserrat] login-title"
            >
              Minhas<strong>Finanças</strong>
            </h2>
          </div>

          <div class="flex flex-col items-center justify-center !p-4">
            <h3
              class="text-[1.3rem] !p-1 font-['Montserrat'] !font-semibold login-sub-title"
            >
              Recuperação de senha
            </h3>
            <p
              class="text-[0.76rem] text-gray-700 font-['Montserrat'] font-semibold"
            >
              Insira as informação logo abaixo
            </p>
          </div>

          <div>
            <div>
              <v-text-field
                label="E-mail"
                type="email"
                name="email"
                variant="solo"
                density="comfortable"
                placeholder="seunome@gmail.com"
                prepend-inner-icon="mdi-email"
                v-model="userEmail.email"
                :rules="emailRules"
              >
              </v-text-field>
            </div>
          </div>

          <div class="flex items-center justify-center gap-6 !p-2 !mt-2">
            <div class="w-[100%]">
              <v-btn
                :disabled="loading"
                :loading="loading"
                class="text-none font-['Montserrat'] rounded-xl button-login"
                size="large"
                variant="flat"
                color="indigo-darken-3"
                block
                @click="handleRecoverPassword"
              >
                Recuperar senha
              </v-btn>
            </div>
          </div>

          <BaseToast
            color="error-primary"
            text="Nenhuma conta foi encontrada com o e-mail informado."
            timer="#E57373"
            v-model="dialogError"
            icon="mdi-alert"
            size="x-large"
            color-icon="white"
          >
          </BaseToast>

          <BaseModal
            text="Se sua conta existir, enviamos um link de redefinição de senha para seu endereço de e-mail."
            title="Redefinição de senha"
            v-model="dialogSuccess"
          >
          </BaseModal>

        </v-form>
      </div>
    </div>
  </div>
</template>

