<script setup lang="ts">

  definePageMeta({
    title: "Contas bancárias",
    layout: "layout-dashboard",
    middleware: "session"
  })

  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
  import type { TAccount } from "~~/types/account/TAccount.types"
  import { useInvalidate } from "~/composables/useInvalidate"
  
  const { getAllAccounts, getBalanceForAccount, patchAccountById } = useHttpAccounts()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { invalidate } = useInvalidate()

  const loadingButton = ref(false)
  const headers = [
    { key: 'id', title: 'ID' },
    { key: 'name_identifier', title: 'Descrição' },
    { key: 'type_account', title: 'Tipo de conta' },
    { key: 'saldo_atual', title: 'Saldo atual' },
    { key: 'actions', title: 'Ações' },
  ]

  const { isPending, data, error } = useQuery({
    queryKey: QUERY_KEYS.accounts.all,
    queryFn: getAllAccounts,
  })

  const { data:balanceForId } = useQuery({
    queryKey: QUERY_KEYS.accounts.getBalanceForAccount,
    queryFn: getBalanceForAccount,
  })

  const  { mutate } = useMutation({

    mutationFn: (payload: TAccount) => patchAccountById(payload.id!, payload),

    onSuccess: () => {
      invalidate(QUERY_KEYS.accounts.all)
      invalidate(QUERY_KEYS.accounts.getBalanceForAccount)
      notifySuccess("Sucesso", "Operação realizada com sucesso", 6000)
    },

    onError: (error) => {
      const errorFatal = handleErrorApplication(error.statusCode)
      console.dir("O erro tá vindo aqui pelo menos " + errorFatal)
    },

  })

  const onlyAccountsDisable = computed(() => {
    return data.value?.filter(item => item.active === false)
  })

  const totalArchived = computed(() => {

    const total = balanceForId.value?.filter(item => item.active === false).reduce((acc, item) => {
      return Number(acc) + Number(item.saldo_atual)
    }, 0)

   return total
    
  })

  function backScreenAccounts() {
    navigateTo("/accounts")
  }

  function restoreAccount(account: TAccount) {
    
    loadingButton.value = true

    try {

      if (!account) {
        notifyError("Error", "Conta não encontrada. Tente novamente")
        return
      }      

      const payload = {
        ...account,
        active: true,
        initial_balance: account.initial_balance ? Number(account.initial_balance) : null
      }

      mutate(payload)

    } catch (e) {
      console.log("Erro ao restautar conta", e)
    } finally {
      loadingButton.value = false
    }

  }

</script>

<template>

  <div class="mt-10 mb-16 d-flex align-center ga-3">
    <span class="ml-1">
      <v-btn
        icon="mdi-arrow-left"
        color="black"
        variant="text"
        @click="backScreenAccounts"
        >
        </v-btn>
    </span>
    <span class="font-weight-bold" style="font-size: var(--text-lg);">Contas arquivadas</span>
  </div>

  <div class="pa-2 d-flex ga-7 container-main">
    <div class="w-100">
      <v-data-table class="elevation-1" :loading="isPending" mobile-breakpoint="md" :headers="headers" :items="onlyAccountsDisable" hide-default-footer>

        <template v-slot:item.actions="{ item }">
            <v-tooltip text="Restaurar">
            <template v-slot:activator="{ props }">
            <v-btn
            v-bind="props"
            icon="mdi-restore"
            color="black"
            variant="text"
            :loading="loadingButton"
            @click="restoreAccount(item)"
            >
            </v-btn>
            </template>
          </v-tooltip>
        </template>

        <template v-slot:item.saldo_atual="{ item }">
          <v-chip :color="(item.saldo_atual! >= 0) ? 'success': 'red'">
           {{ formatCurrency(item.saldo_atual ?? 0.00) }}
          </v-chip>
        </template>

      </v-data-table>
    </div>
    
    <v-card style="height: 120px;" class="w-33 card-saldo-total-archived">
      <template #subtitle>
        <span class="text-medium-emphasis">Saldo total arquivado</span>
      </template>
      <template #text>
        <div class="d-flex align-center">
          <span class="text-h6 font-weight-bold w-100 saldo-total-archived">{{ formatCurrency(totalArchived ?? 0.00) }}</span>
          <span class="w-100 d-flex justify-end"><v-avatar size="45" rounded="lg" icon="mdi-scale-unbalanced" variant="tonal" color="primary"></v-avatar></span>
        </div>
        <div>
          <v-chip size="x-small" variant="tonal">
            Arquivado
          </v-chip>
        </div>
      </template>
    </v-card>
  </div>
</template>

<style scoped>

:deep(.v-data-table-header__content) {
  font-weight: 800;
}

@media (max-width: 1700px) {
  .container-main {
    display: flex;
    flex-direction: column;
  }

  .card-saldo-total-archived {
    width: 100% !important;
  }
  
}

@media (max-width: 480px) {
  .saldo-total-archived {
    font-size: 1rem !important;
  }
}

</style>