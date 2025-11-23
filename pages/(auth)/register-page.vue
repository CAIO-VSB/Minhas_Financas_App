<script setup lang="ts">

  definePageMeta({
    layout: "layout-auth"
  })

  document.querySelectorAll('*').forEach(el => {
  if (el.scrollHeight > el.clientHeight + 10) console.log(el);
});

  //Import de componentes
  import { useValidateFields } from '~/composables/useValidateFields';
  import type { RegisterForm } from '~/types/user/types';
  import { useAuthStore } from '~/store/modules/auth-store';

  //Variáveis reativas
  const loading = ref(false)
  const showPassword = ref(true)
  const isPasswordValidatorVisible = ref(true)
  const containerItensWithValidator = ref(false)
  const successMessage = ref(false)
  const dialog = ref(false)
  const form = ref()
  const registerForm = ref<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const authStore = useAuthStore()

  const hasUpperCase = computed(() => /[A-Z]/.test(registerForm.value.password))
  const hasLowerCase = computed(() => /[a-z]/.test(registerForm.value.password))
  const hasNumber = computed(() => /[0-9]/.test(registerForm.value.password))
  const hasCharacterSpecial = computed(() => /[^A-Za-z0-9]/.test(registerForm.value.password))

  const { nameRules, emailRules, passwordRules, validateSchemaSignUp } = useValidateFields()

  const confirmPasswordRules = ref([
    (val: string) => !!val || "Campo confirmar senha é obrigatório",
    (val: string ) => (val === registerForm.value.password) || "As senha não coincidem"
  ])

  function showListVerificationPassword() {
    isPasswordValidatorVisible.value = false
    containerItensWithValidator.value = true
  }

  async function redirectPage() {
    successMessage.value = true
    await new Promise((resolve) => setTimeout(resolve, 4000))
    navigateTo({path: "/login-page"})
  }

  async function handleRegisterUser() {

    try {

      loading.value = true

      const formValid  = await form.value.validate()

      const resultSchema = validateSchemaSignUp(registerForm.value)

      if (formValid) {
        if (resultSchema.success) {
          const result = await authStore.register(registerForm.value)

          if (result?.success) {
            dialog.value = authStore.dialog
          }
        }
      }
    } catch (error) {
      console.log("Erro ao criar usuário" + error)
    } finally {
      loading.value = false
    }
  }
 
</script>

