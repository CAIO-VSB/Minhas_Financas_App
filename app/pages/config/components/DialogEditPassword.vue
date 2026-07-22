<script setup lang="ts">

    import { useAuthStore } from '~~/store/modules/auth-store'
    import { useValidateFields } from "~/composables/useValidateFields"
    import BaseModal from '~/components/ui/BaseModal.vue';

    const emits = defineEmits<{
        closeModal: []
    }>()

    const { passwordRules } = useValidateFields()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()
    const loading = ref(false)

    const modelValue = defineModel<boolean>()
    const authStore = useAuthStore()
    const newPassword = ref("")
    const confirmPassword = ref("")
    const currentPassword = ref("")
    const showPassword = ref(false);

    const confirmPasswordRules = ref([
        (val: string) => !!val || "Campo confirmar senha é obrigatório",
        (val: string) =>
        val === newPassword.value || "As senha não coincidem",
    ]);

    const regexValidateNumber = computed(() => {
        return /\d/.test(newPassword.value)
    })

  const regexValidateMaiuscula = computed(() => {
        return /[A-Z]/.test(newPassword.value)
    })

  const regexValidateMinuscula = computed(() => {
        return /[a-z]/.test(newPassword.value)
    })

  const regexValidateEspecial = computed(() => {
        return /[^A-Za-z0-9]/.test(newPassword.value)
    })

  const regexValidateMinimoSeis = computed(() => {
        return newPassword.value.length >= 6
    })

    function closeModalSubmitChangePassword() {
        modelValue.value = false
        emits("closeModal")
    }

    function redirectPageLogin() {
        authStore.showDialogAlertPassword = false
        navigateTo("/login-page")
        notifySuccess(
        "Sucesso",
        "Faça login novamente com sua nova senha.",
        5000
        )
    }
    
    async function handleUpatePassword() {
        if (!newPassword.value) {
            notifyInfo("Atenção", "Campo nova senha é obrigatório", 6000, true)
            return
        }

        loading.value = true

        try {
            await authStore.alterPassword(newPassword.value, currentPassword.value)
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
            <v-toolbar title="Alterar senha de acesso">
                
            <template #append>
                <v-btn @click="closeModalSubmitChangePassword"  icon="mdi-close" variant="text"></v-btn>
            </template>

            </v-toolbar>

            <div class="ml-4 mr-5">
                <v-alert
                type="warning"
                variant="tonal"
                density="comfortable"
                icon="mdi-information-outline"
                class="mt-3"
                >
                    Todas as sessões ativas serão desconectadas.
                </v-alert>
            </div>

            <v-card-text class="text-display-large pa-6">
                <v-text-field  
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                :rules="passwordRules" autocomplete="off" v-model="currentPassword" label="Senha atual*" variant="underlined">
                    <template #prepend-inner>
                        <v-icon icon="mdi-lock-question"></v-icon>
                    </template>
                </v-text-field>

                <v-text-field
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                :rules="passwordRules" v-model="newPassword" label="Nova senha*" variant="underlined">
                    <template #prepend-inner>
                        <v-icon icon="mdi-lock-check"></v-icon>
                    </template>
                </v-text-field>

                <v-text-field 
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                :rules="confirmPasswordRules" v-model="confirmPassword" autocomplete="off" label="Confirmar nova senha*" variant="underlined">
                    <template  #prepend-inner>
                        <v-icon icon="mdi-lock"></v-icon>
                    </template>
                </v-text-field>
                    <div class="validate-password">
                        <span class="font-weight-bold mb-2">Sua senha deve conter no mínimo:</span>
                        <v-expand-transition>
                        <div class="ml-1 bg-gray">          
                            <div>
                            <v-icon :color="regexValidateMinimoSeis ? 'green':'red'" :icon="regexValidateMinimoSeis ? 'mdi-check-circle-outline': 'mdi-close-circle-outline'" size="small"></v-icon>
                            6 caracteres
                            </div>
                            <div>
                            <v-icon :color="regexValidateMaiuscula ? 'green':'red'" :icon="regexValidateMaiuscula ? 'mdi-check-circle-outline': 'mdi-close-circle-outline'"  size="small"></v-icon>
                            Uma letra maiúscula
                            </div>
                            <div>
                            <v-icon :color="regexValidateMinuscula ? 'green':'red'" :icon="regexValidateMinuscula ? 'mdi-check-circle-outline': 'mdi-close-circle-outline'" size="small"></v-icon>
                            Uma letra minúscula
                            </div>
                            <div>
                            <v-icon :color="regexValidateNumber ? 'green':'red'" :icon="regexValidateNumber ? 'mdi-check-circle-outline': 'mdi-close-circle-outline'" size="small"></v-icon>
                            Um número
                            </div>
                            <div>
                            <v-icon :color="regexValidateEspecial ? 'green':'red'" :icon="regexValidateEspecial ? 'mdi-check-circle-outline': 'mdi-close-circle-outline'" size="small"></v-icon>
                            Um caractere especial
                            </div>
                        </div>
                        </v-expand-transition>
                </div>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions class="justify-end">
                <v-btn
                :loading="loading"
                text="Solicitar alteração"
                variant="flat"
                color="primary"
                class="text-none"
                @click="handleUpatePassword"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
    <BaseModal
    :persistent-modal="true"
    :model-value="authStore.showDialogAlertPassword"
    @close-modal="redirectPageLogin"
    title="Senha alterada com sucesso"
    >
    <div class="pa-2">
        <p>Sua senha foi alterada com sucesso.</p>

        <p>
            Por motivos de segurança, sua sessão atual foi encerrada.
        </p>

        <br>

        <p>
            Ao clicar em <strong>OK</strong>, você será redirecionado para a tela de login.
            Utilize sua nova senha para acessar sua conta novamente.
        </p>
    </div>
</BaseModal>

</template>

<style scoped>

.validate-password {
    background-color: #f2f2f2;
    padding: 5px;
}

</style>