<script setup lang="ts">

  definePageMeta({
    layout: "layout-auth",
  });

  import Toasts from "~/components/Toasts.vue";
  import { useValidateFields } from '~/composables/useValidateFields';
  import { useAuthStore } from "~/store/modules/auth-store";
  import type { LoginForm } from "~/types/user/types";

  const loadingEmail = ref(false)
  const loadingGoogle = ref(false)
  const showPassword = ref(true)
  const form = ref()
  const logiForm = ref<LoginForm>({
    email: "",
    password: "",
  })
  
  const authStore = useAuthStore()

  const { emailRules, passwordRules, validateSchemaSignIn } = useValidateFields()

  async function loginWidthEmailAndPassword() {

    try {
      loadingEmail.value = true 

      const formValid = await form.value.validate()
      const resultSchema = validateSchemaSignIn(logiForm.value)

      if (formValid) {
        if (resultSchema) {
          const result = await authStore.login(logiForm.value)

          if (result?.success) {
            navigateTo({path: "/dashboard/"})
          }
        }
      }
    } catch (error) {
      console.log("Erro ao tentar fazer login (geral no catch)" + error)
    } finally {
      loadingEmail.value = false
    }

  }

  async function loginWidthGoogle() {

    try {

      loadingGoogle.value = true

      await authStore.loginGoogle()
  
    } catch (error) {
      console.log("Erro ao autenteicar com o google" + error)
    } finally {
      loadingGoogle.value = true
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
          @submit.prevent
          class="login-form w-full !p-5 !m-5 rounded-3xl overflow-hidden"
          ref="form"
        >
          <div
            class="flex items-center justify-center gap-3 bg-ambere-800 h-[100px]"
          >
            <img class="logo" src="/assets/report.png" alt="img-logo" />
            <h2
              class="text-3xl text-center font-normal font-[Montserrat] login-title"
            >
              Minhas<strong>Finanças</strong>
            </h2>
          </div>

          <div class="flex flex-col items-center justify-center !p-4">
            <h3 class="text-[1.3rem] !p-1 font-['Montserrat'] !font-semibold">
              Bem-vindo de volta!
            </h3>
            <p
              class="text-[0.86rem] text-gray-700 font-['Montserrat'] font-semibold"
            >
              Acesse sua conta para continuar
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
                v-model="logiForm.email"
                :rules="emailRules"
              >
              </v-text-field>
            </div>

            <div>
              <v-text-field
                label="Senha"
                :type="showPassword ? 'password' : 'text'"
                variant="solo"
                density="comfortable"
                v-model="logiForm.password"
                hint="Digite sua senha para acessar o sistema"
                prepend-inner-icon="mdi-lock"
                :rules="passwordRules"
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

          <div class="flex justify-center items-center !p-2 text-sm link-senha">
            <p class="font-['Montserrat'] text-base link-senha">
              <nuxt-link
                title="Clique aqui para recuperar sua senha"
                to="/recover-password-page"
                >Esqueceu sua senha?</nuxt-link
              >
            </p>
          </div>

          <div class="flex items-center justify-center gap-6 !p-2 !mt-2">
            <div class="w-[40%]">
              <v-btn
                :disabled="loadingEmail"
                :loading="loadingEmail"
                class="text-none font-['Montserrat'] rounded-xl button-login"
                size="large"
                variant="flat"
                color="indigo-darken-3"
                block
                @click="loginWidthEmailAndPassword"
              >
                Fazer login
              </v-btn>
            </div>
            <div class="w-[60%]">
              <v-btn
                type="button"
                class="text-none font-['Montserrat'] rounded-xl button-singup"
                size="large"
                variant="flat"
                block
                to="/register-page"
              >
                Cadastrar-se
              </v-btn>
            </div>
          </div>

          <div
            class="flex justify-center items-center !p-2 text-sm login__more-login"
          >
            <div class="bg-[#cbd5e1] flex-1 h-px"></div>
            <p class="!p-3 font-['Montserrat'] font-semibold">Ou acesse com</p>
            <div class="bg-[#cbd5e1] flex-1 h-px"></div>
          </div>

          <div class="flex justify-center items-center !p-3">
            <v-btn
              class="flex justify-center items-center w-full gap-1 button-google"
              title="Login com google"
              :disabled="loadingGoogle"
              :loading="loadingGoogle"
              @click="loginWidthGoogle"
            >
              <template #prepend>
                <img src="/assets/google.png" alt="" />
              </template>
            </v-btn>
          </div>
        </v-form>

        <div>
          <Toasts
            color="error-primary"
            :text="authStore.typeMessage"
            timer="#E57373"
            v-model="authStore.activeMessageError"
            icon="mdi-alert"
            size="x-large"
            color-icon="white"
          >
          </Toasts>
        </div>

        <div>
          <Toasts
            color="alert-primary"
            :text="authStore.typeMessage"
            timer="#F0F4C3"
            v-model="authStore.activeMessageAlert"
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
  font-size: clamp(1.5rem, 2.5vw, 2rem);
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

.link-senha {
  color: $color-primary-link;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
}

.link-senha:hover {
  color: $color-primary-title;
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

.button-singup {
  background-color: transparent !important;
  border: 1px solid $color-primary;
  color: $color-primary;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
}

.button-singup:hover {
  background-color: $color-primary !important;
  color: white;
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
  .side-right {
    border-radius: 20px;
    width: 90%;
    margin-right: 35px;
  }

  .container-itens {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