<template>
  <div class=" flex login-container">

    <div class="flex container-itens" :class="{'container-itens--with-validator': containerItensWithValidator}">

      <div class="flex flex-col items-center justify-center rounded-l-4xl inset-shadow-sm !p-4 w-full side-left">
        <h4 class="text-center text-3xl text-[#0096FF] font-['Montserrat'] font-semibold">Domine suas finanças.</h4>
        <h4 class="text-center text-3xl mt-2 font-semibold">Antes que elas dominem <u>Você.</u></h4>
        <Carrossel></Carrossel>
      </div>

      <div class="rounded-r-4xl w-full flex items-center justify-center side-right">

        <v-form class="login-form w-full !p-5 !m-5 rounded-3xl overflow-hidden" @submit.prevent ref="form">

          <div class="flex items-center justify-center gap-3 bg-ambere-800 h-[100px]">
            <img class="logo" src="/assets/report.png" alt="MinhasFinancas.logo">
            <h2 class="text-3xl text-center font-normal font-[Montserrat] login-title">Minhas<strong>Finanças</strong></h2>
          </div>

             <div class="te flex flex-col items-center justify-center !p-4">
                <h3 class="text-[1.4rem] !p-1 font-['Montserrat'] !font-semibold login-sub-title">Cadastre-se para começar</h3>
                <p class="text-[0.86rem] text-gray-700 font-['Montserrat'] font-semibold">Preencha as informações abaixo</p>
            </div>

            <div>

              <div >
                <v-text-field  label="Nome" type="name" name="name"
                variant="solo"
                density="comfortable"
                v-model="registerForm.name" 
                prepend-inner-icon="mdi-account"
                counter="55"
                placeholder="Insira seu nome"
                :rules="nameRules"
                >
                </v-text-field>
              </div>

              <div >
                <v-text-field label="E-mail" type="email" name="email"
                variant="solo"
                density="comfortable"
                v-model="registerForm.email" 
                placeholder="seunome@gmail.com"
                prepend-inner-icon="mdi-email"
                :rules="emailRules"
                >
                </v-text-field>
              </div>

              <div>
                <v-text-field label="Senha" :type="showPassword ? 'password' : 'text'"
                variant="solo"
                density="comfortable"
                v-model="registerForm.password"
                prepend-inner-icon="mdi-lock"
                :rules="passwordRules"
                @keyup="showListVerificationPassword"
                >
                <template #append-inner>
                    <v-icon
                    :icon="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
                    @click="showPassword = !showPassword"
                    ></v-icon>
                </template>
                </v-text-field>
                
               <v-list :class="{'list-validator': isPasswordValidatorVisible}"> 

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon :color="(hasUpperCase) ? '#00C853' : '#FF0000'" :icon="(hasUpperCase) ? 'mdi mdi-check-circle': 'mdi mdi-close-circle'"></v-icon>
                  </template>

                  <v-list-item-title>Contém letra maiúscula</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon :color="(hasLowerCase) ? '#00C853' : '#FF0000'" :icon="(hasLowerCase) ? 'mdi mdi-check-circle': 'mdi mdi-close-circle'"></v-icon>
                  </template>

                  <v-list-item-title>Contém letra minúscula</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon :color="(hasNumber) ? '#00C853' : '#FF0000'" :icon="(hasNumber) ? 'mdi mdi-check-circle': 'mdi mdi-close-circle'"></v-icon>
                  </template>

                  <v-list-item-title>Contém número</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon :color="(hasCharacterSpecial) ? '#00C853' : '#FF0000'" :icon="(hasCharacterSpecial) ? 'mdi mdi-check-circle': 'mdi mdi-close-circle'"></v-icon>
                  </template>

                  <v-list-item-title class="">Contém caractere especial</v-list-item-title>
                </v-list-item>

              </v-list>
              </div>

              <div>
                <v-text-field label="Confirmar senha" :type="showPassword ? 'password' : 'text'"
                variant="solo"
                density="comfortable"
                v-model="registerForm.confirmPassword"
                prepend-inner-icon="mdi-lock-check"
                :rules="confirmPasswordRules"
                >
                <template #append-inner>
                    <v-icon
                    :icon="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
                    @click="showPassword = !showPassword"
                    ></v-icon>
                </template>
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
                  color="indigo-darken-3"
                  block
                  @click="handleRegisterUser"
                  >
                  Criar conta
                </v-btn>
              </div>
            </div>
            <BaseModal
              text="Conta criada com sucesso! 🎉 Verifique seu e-mail para ativar a conta."
              title="Verificação de e-mail"
              v-model="dialog"
              @update:model-value="redirectPage"
            >
            </BaseModal>
          </v-form>

        <Toasts 
        :model-value="authStore.activeMessageAlert"
        :timeout="4000"
        timer="#ffffe0"
        :text="authStore.typeMessage"
        color="yellow"
        color-icon="black"
        icon="mdi mdi-alert-rhombus"
        >
        </Toasts>

        <Toasts 
        :model-value="successMessage"
        :timeout="4000"
        timer="#d4f7dc"
        color="#21BA45"
        text="Redirecionando para a página de login..."
        color-icon="white"
        icon="mdi mdi-check-decagram"
        >
        </Toasts>

        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>

.login-container {
  width: 100%;
  max-width: 1100px;
}

.container-itens {
  width: 100%;
  min-height: 62vh;
  margin: 12px;
}

.side-left {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  background-color: $color-secundary;
  z-index: 3;
}

.side-right {
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.5);
  background-color: $color-primary;
  z-index: 3;
}

.login-title {
  color: $color-primary-title;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
}

.login-sub-title {
  font-size: clamp(1rem, 2.5vw, 1.4rem);
}

.login-form {
  background-color: $color-secundary;
  padding: 5px;
  width: 100%;
  border-radius: 25px;
  margin: 5px;
}

.logo {
  width: clamp(45px, 2.5vw, 100px);
}

.button-google {
  box-shadow: none;
  background-color: $color-secundary;
  border: 1px solid rgba(128, 128, 128, 0.425);
  border-radius: 20px;
}

.button-google:hover {
  transform: translateY(-5px);
}

.button-login {
  background-color: $color-primary !important;
  font-size: clamp(0.90rem, 2.5vw, 1rem);
}

.button-login:hover {
  transform: translateY(-5px);
}

.list-validator {
  display: none;
}

@media (max-width: 480px) {

  .side-right  {
    border-radius: 40px;
    width: 100%; 
    overflow: auto;
  }

  .login-form {
    overflow: auto;
  }

  .container-itens {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container-itens--with-validator  {
    margin-top: 25vh;
  }

}

@media (max-width: 980px) {

  .side-left {
    display: none;
  }

  .container-itens {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .side-right {
    margin: 10px;
    border-radius: 20px;
    width: 100%;
    max-width: 650px;
  }

}

@media (max-width: 1600px) {

  .container-itens--with-validator {
    padding-top: 22vh;
    background-color: red;
  }

}

</style>

