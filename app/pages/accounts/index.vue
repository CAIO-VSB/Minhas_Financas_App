<script setup lang="ts">

  definePageMeta({
    title: "Contas bancárias",
    layout: "layout-dashboard",
    middleware: "session"
  })

  import CardAddAccount from "~/components/forms/CardAddAccount.vue"
  import BaseModal from "~/components/ui/BaseModal.vue"
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

  const generalBalance = computed(() => {

    const totalSaldo = balanceForId.value?.reduce((acc, conta) => {
      return Number(acc) + Number(conta.saldo_atual) 
    }, 0)

    return new Intl.NumberFormat('pt-br', {style: "currency", currency: 'BRL'}).format(totalSaldo ?? 0.00)
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

    console.log("Valor que chega para accounts", account)

    modalEditAccount.value = true
    editDraft.value = {
      ...structuredClone(toRaw(account)),
      initial_balance: account.initial_balance ?? 0.00,
      saldo_atual:  account.saldo_atual ?? 0.00
    } 
  }

  function handleCloseEditAccount () {
    modalEditAccount.value = false
    editDraft.value = null
  }

</script>


<template>

  <div class="text-center btn-add-account-layout">     
    <div class="btn-add-account">
        <v-btn
        color="blue"
        prepend-icon="mdi-plus"
        class="text-none rounded-xl"
        @click="handleOpenModalAddAccount"
        >
        NOVA CONTA 
        </v-btn>
    </div>
  </div>
    
  <div class="accounts-layout">

    <div class="accounts-list">
      <v-card class="mx-auto" width="100%" max-width="750" min-height="400"
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
              <div class="subtitle">
                <p style="padding-bottom: 12px;">{{ account.type_account }}</p>
                <div class="accounts-balance-for-account">
                  <span>Saldo atual</span> <span class="balance">{{ balanceFormated?.find(item => item.id === account.id)?.saldo_atual }}</span>
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
      
    </div>

    
    <div class="accounts-balance">
      <v-card  :loading="isPending">
        <template #subtitle>
          <span >Saldo atual</span>
        </template>
        <div class="accounts-general-balance">
            <span style="margin-left: 6px;">{{ generalBalance }}</span>
        </div>
        <template #append>
            <v-tooltip  text="Saldo total das contas ativas">
                <template v-slot:activator="{ props }">
                  <v-icon class="icon-help" v-bind="props" size="20px" icon="mdi-information-outline"></v-icon>
                </template>
            </v-tooltip>
        </template>
      </v-card>
    </div>

  </div>

</template>


<style lang="scss" scoped>

.accounts-layout {
  margin: 10px;
  display: flex;
  margin-top: 60px;
  gap: 10px;
  justify-content: center;

  @media (max-width: 1200px) {
    flex-direction: column;
    padding: 0 10px;
    margin-top: 40px;
  }
}

.accounts-list {
  min-width: 0;
  width: 600px;

    @media (max-width: 1200px) {
    width: 100%;
  }
  
}

.accounts-balance  {
  width: 290px;
  flex-shrink: 0;
  @media (max-width: 1200px) {
    width: 100%;
  }
}

.img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  object-fit: cover;
  flex-shrink: 0;
  margin-right: 12px;
}

.text-disabled {
  text-decoration: line-through;
}

.subtitle {
  display: flex;
  flex-direction: column;
}

.accounts-balance-for-account {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.balance {
  flex: 1;
  text-align: center;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 700;
  color: var(--color-text-primary);
}

.accounts-general-balance {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  display: flex;
  gap: 20px;
  padding-left: 10px;
  margin-bottom: 10px;
  font-weight: 700;
}

.btn-add-account-layout {
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-right: 20px;
}

.btn-add-account {
  display: flex;
  margin-top: 24px;
  gap: 20px;
  margin-right: 20px;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    margin-top: 20px;
    margin-right: 10px;
  }
}



</style>

