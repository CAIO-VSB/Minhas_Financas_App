<script setup lang="ts">

    import CardAddAccount from "~/components/CardAddAccount.vue"
    import BaseModal from "~/components/BaseModal.vue"
    import CardEditAccount from "~/components/CardEditAccount.vue"
    import type { TAccount } from "~/types/account/TAccount.types"
    import { useEditItem } from "~/composables/useAccount/useEditItem"
    import { fetchAccounts, useAccountsAPI } from "~/composables/useAccount/useAccountAPI"

    definePageMeta({
        title: "Contas bancárias",
        layout: "layout-dashboard"
    })


    const { data: serverData } = await useAsyncData<TAccount[]>(
        'accounts',
        fetchAccounts
    )
    const { getAccounts } = useAccountsAPI()
    const { isLoading, data, error, isError } = getAccounts(serverData.value || undefined)
    const { selectdItem } = useEditItem()
    const modalAddAccount = ref(false)
    const modalEditAccount = ref(false)
    const errorMessage = ref("")
    const errorModal = ref(false)

    const items = [
        { title: 'Mostrar contas desativadas' }
    ]

    function handleOpenModalAddAccount() {
        modalAddAccount.value = true
    }

    function handleOpenModalEditAccount(produto: TAccount) {
        modalEditAccount.value = true
        selectdItem(produto.name, produto.nameBank, produto.urlImage, produto.color, produto.type, produto.active)
        
    }

</script>


<template>



    <div class="!mt-15 card">
        <v-card
        class="mx-auto "
        max-width="750"
        min-height="400"
        >
            <template v-slot:title>
                <span class="title-card">Contas</span>
            </template>

            <template v-slot:subtitle>
                <span class="sub-title-card">Lista de contas ativas</span>
            </template>
            

            <v-divider></v-divider>

            <v-skeleton-loader v-if="isLoading && !data" type="list-item-avatar"></v-skeleton-loader>

            <v-list 
            lines="two"
            item-props
            >
                <v-list-item
                v-for="(account, index) in data || []"
                :key="account.id"
                :title="account.name"
                :style="{boxShadow: `inset 0.1875rem 0 0 ${account.color} `, marginBottom: '10px'}"
                >

                <template #prepend>
                    <div class="img-container">
                        <img class="img" :src="account.urlImage" alt="img">
                    </div>
                </template> 

                <template v-slot:subtitle>
                    <p style="padding-bottom: 12px;">{{ account.type }}</p>
                </template>


                <v-divider ></v-divider>

                <template #append>
                    <v-btn @click="handleOpenModalEditAccount(account)" icon="mdi-pencil" variant="plain" ></v-btn>
                    <v-tooltip
                    activator="parent"
                    location="end"
                    >
                    Editar conta
                    </v-tooltip>
                </template>

                </v-list-item>

            </v-list>

            <div>
                <Teleport v-if="modalAddAccount" to="body">
                    <CardAddAccount v-model="modalAddAccount"/>
                </Teleport>
            </div>

            <div>
                <Teleport v-if="modalEditAccount" to="body">
                    <CardEditAccount v-model="modalEditAccount" />
                </Teleport>
            </div>

            <div v-if="!data || data.length === 0">
                <BaseEmpty 
                headline="Nenhuma conta cadastrada"
                title="Você ainda não possui contas registradas"
                text="No momento, não há contas para exibição.
                Cadastre uma nova conta para começar a organizar e acompanhar suas movimentações financeiras."
                />
            </div>  
        </v-card>

        <div class="fab-wrapper">
            <v-tooltip text="Nova conta" location="left">
                <template #activator="{ props }">
                <v-fab
                    v-bind="props"
                    color="blue"
                    icon="mdi-plus"
                    size="60"
                    @click="handleOpenModalAddAccount"
                />
                </template>
            </v-tooltip>
        </div>

    
        <div >
            <BaseModal
            :text="errorMessage"
            title="Erro"
            :model-value="errorModal"
            ></BaseModal>
        </div>

    </div>


</template>


<style lang="scss" scoped>

.fab-wrapper {
  position: fixed;
  bottom: 25px;
  right: 24px;
  z-index: 9999;
}

.title-card {
    font-family: "Poppins", sans-serif;
} 

.sub-title-card {
    font-family: "Poppins", sans-serif;
}

::v-deep(.v-list-item-title) {
    font-family: "Poppins", sans-serif;
}

::v-deep(.v-list-item-subtitle) {
    font-family: "Poppins", sans-serif;
}

.card {
    margin: 10px;
}

.img-container {
    margin-right: 10px;
}

.img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-right: 5px;
}



</style>

