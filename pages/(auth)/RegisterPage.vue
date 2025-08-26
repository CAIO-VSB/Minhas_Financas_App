<script setup lang="ts">

  definePageMeta({
    layout: "layout-auth"
  })

  //Import de componentes
  import Toasts from '~/components/Toasts.vue'
  import type { User } from '~/types/TypeUser'
  import { useValidateForm } from "~/composables/useValidateFields";


  //Variáveis reativas
  const loading = ref(false)
  const showPassword = ref(true)
  const errorEmail = ref(false)
  const errorName = ref(false)
  const errorPassword = ref(false)
  const errorRepeatPassword = ref(false)
  const errorMessage = ref(false)
  const alertMessage = ref(false)
  const currentMessage = ref("")


  const logiForm = ref<User>({
    name: "",
    email: "",
    password: "",
    repeatPassword: ""
  })

  const listMessage = {
    emptyField: "Preencha todos os campos obrigatórios",
    formatName: "Limite máximo de 55 caracteres atingido",
    formatEmail: "O e-mail informado não possui um formato válido",
    formatPassword: "A senha deve conter no mínimo 6 caracteres",
    checkPasswords: "Os campos de senha devem ser iguais "
  }

  const { validateEmail, validatePassword, validateName, checkPasswords } = useValidateForm()

  const handleErrorName = (errorType: string) => {

    if (errorType === "empty") {
      errorName.value = true
      errorMessage.value = true
      currentMessage.value = listMessage.emptyField
    }

    if (errorType === "format") {
      errorName.value = true
      alertMessage.value = true
      currentMessage.value = listMessage.formatName
    }
  }

  const handleErrorEmail = (errorType: string) => {
  
    if (errorType === "empty") {
      errorMessage.value = true
      errorEmail.value = true
      currentMessage.value = listMessage.emptyField
    } else if (errorType === "format") {
      alertMessage.value = true
      currentMessage.value = listMessage.formatEmail
   }

  }

  const handleErrorPassword = (errorType: string) => {

    if (errorType === "empty") {
      errorMessage.value = true
      errorPassword.value = true
      currentMessage.value = listMessage.emptyField
    } else if (errorType === "format") {
      alertMessage.value = true
      currentMessage.value = listMessage.formatPassword
    }

  }

  const incompatiblePasswords = (errorType: string) => {

    if (errorType === "empty") {
      errorRepeatPassword.value = true
      errorMessage.value = true
      currentMessage.value = listMessage.emptyField
      console.log("Caiu aaqu?")
    }

    if (errorType === "incompatiblePasswords") {
      alertMessage.value = true
      currentMessage.value = listMessage.checkPasswords
    }
  }

  const resetFields  = () => {
    errorName.value = true
    errorEmail.value = false
    errorMessage.value = false
    errorPassword.value = false
    errorRepeatPassword.value = false
  }

  const submitData = () => {

    const isValidName = validateName(logiForm.value.name)
    const isValidEmail = validateEmail(logiForm.value.email)
    const isValidPassowrd = validatePassword(logiForm.value.password)
    const isValidCheckPassowrd = checkPasswords(logiForm.value.password, logiForm.value.repeatPassword)

    if (!isValidName.isValid) {
      handleErrorName(isValidName.errorType)
      return false
    }

    if (!isValidEmail.isValid) {
      handleErrorEmail(isValidEmail.errorType)
      return false
    }

    if (!isValidPassowrd.isValid) {
      handleErrorPassword(isValidPassowrd.errorType)
      return false
    }

    if (!isValidCheckPassowrd.isValid) {
      incompatiblePasswords(isValidCheckPassowrd.errorType)
      return false
    }


    resetFields()
    alert("Passou")
    return true

  }

</script>

<template>
  <div class=" flex login-container">

    <div class="flex container-itens">

      <div class="flex flex-col items-center justify-center rounded-l-4xl inset-shadow-sm !p-4 w-full side-left">
        <h4 class="text-center text-3xl mt-2 text-[#0096FF] font-['Montserrat'] font-semibold">Domine suas finanças.</h4>
        <h4 class="text-center  text-3xl mt-2 font-semibold">Antes que elas dominem <u>Você.</u></h4>
        <Carrossel></Carrossel>
      </div>

      <div class="rounded-r-4xl w-full flex items-center justify-center side-right">

          <v-form class="login-form w-full !p-5 !m-5 rounded-3xl overflow-hidden">

            <div class="flex items-center justify-center gap-3 bg-ambere-800 h-[100px]">
              <img class="logo" src="/assets/report.png" alt="MinhasFinancas.logo">
              <h2 class="text-3xl text-center font-normal font-[Montserrat] login-title">Minhas<strong>Finanças</strong></h2>
            </div>

             <div class="te flex flex-col items-center justify-center !p-4">
                <h3 class="text-[1.3rem] !p-1 font-['Montserrat'] !font-semibold">Cadastre-se para começar</h3>
                <p class="text-[0.86rem] text-gray-700 font-['Montserrat'] font-semibold">Preencha as informações abaixo</p>
            </div>

            <div>

              <div >
                <v-text-field label="Nome" type="name" name="name"
                variant="solo"
                density="comfortable"
                :error="errorName"   
                v-model="logiForm.name" 
                prepend-inner-icon="mdi-account"
                counter="45"
                >
                </v-text-field>
              </div>

              <div >
                <v-text-field label="E-mail" type="email" name="email"
                variant="solo"
                density="comfortable"
                :error="errorEmail"   
                v-model="logiForm.email" 
                placeholder="seunome@gmail.com"
                prepend-inner-icon="mdi-email"
                >
                </v-text-field>
              </div>

              <div>
                <v-text-field label="Senha" :type="showPassword ? 'password' : 'text'"
                variant="solo"
                density="comfortable"
                :error="errorPassword"
                v-model="logiForm.password"
                prepend-inner-icon="mdi-lock"
                >
                <template #append-inner>
                    <v-icon
                    :icon="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
                    @click="showPassword = !showPassword"
                    ></v-icon>
                </template>
                </v-text-field>
              </div>

              <div>
                <v-text-field label="Confirmação de senha" :type="showPassword ? 'password' : 'text'"
                variant="solo"
                density="comfortable"
                :error="errorRepeatPassword"
                v-model="logiForm.repeatPassword"
                prepend-inner-icon="mdi-lock-check"
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
                  @click="submitData"
                  >
                  Criar conta
                </v-btn>
              </div>
            </div>

          </v-form>

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
      </div>
    </div>
</template>

<style lang="scss" scoped>

.login-container {
  width: 100%;
  max-width: 1100px;
  overflow: auto;
}

.container-itens {
  width: 100%;
  min-height: 70dvh;
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
  font-size: clamp(0.85rem, 2.5vw, 1rem);
}

.button-login:hover {
  transform: translateY(-5px);
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

@media (max-width: 480px) {

  .side-right  {
    border-radius: 20px;
    width: 95%; 
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


}

</style>

