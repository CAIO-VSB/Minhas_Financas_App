<script setup lang="ts">

    import { useAuthStore } from '~~/store/modules/auth-store'
    import { useValidateFields } from "~/composables/useValidateFields"
    import { useHttpAuth } from "~/composables/useHttp/useHtppAuth"
    import BaseModal from '~/components/ui/BaseModal.vue'

    const props = defineProps<{
        email: string | undefined
    }>()

    const emits = defineEmits<{
        closeModal: []
    }>()

    const { emailRules, passwordRules } = useValidateFields()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()
    const { postVerifyPassword } = useHttpAuth()
    const loading = ref(false)

    const modelValue = defineModel<boolean>()
    const newEmail = ref("")
    const authStore = useAuthStore()
    const showPassword = ref(false)
    const password = ref("")

    function closeModalSubmitChangeEmail() {
        modelValue.value = false
        emits("closeModal")
    }
    
    function redirectPageLogin() {
        authStore.showDialogAlertPassword = false
        navigateTo("/login-page")
        notifySuccess(
        "Sucesso",
        "Faça login novamente com seu novo e-mail.",
        5000
        )
    }
    
    async function handleUpateEmail() {
        if (!newEmail.value) {
            notifyInfo("Atenção", "Campo e-mail é obrigatório", 6000, true)
            return
        }

        if (!password.value) {
            notifyInfo("Atenção", "Campo senha de acesso é obrigatório", 6000, true)
            return
        }

        loading.value = true

        try {

            const resultValidatePassword = await postVerifyPassword(password.value)

            if (resultValidatePassword.valid) {
                await authStore.alterEmail(newEmail.value)
            } else {
                notifyInfo(
                "Atenção",
                "Não foi possível confirmar sua identidade. Verifique sua senha atual e tente novamente.",
                5000
                )
            }

        } catch (e) {
            console.log("Erro ao enviar solicitação" + e)
            notifyInfo("Erro", "Algo deu errado. Tente novamente em instantes.", 7000)
        } finally {
            loading.value = false
            modelValue.value = false
        }

    }

</script>


<template>
  <v-dialog
        transition="dialog-top-transition"
        width="auto"
        v-model="modelValue"
        persistent
        >

        <template v-slot:default="{ isActive }">
            <v-card width="500">
            <v-toolbar title="Alterar email de acesso">
                
            <template #append>
                <v-btn @click="closeModalSubmitChangeEmail"  icon="mdi-close" variant="text"></v-btn>
            </template>

            </v-toolbar>

            <v-card-text class="text-display-large pa-6">
                <v-text-field prepend-inner-icon="mdi-email" readonly v-model="props.email" label="Email atual*" variant="underlined"></v-text-field>
                <v-text-field prepend-inner-icon="mdi-email-check" :rules="emailRules" v-model="newEmail" name="email" autocomplete="email" label="Novo email*" variant="underlined"></v-text-field>
                <v-text-field
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                :rules="passwordRules" v-model="password" label="Senha de acesso*" variant="underlined">
                    <template #prepend-inner>
                        <v-icon icon="mdi-lock"></v-icon>
                    </template>
                </v-text-field>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions class="justify-end">
                <v-btn
                :loading="loading"
                text="Solicitar alteração"
                variant="flat"
                color="primary"
                class="text-none"
                @click="handleUpateEmail"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
    <BaseModal :persistent-modal="true" @close-modal="redirectPageLogin" :model-value="authStore.showDialogAlertEmail" title="Confirmação de alteração de e-mail">
        <div class="pa-2">
            <p>Para proteger sua conta, toda alteração de e-mail precisa ser confirmada.</p>
            <p>Enviaremos uma mensagem para o seu e-mail atual com as instruções para autorizar a mudança.</p> <br>
            <p>Após a confirmação, o novo e-mail passará a ser utilizado para acessar sua conta e receber comunicações do Velto Finance. Por segurança, será necessário fazer login novamente com o novo endereço de e-mail.</p>
        </div>
    </BaseModal>

</template>

<style scoped>


</style>