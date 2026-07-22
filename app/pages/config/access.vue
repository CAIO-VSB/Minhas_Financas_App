<script setup lang="ts">
    definePageMeta({
        title: "Configurações de acesso",
        layout: "layout-dashboard"
    })

    import type { TUser } from '~~/types/auth/Tauth.types'
    import { format } from 'date-fns'
    import { UAParser } from 'ua-parser-js'
    import { useAuthStore } from '~~/store/modules/auth-store'
    import { useValidateFields } from "~/composables/useValidateFields"
    import { useHttpAuth } from '~/composables/useHttp/useHtppAuth'
    import DialogEditEmail from '~/pages/config/components/DialogEditEmail.vue'
    import DialogEditPassword from './components/DialogEditPassword.vue'

    import defaultUser from "~/assets/aura.gif"
    
    const { $authClient } = useNuxtApp()
    const authStore = useAuthStore()
    const {nameRules} = useValidateFields()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()
    const { getAllAuthAccounts } = useHttpAuth()

    const { data: session } = await $authClient.getSession()
    const fakePassword = ref("***********")
    const parser = new UAParser(session?.session.userAgent ?? "")
    const resultParser = parser.getResult()
    const dateFormated = format(session?.user.createdAt!, "dd/MM/yyyy HH:mm:ss")
    const inputFocus = ref(false)
    const changeName = ref(false)
    const showConfirmEditName = ref(true)
    const inputNameReadOnly = ref(true)
    const hidePencilEditName = ref(false)
    const showCardChangeEmail = ref(false)
    const showCardChangePassword = ref(false)
    const userForm = ref<Partial<TUser>>({
        name: session?.user.name,
        email: session?.user.email
    })

    const { data } = useQuery({
        queryKey: QUERY_KEYS.auth.all,
        queryFn: getAllAuthAccounts,
    })

    const userProvider = computed(() => {
        return data.value?.find(item => item.userId === session?.session.userId) ?? null
    })
    const provedor = computed(() => {
        if (!userProvider.value) return ""
        if (userProvider.value.providerId === 'credential') {
            return "e-mail e senha"
        }
        return userProvider.value.providerId.charAt(0).toUpperCase() + userProvider.value.providerId.slice(1)
    })

    const headers = [
        { key: 'dispositivo', title: 'Dispositivo'},
        { key: 'inicio', title: 'Inicio' },
        { key: 'expiracao', title: 'Expiração' },
    ]

    const items = computed(() => [
        {
            dispositivo: `${resultParser.os.name} ${resultParser.os.version} (${resultParser.browser})`,
            inicio: format(session?.session.createdAt!, "dd/MM/yyyy HH:mm:ss"),
            expiracao: format(session?.session.expiresAt!, "dd/MM/yyyy HH:mm:ss")
        }
    ])

    function emDevImage() {
        notifyInfo(
        "Em desenvolvimento",
        "Esta funcionalidade ainda está em desenvolvimento e estará disponível em breve.",
        6000,
        true
        )
    }

    function enableNameEditing() {
        changeName.value = true
        inputFocus.value = true
        inputNameReadOnly.value = false
        showConfirmEditName.value = false
        hidePencilEditName.value = true
    }

    function resetStates() {
        changeName.value = false
        inputFocus.value = false
        inputNameReadOnly.value = true
        showConfirmEditName.value = true
        hidePencilEditName.value = false
        showCardChangeEmail.value = false
    } 

    function handleOpenModalSubmitEmail() {
        showCardChangeEmail.value = true
    }

    function handleCloseModalSubmitEmail() {
        showCardChangeEmail.value = false
    }

    function handleOpenModalSubmitPassword() {
        showCardChangePassword.value = true
    }

    function handleCloseModalSubmitPassword() {
        showCardChangePassword.value = false
    }

    async function hanldeUpdateUser() {
        if (!userForm.value.name) {
            notifyInfo("Atenção", "O nome não pode ficar em branco.", 7000, true)
            return
        }

        if (userForm.value.name.length > 30) {
            notifyInfo("Atenção", "O nome informado é muito longo. Use até 30 caracteres.", 7000, true)
            return
        }
        await authStore.alterUser(userForm.value)
        resetStates()
    }

</script>

