<script setup lang="ts">

  definePageMeta({
    title: "Contas bancárias",
    layout: "layout-dashboard",
    middleware: "session"
  })

  
  import CardAddAccount from "~/components/forms/CardAddAccount.vue"
  import CardEditAccount from "~/components/forms/CardEditAccount.vue"
  import type { TAccount } from "~~/types/account/TAccount.types"
  import type { TOptionAction } from "~~/types/option_action/TOptionAction"
  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
  import { useSelectedColor } from "~/composables/useAccount/useSelectedColor"
  import { useSelectedBank } from "~/composables/useAccount/useSelectedBank"
  import CardAddMovimentsExpenses from "~/components/forms/CardAddMovimentsExpenses.vue"

  const { getAllAccounts, getBalanceForAccount } = useHttpAccounts()
  const { resetColor } = useSelectedColor()
  const { resetBank } = useSelectedBank()

  const modalAddAccount = ref(false)
  const modalEditAccount = ref(false)
  const modalAddExpense = ref(false)
  const editDraft = ref<TAccount | null>(null)

  const { isPending, data, error } = useQuery({
    queryKey: QUERY_KEYS.accounts.all,
    queryFn: getAllAccounts,
  })

  const { data:balanceForId } = useQuery({
    queryKey: QUERY_KEYS.accounts.getBalanceForAccount,
    queryFn: getBalanceForAccount,
  })

  function handleOpenModalAddAccount() {
    modalAddAccount.value = true
    resetColor()
    resetBank()
  }

  const totalForAccountsActive = computed(() => {

    const total = data.value?.filter(item => item.active === true).reduce((acc, item) => {
      return Number(acc) + Number(item.saldo_atual)
    }, 0) ?? 0.00

   return total
    
  })

  const filteredAccounts = computed(() => {
    return data.value?.filter(item => item.active !== false)
  })


  function getOptionsAccounts(account: TAccount) {
    const options = [
      { title: 'Editar', value: "edit", icon: "mdi-circle-edit-outline" },
      { title: 'Arquivar', value: "arquivar", icon: "mdi-archive" },
    ]

    return options
  } 

  function getOptions() {
    const options = [
      { title: 'Contas arquivadas', value: "arquivadas", icon: "mdi-archive-clock" },
    ]

    return options
  } 

  function handleCloseEditAccount() {
    modalEditAccount.value = false
    editDraft.value = null
  }

  function handleOpenModalEditAccount(account: TAccount) {

    modalEditAccount.value = true
    editDraft.value = {
      ...structuredClone(toRaw(account)),
      initial_balance: account.initial_balance ?? 0.00,
      saldo_atual:  account.saldo_atual ?? 0.00
    } 
  }

  function handleOptionAccountsDisable() {
    navigateTo("/accounts/accountsDisable")
  }

  function handleOptionClick(option: TOptionAction, data: TAccount) {

    if (option.value === "edit") {
      handleOpenModalEditAccount(data)
      return 
    }

  }

 
</script>


<template>
  <div class="pa-2 mt-7">
    
    <div class="w-100 d-flex  align-center justify-sm-end ga-3 pr-4 mb-6 btn-options">
      <v-btn
        color="primary"
        icon="mdi-plus"
        variant="tonal"
        size="default"
        rounded="lg"
        title="Nova conta"
        @click="handleOpenModalAddAccount"
        
      >
      </v-btn>

        <v-menu
          transition="slide-y-transition"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                color="primary"
                v-bind="props"
                icon="mdi-dots-vertical"
                variant="tonal"
                size="default"
                rounded="lg"
              >
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, i) in getOptions()"
                :key="i"
                :value="i"
                prepend-icon="mdi-archive-clock"
                @click="handleOptionAccountsDisable"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
        </v-menu>
    </div>
    
    <div class="cards-main">

      <v-card style="border: 1px dotted #4A7FD4 !important;" height="200">
        <div class="d-flex justify-center align-center h-100 flex-column ga-2">
          <v-btn
          color="primary"
          icon="mdi-plus"
          size="60"
          class="border"
          variant="tonal"
          @click="handleOpenModalAddAccount"
          ></v-btn>
          <span style="color: #4A7FD4;">Nova conta</span>
        </div>
      </v-card>

     <v-card :loading="isPending" rounded="lg" elevation="1" class="pa-4" height="200">
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="d-flex align-center ga-2">
            <v-avatar color="primary" size="32" rounded="md">
              <v-icon color="white" size="18">mdi-bank</v-icon>
            </v-avatar>
            <span class="text-body-3 text-medium-emphasis">Saldo atual</span>
          </div>
          <v-icon size="15" color="medium-emphasis">mdi-chevron-right</v-icon>
        </div>

        <div class="d-flex align-center justify-space-between mb-16">
          <span class="text-h7 font-weight-bold text-high-emphasis ml-1 mt-2">
            {{ formatCurrency(totalForAccountsActive || 0.00) }}
          </span>
          <v-chip :color="totalForAccountsActive  >= 0 ? 'success' : 'error'" size="small" variant="tonal">
            <v-icon start size="12">{{ totalForAccountsActive >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
            {{ totalForAccountsActive >= 0 ? 'Positivo' : 'Negativo' }}
          </v-chip>
        </div>

        <v-divider></v-divider>
      
        <div class="pa-2">
          <span  class="font-weight-semibold text-obs-saldo-atual">
            *Valor consolidado de todas as contas cadastradas e ativas.
          </span>
        </div>
      
      </v-card>

      <v-card :style="{ backgroundColor: value.color + '10' }" v-for="value in filteredAccounts" :key="value.id" height="200">
        <template #prepend>
            <v-avatar
            :image="value.url_image"
            size="45"
            >
            </v-avatar>
             <span class="ml-2">{{ value.name_identifier }}</span>  
          </template>

          <template #append>
    
            <v-menu
              transition="scale-transition"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                color="black"
                icon="mdi-dots-vertical"
                variant="text"
                v-bind="props"
                >
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-for="(action, i) in getOptionsAccounts(value)"
                  :key="i"
                  :value="i"
                  :prepend-icon="action.icon"
                  @click="handleOptionClick(action, value)"
                >
                  <v-list-item-title>{{ action.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template #text>
            <div class="d-flex ga-16 mt-3">
              <span class="font-weight-semibold">Saldo atual</span>
              <span class="mb-10 font-weight-bold">{{ formatCurrency(value.saldo_atual ?? 0.00) }}</span>
            </div>
          </template>

           <v-divider></v-divider>

          <div class="d-flex mb-1  mt-1 align-center justify-center">
            <v-btn
            variant="text"
            color="primary"
            @click="modalAddExpense = true"
            >
              Adicionar despesa
            </v-btn>
          </div>
      </v-card>

      <CardAddAccount v-model="modalAddAccount" />
      <CardEditAccount :draft="editDraft" v-model="modalEditAccount" />
      <CardAddMovimentsExpenses v-model="modalAddExpense" />
    </div>

  
  </div>
  
</template>


<style scoped>

.cards-main {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
}

.text-obs-saldo-atual {
  font-size: clamp(0.75rem, 2.5vw, 0.90rem);
}

@media (max-width: 1600px) {
  .text-obs-saldo-atual {
    font-size: clamp(0.55rem, 1.5vw, 0.75rem);
    overflow: auto;
  }
}

@media (max-width: 960px) {
  .cards-main {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }

  .text-obs-saldo-atual {
    font-size: clamp(0.65rem, 2vw, 0.75rem);
  }
}

</style>

