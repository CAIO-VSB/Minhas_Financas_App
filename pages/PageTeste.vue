<script lang="ts" setup>

  definePageMeta({
    layout: "layout-auth"
   })

</script>

<template>
  <div class=" flex login-container">

    <div class="flex container-itens">

      <div class="bg-[white] flex flex-col items-center justify-center rounded-l-4xl inset-shadow-sm !p-4 w-full side-left">
        <h4 class="text-center text-3xl text-[#0096FF] mt-2 font-['Montserrat'] font-semibold">Domine suas finanças.</h4>
        <h4 class="text-center text-3xl mt-2 font-['Montserrat'] font-semibold">Antes que elas dominem <u>Você.</u></h4>
        <Carrossel></Carrossel>
      </div>

      <div class="bg-[#0096FF] rounded-r-4xl !p-6 w-[100%] flex items-center justify-center side-right">

          <v-form class="login-form overflow-hidden">

            <div class="flex items-center justify-center gap-3 bg-ambere-800 h-[100px]">
              <h2 class="text-3xl text-center login-title">Minhas<strong>Finanças</strong></h2>
            </div>

             <div class="flex flex-col items-center justify-center !p-4">
                <h3 class="text-[1.3rem] sm:text-[1rem] !p-1 font-['Montserrat'] !font-semibold">Bem-vindo de volta!</h3>
                <p class="text-[0.82rem] text-gray-700 font-['Montserrat'] font-semibold">Acesse sua conta para continuar</p>
            </div>

            <div>

              <div >
                <v-text-field label="Another input"></v-text-field>
              </div>

              <div>
                <v-text-field label="Another input"></v-text-field>
              </div>

            </div>

            <div class="flex justify-center items-center !p-2 text-sm link-senha">
              <p class="font-['Montserrat'] text-base"><nuxt-link title="Clique aqui para recuperar sua senha" to="/RecoverPage">Esqueceu sua senha?</nuxt-link></p>
            </div>

            <div class="flex items-center justify-center gap-6 !p-2 !mt-2">
              <div class="w-[40%]">
                <v-btn
                  :disabled="loading"
                  :loading="loading"
                  class="text-none font-['Montserrat'] button-login"
                  size="large"
                  variant="flat"
                  color="indigo-darken-3"
                  block
                  @click="validateData"
                  >
                  Fazer login 
                </v-btn>
              </div>
              <div class="w-[60%]">
                <v-btn
                  :disabled="loading"
                  :loading="loading"
                  class="text-none font-['Montserrat'] button-singup"
                  size="large"
                  variant="flat"
                  block
                  @click="validateData"
                  >
                  Cadastrar-se
                </v-btn>
              </div>
            </div>


            <div class="flex justify-center items-center !p-2 text-sm login__more-login">
              <div class="bg-[#cbd5e1] flex-1 h-px"></div>
              <p class="!p-3 font-['Montserrat'] font-semibold">Ou acesse com</p>
              <div class="bg-[#cbd5e1] flex-1 h-px"></div>
            </div>

            <div class="flex justify-center items-center !p-3"> 
              <v-btn class="flex justify-center items-center font-1['Montserrat']  gap-1 button-google" title="Login com google">
                <template #prepend>
                    <img src="/assets/google.png" alt="">
                </template>
                </v-btn>
            </div>

          </v-form>

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
}

.side-right {
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.5);
}

.login-title {
  font-weight: 400;
  color: #2c3e50;
  font-family: "Montserrat", sans-serif;
}

.login-form {
  background-color: white;
  padding: 5px;
  width: 100%;
  border-radius: 25px;
  margin: 5px;
}

.link-senha {
  color: $color-primary-link;
}

.link-senha:hover {
  color: #2c3e50;
}

.button-google {
  width: 100%;
  box-shadow: none;
  background-color: white;
  border: 1px solid rgba(128, 128, 128, 0.425);
  border-radius: 20px;
}

.button-google:hover {
  transform: translateY(-5px);
}

.button-login {
  background-color: $color-primary-button !important;
  border-radius: 10px;
}

.button-login:hover {
  transform: translateY(-5px);
}

.button-singup {
  background-color: transparent !important;
  border: 1px solid #0096FF;
  color: #0096FF;
}

.button-singup:hover {
  background-color: #0096FF !important;
  color: white;
}

.login__button-google:hover {
  transform: translateY(-5px);
}

@media (max-width: 980px) {

  .side-left {
    display: none;
  }
  
  .side-right {
    margin: 10px;
    border-radius: 20px;
  }
}

@media (max-width: 460px) {

  .side-right  {
    border-radius: 20px;
    width: 90%;
  }

}



</style>