<template>
    <div class="container">
        <div class="d-flex ga-8 justify-center mt-8 main">
            <div class="card-info-user d-flex flex-column align-center">
                <v-card :height="392" class="d-flex flex-column align-center card-meu-perfil">
                    <template #title>
                        <span class="font-weight-bold text-textSecundary" style="font-size: var(--text-lg);">Meu perfil</span>
                    </template>

                    <img class="elevation-1 user-image" style="border-radius: 100%; width: 11rem; height: 11rem;"  :src="session?.user.image || defaultUser" alt="image user">
                    <div class="d-flex flex-column align-center ga-1 mt-3">
                        <span class="text-textAlternative font-weight-bold text-no-wrap" style="font-size: var(--text-md);">{{ session?.user.name }}</span>
                        <span class="text-textSecundary">{{ session?.user.email }}</span>
                    </div>
                    <div class="d-flex justify-center mt-4">
                        <v-btn @click="emDevImage" prepend-icon="mdi-camera" color="primary" variant="tonal" class="text-none elevation-1" style="font-size: var(--text-base);">
                            Alterar foto
                        </v-btn>
                    </div>
                </v-card>
            </div>
            
            <div class="card-info-acesso">
                <v-card title="Dados da conta" subtitle="Mantenha seus dados sempre atualizados" >
                    <v-divider></v-divider>
                    <div class="pa-5 d-flex flex-column" v-if="session?.user">
                        <v-text-field counter="30" :rules="nameRules" :focused="inputFocus" v-model="userForm.name" :readonly="inputNameReadOnly" label="Nome" variant="underlined">
                            <template #append>
                                <div class="btn-edit">
                                    <v-tooltip text="Editar nome">
                                        <template v-slot:activator="{ props }">
                                            <v-icon :class="{hidePencilEditName}" @click="enableNameEditing" icon="mdi-pencil" v-bind="props"></v-icon>
                                        </template>
                                    </v-tooltip>
                                    <v-tooltip text="Salvar alterações">
                                        <template v-slot:activator="{ props }">
                                            <v-icon :class="{showConfirmEditName}" @click="hanldeUpdateUser" icon="mdi-check" v-bind="props"></v-icon>
                                        </template>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-text-field>
                        <v-text-field :disabled="(provedor === 'Discord' || provedor === 'Google') ? true : false" v-model="userForm.email" readonly label="Email de acesso" variant="underlined">
                            <template #append>
                                <div class="btn-edit">
                                    <v-tooltip text="Editar e-mail">
                                        <template v-slot:activator="{ props }">
                                            <v-icon @click="handleOpenModalSubmitEmail" icon="mdi-pencil" v-bind="props"></v-icon>
                                        </template>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-text-field>
                        <v-text-field  :disabled="(provedor === 'Discord' || provedor === 'Google') ? true : false" v-model="fakePassword" readonly  label="Senha" variant="underlined">
                            <template #append>
                                <div class="btn-edit">
                                    <v-tooltip text="Editar senha">
                                        <template v-slot:activator="{ props }">
                                            <v-icon @click="handleOpenModalSubmitPassword" icon="mdi-pencil" v-bind="props"></v-icon>
                                        </template>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-text-field>
                        <v-text-field v-if="userProvider" v-model="provedor" readonly label="Método de login" variant="underlined"></v-text-field>
                        <v-text-field v-model="dateFormated" readonly label="Criado em" variant="underlined"></v-text-field>
                    </div>
                    
                </v-card>
                <div class="mt-4">
                    <v-card  title="Informações da sessão" subtitle="Veja informações sobre sua sessão atual">
                    <template #append>
                        <v-tooltip text="Encerrar sessão atual">
                            <template v-slot:activator="{ props }">
                                <v-icon @click="authStore.logout()" color="red" style="cursor: pointer;" icon="mdi-power" v-bind="props"></v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        mobile-breakpoint="md"
                        hide-default-footer
                    >
                        <template v-slot:item.dispositivo="{ item }">
                            <div class="d-flex align-center ga-2">
                                <v-icon class="rounded-xl hover-icon"icon="mdi-monitor" size="small"></v-icon>
                                <span>{{ `${resultParser.os.name} ${resultParser.os.version} (${resultParser.browser})` }}</span>
                            </div>
                        </template>
                    </v-data-table>
                    </v-card>
                    <div class="mt-4">
                        <v-alert
                            type="info"
                            variant="tonal"
                            density="comfortable"
                            icon="mdi-information-outline"
                            class="mt-3 elevation-1"
                        >
                            Nem todas as informações estão disponíveis para todas as contas. Se você utiliza um provedor de login, como o Google, alguns campos podem aparecer vazios ou não permitir edição. Isso é esperado.
                        </v-alert>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <DialogEditEmail @close-modal="handleCloseModalSubmitEmail" :email="userForm.email" :model-value="showCardChangeEmail"></DialogEditEmail>
    <DialogEditPassword @close-modal="handleCloseModalSubmitPassword" :model-value="showCardChangePassword"></DialogEditPassword>
</template>

<style scoped>

.container {
    width: 100%;
    height: auto;
    margin: 10px;
}

.card-info-acesso {
    max-width: 100%;
    width: 60%;
}

.card-info-user {
    max-width: 100%;
    width: 22%;
}

.card-meu-perfil {
    width: 100%;
}

.btn-edit:hover {
    border-radius: 50%;
    cursor: pointer;
}

.showConfirmEditName {
    display: none;
}

.hidePencilEditName {
    display: none;
}

.user-image {
    object-fit: cover;
}

:deep(.v-data-table-header__content) {
    font-weight: 900;
}

@media (max-width: 1600px) {
    .main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .card-meu-perfil {
        width: 100%;
    }
    .card-info-user {
        max-width: 100%;
        width: 80%;
        margin: 10px;
    }
    .card-info-acesso {
        max-width: 100%;
        width: 80%;
    }
}

@media (max-width: 680px) {
    .main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .card-meu-perfil {
        width: 100%;
    }
    .card-info-user {
        max-width: 100%;
        width: 100%;
        padding-right: 20px;
    }
    .card-info-acesso {
        max-width: 100%;
        width: 100%;
        padding-right: 20px;
    }
}


</style>