<script setup lang="ts">

  definePageMeta({
    title: "Contas bancárias",
    layout: "layout-dashboard",
    middleware: "session"
  })

  import CardAddAccount from "~/components/forms/CardAddAccount.vue"
  import BaseModal from "~/components/ui/BaseModal.vue"
  import BaseFab from "~/components/ui/BaseFab.vue"
  import BaseEmpty from "~/components/ui/BaseEmpty.vue"
  import CardEditAccount from "~/components/forms/CardEditAccount.vue"
  import type { TAccount } from "~~/types/account/TAccount.types"
  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
  import { useSelectedColor } from "~/composables/useAccount/useSelectedColor"
  import { useSelectedBank } from "~/composables/useAccount/useSelectedBank"


  const { getAllAccounts, getBalanceForAccount } = useHttpAccounts()
  const { resetColor } = useSelectedColor()
  const { resetBank } = useSelectedBank()
  
  const modalAddAccount = ref(false)
  const modalEditAccount = ref(false)
  const errorModal = ref(false)
  const activeFilterAccounts = ref<boolean>(true)
  const editDraft = ref<TAccount | null>(null)

  const options = [
    { title: 'Somente contas ativas', icon: 'mdi-check-circle-outline', value: true },
    { title: 'Somente contas desativadas', icon: 'mdi-pause-circle-outline', value: false }
  ]

  const { isPending, data, error } = useQuery({
    queryKey: QUERY_KEYS.accounts.all,
    queryFn: getAllAccounts,
  })

  const { data:balanceForId } = useQuery({
    queryKey: QUERY_KEYS.accounts.getBalanceForAccount,
    queryFn: getBalanceForAccount,
  })

  const balanceFormated = computed(() => {

    return balanceForId.value?.map(item => ({
        ...item,
        saldo_atual: new Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(item.saldo_atual ?? 0.00)
    }))

  })


  function handleOpenModalAddAccount() {
    modalAddAccount.value = true
    resetColor()
    resetBank()
  }

  function filterAccounts(value: boolean | null) {
    const accounts = data.value ?? []

    if (value === null || undefined) {
      return accounts
    }

    return accounts.filter(item => item.active === value)
  }

  const filteredAccounts = computed(() => {
    return filterAccounts(activeFilterAccounts.value)
  })

  function handleOpenModalEditAccount(account: TAccount) {
    modalEditAccount.value = true
    editDraft.value = {
      ...structuredClone(toRaw(account)),
      initial_balance: account.saldo_atual ?? 0.00
    } 
  }

  function handleCloseEditAccount () {
    modalEditAccount.value = false
    editDraft.value = null
  }

</script>


<template>

  <div class="!mt-15 card">
    <v-card class="mx-auto" max-width="750" min-height="400"
    >
      <template #append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, i) in options"
              :key="i"
              :value="i"
              :title="item.title"
              :prepend-icon="item.icon"
              @click="activeFilterAccounts = item.value"
            >
              
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    
      <template v-slot:title>
        <span class="title-card">Contas</span>
      </template>

      <template v-slot:subtitle>
        <span class="sub-title-card">Lista de contas cadastradas</span>
      </template>

      <v-divider></v-divider>

      <v-skeleton-loader 
      v-if="isPending"
      v-for="n in 5" 
      :key="n" 
      type="list-item-avatar"
      class="mb-2"
      />

      <v-list lines="two" item-props>
        <v-list-item
          v-for="(account, index) in filteredAccounts || []"
          :key="account.id"
          :style="{ boxShadow: `inset 0.15rem 0 0 ${account.color}`, marginBottom: '10px' }"
        >

          <template #title>
            <div>
              <p :class="{'text-disabled': !account.active}" style="padding-bottom: 4px;">{{ account.name_identifier }} </p>

            </div>
          </template>

          <template #prepend>
            <div class="img-container">
              <img class="img" :src="account.url_image" alt="img" />
            </div>
          </template>

          <template #subtitle>
            <div  class="subtitle">
              <p style="padding-bottom: 12px;">{{ account.type_account }}</p>
              <div class="valor-saldo">
                <span>Saldo atual</span> <span class="saldo">{{ balanceFormated?.find(item => item.id === account.id)?.saldo_atual }}</span>
              </div>
            </div>
          </template>

          <v-divider></v-divider>

          <template #append>
            <v-btn
              @click="handleOpenModalEditAccount(account)"
              icon="mdi-square-edit-outline"
              variant="plain"
            ></v-btn>
            <v-tooltip activator="parent" location="end">
              Editar conta
            </v-tooltip>
          </template>
        </v-list-item>
      </v-list>

      <div v-if="data?.length === 0">
        <BaseEmpty
          headline="Nenhuma conta cadastrada"
          title="Você ainda não possui contas registradas"
          text="No momento, não há contas para exibição.
          Cadastre uma nova conta para começar a organizar e acompanhar suas movimentações financeiras."
        />
      </div>

        <CardAddAccount v-model="modalAddAccount" />

        <CardEditAccount
        :draft="editDraft"
        v-model="modalEditAccount"
        @Close="handleCloseEditAccount"
        />

    </v-card>

    <div class="fab-wrapper">
      <v-tooltip text="Nova conta" location="left">
        <template #activator="{ props }">
          <BaseFab 
          v-bind="props"
          color="blue"
          icon="mdi-plus"
          size="65"
          @click="handleOpenModalAddAccount"
          />
        </template>
      </v-tooltip>
    </div>

    <BaseModal :text="error?.message" title="Atenção (error)" :model-value="errorModal" />
  </div>


</template>


<style lang="scss" scoped>

.fab-wrapper {
  position: fixed;
  bottom: 25px;
  right: 24px;
  z-index: 9999;
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

.text-disabled {
  text-decoration: line-through;
}

.subtitle {
  display: flex;
  flex-direction: column;
}

.valor-saldo {
  display: flex;
  gap: 40px;
}

.saldo {
  width: 65%;
  display: flex;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 900;
  color: black;
}



</style>

