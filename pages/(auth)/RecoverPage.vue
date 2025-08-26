<script setup lang="ts">

  definePageMeta({
    layout: "layout-auth"
  })

   //Import de componentes
  import Toasts from '~/components/Toasts.vue'

   //Variáveis reativas
  const loading = ref(false)
  const errorEmail = ref(false)
  const errorMessage = ref(false)
  const alertMessage = ref(false)
  const currentMessage = ref("")
  const email = ref<string>("")

  const listMessage = {
    emptyField: "Preencha todos os campos obrigatórios",
    userNotFound: "Email ou senhas incorretos. Tente novamente",
    formatEmail: "O e-mail informado não possui um formato válido"
  }

  const { validateEmail } = useValidateForm();

  const handleErrorEmail = (errorType: string) => {

    if (errorType === "empty") {
      errorEmail.value = true
      errorMessage.value = true
      currentMessage.value = listMessage.emptyField
    }

    if (errorType === "format") {
      alertMessage.value = true
      currentMessage.value = listMessage.formatEmail
    }

  }

  const resetFields  = () => {
    errorEmail.value = false
    errorMessage.value = false
  }
   
  const submitData = () => {

    const isEmailValid = validateEmail(email.value)

    if (!isEmailValid.isValid) {
      handleErrorEmail(isEmailValid.errorType)
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
              <img class="logo" src="/assets/report.png" alt="">
              <h2 class="text-3xl text-center font-normal font-[Montserrat] login-title">Minhas<strong>Finanças</strong></h2>
            </div>

             <div class="flex flex-col items-center justify-center !p-4">
                <h3 class="text-[1.3rem] !p-1 font-['Montserrat'] !font-semibold login-sub-title">Recuperação de senha</h3>
                <p class="text-[0.76rem] text-gray-700 font-['Montserrat'] font-semibold">Insira as informação logo abaixo</p>
            </div>

            <div>

              <div >
                <v-text-field label="E-mail" type="email" name="email"
                variant="solo"
                density="comfortable"
                placeholder="seunome@gmail.com"
                prepend-inner-icon="mdi-email"
                :error="errorEmail"   
                v-model="email" 
                @keyup="resetFields"
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
                  @click="submitData"
                  >
                  Recuperar senha 
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

.login-sub-title {
  font-size: clamp(1rem, 2.5vw, 1.3rem);
}

.login-form {
  background-color: $color-secundary;
  padding: 5px;
  width: 100%;
  border-radius: 25px;
  margin: 5px;
}

.logo {
  width: clamp(42px, 2.5vw, 100px);
}

.button-google:hover {
  transform: translateY(-5px);
}

.button-login {
  background-color: $color-primary !important;
  font-size: clamp(0.80rem, 2.5vw, 1rem);
  width: 100% !important;
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
    width: 90%; 
  }

  .container-itens {
    display: flex;
    align-items: center;
    justify-content: center;
  }

}

</style>

