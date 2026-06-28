<script setup lang="ts">
    definePageMeta({
        title: "Transações",
        layout: "layout-dashboard"
    })

    import { useHttpCategories } from '~/composables/useHttp/useHttpCategories'
    import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
    import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'
    import { useHttpTransfer } from '~/composables/useHttp/useHttpTransfer'
    import type { TMovementsSummary, TMovementsWithTransfer } from '~~/types/movements/TMovements'
    import type { TOptionAction } from '~~/types/option_action/TOptionAction'
    import type { TMovementsByFilter } from "~~/types/movements/TMovementsByFilter"
    import type { TPeriod } from "~~/types/period/TPeriod"
    import type { TTransfer } from '~~/types/transfer/TTransfer'
    import { useInvalidate } from "~/composables/useInvalidate"
    import FilterDrawer from './components/FilterDrawer.vue'
    import CardEditMovementsRevenue from '~/components/forms/CardEditMovementsRevenue.vue'
    import CardEdtiMovementsExpenses from '~/components/forms/CardEdtiMovementsExpenses.vue'
    import CardSettleTransactionModal from '~/components/forms/CardSettleTransactionModal.vue'
    import CardDeletTransaction from '~/components/forms/CardDeletTransaction.vue'
    import CardEditTransfer  from '~/components/forms/CardEditTransfer.vue'
    import DateInput from '~/components/ui/DateInput.vue'
    import CardDeleteMovementTransfer from '~/components/forms/CardDeleteMovementTransfer.vue'

    type option = {
        title: string,
        color: string,
        value: string,
        route: string
    }

    const { getMoviments, patchMovementsById, getCurrentBalance, getMovimentsByFilter } = useHttpMovements()
    const { getCategoriesOnlyActive } = useHttpCategories()
    const { getAccountsOnlyActive } = useHttpAccounts()
    const { getTransferById } = useHttpTransfer()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()
    const { invalidate } = useInvalidate()

    const route = useRoute()
    const search = ref('')
    const drawer = ref(false)
    const cardPostValueTransaction = ref(false)
    const modalEditMovementsRevenue = ref(false)
    const modalEditMovementesExpenses = ref(false)
    const modalEditTransfer = ref(false)
    const cardDeletTransaction = ref(false)
    const cardDeleteTransfer = ref(false)
    const isFiltered = ref(false)
    const lastFilter = ref<TMovementsByFilter | null>(null)
    const filteredData = ref<TMovementsSummary[] | null>(null)
    const labelOptions = ref({
        colorButton: "",
        textButton: "",
        title: "",
        text: ""
    })
    const editDraft = ref<TMovementsSummary | null>(null)
    const editDraftTransfer = ref<TTransfer | null>(null)
    const period = ref({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    })

    const { data:categories } = useQuery({
      queryKey: QUERY_KEYS.categories.active,
      queryFn: getCategoriesOnlyActive,
    })

    const { data:accounts } = useQuery({
      queryKey: QUERY_KEYS.accounts.active,
      queryFn: getAccountsOnlyActive,
    })

    const { data, isPending, refetch } = useQuery({
        queryKey: QUERY_KEYS.movements.all,
        queryFn: () => getMoviments(period.value.month, period.value.year)
    })

    const { data:currentBalance, isPending:isPendingCurrentBalance } = useQuery({
        queryKey: QUERY_KEYS.movements.current_balance,
        queryFn: getCurrentBalance
    })

    async function handleApplyFilter(filter: TMovementsByFilter) {

        lastFilter.value = filter
       const movements = await getMovimentsByFilter(
        filter.start_day as string,
        filter.end_day as string,
        filter.categorie_id ?? [],
        filter.accounts_id ?? [],
        filter.situation as string,
        filter.for_type ?? []
       )

       filteredData.value = movements
       isFiltered.value = true
    }

    const tableData = computed(() => {
        return isFiltered.value ? filteredData.value : data.value
    })

    const summary = computed(() => {
        const row = tableData.value?.[0]

        return {
            receitas: Number(row?.t_receitas ?? 0),
            despesas: Number(row?.t_despesas ?? 0),
            balancoMensal: Number(row?.balanco_mensal ?? 0),
            saldoAtual: Number(row?.saldo_atual ?? 0)
        }
    })

    const balanceCurrent = computed(() => {        
        const row = currentBalance.value?.[0]
       
        return {
            saldo_atual: Number(row?.saldo_atual ?? 0.00)
        }
        
    })

    const lastFilterLabels = computed(() => {
        const cats = lastFilter.value?.categorie_id?.map(id => categories.value?.find(c => c.id === id)?.name_identifier).filter(Boolean) ?? []
        const accs = lastFilter.value?.accounts_id?.map(id => accounts.value?.find(a => a.id === id)?.name_identifier).filter(Boolean) ?? []

        return { cats, accs}
    })


    
    const itemsRouter = [
        { title: 'Todas as transações', color: "#673AB7", value: "todas",          route: "/transactions" },
        { title: 'Despesas',            color: "#F44336", value: "despesas",       route: "/transactions/expense" },
        { title: 'Receitas',            color: "#4CAF50", value: "receitas",       route: "/transactions/revenue" },
        { title: 'Transferências',      color: "#2196F3", value: "transferencias", route: "/transactions/transfer" },
    ]
        
    const headers = [
        {
            align: 'center' as const,
            key: 'status_transaction',
            title: 'Situação',
        },
        { key: 'date_transaction', title: 'Data'  },
        { key: 'description_transaction', title: 'Descrição' },
        { key: 'categorie_name', title: 'Categoria' },
        { key: 'account_name', title: 'Conta' },
        { key: 'value_transaction', title: 'Valor' },
        { key: 'actions', title: 'Ações' },
    ]

    const currentItem = computed(() => {
       return itemsRouter.find(item => item.route === route.path)
    })

    const titleButtonOption = computed(() => {
        return currentItem.value?.title ?? "Todas"
    })

    function getTitleRouter(item: option) {
        navigateTo(item.route)
    }

    function getOptions(movements: TMovementsSummary): TOptionAction [] {

        const options = [
            movements.status_transaction === "pendente" ? {
                title: "Efetivar",
                icon: "mdi-check-all",
                value: "efetivar"
            } : null,
            { title: 'Editar', value: "edit", icon: "mdi-circle-edit-outline" },
            movements.type_transaction !== "transferencia_entrada" && movements.type_transaction !== "transferencia_saida" ? {title: "Anexar arquivo", value: "arquivo", icon: "mdi-paperclip"} : null,
            { title: 'Deletar', value: "delete", icon: "mdi-delete-forever" },
        ]

        return options.filter(Boolean) as TOptionAction[]

    } 

    const  { mutate } = useMutation({

        mutationFn: (payload: TMovementsSummary) => patchMovementsById(payload.id!, payload),

        onSuccess: () => {
            invalidate(QUERY_KEYS.movements.all)
            invalidate(QUERY_KEYS.movements.only_expenses)
            invalidate(QUERY_KEYS.movements.only_revenues)
            invalidate(QUERY_KEYS.movements.current_balance)
            invalidate(QUERY_KEYS.accounts.getBalanceForAccount)
        },

        onError: (error) => {
            notifyInfo("Atenção", `Erro ao editar transação. Tente novamente mais tarde ou contate o surpote técnico. Erro detalhado: ${error.message}`)
        },

    })

    
    function handleMutationSuccess() {
        if (isFiltered.value && lastFilter.value) {
            handleApplyFilter(lastFilter.value)
        }
    }

    function handleClearFilter() {
        filteredData.value = null
        isFiltered.value = false
    }

    function handleGetPeriod(value: TPeriod) {
        period.value = value
        refetch()
        isFiltered.value = false
    }

    function handleOpenModalEditMovementsRevenue(movements: TMovementsSummary) {

        //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
        const rawMovements =  structuredClone(toRaw(movements))

        editDraft.value = parseMovementToEdit(rawMovements)

        modalEditMovementsRevenue.value = true
    }

    function handleOpenModalEditMovementsExpense(movements: TMovementsSummary) {

        //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
        const rawMovements =  structuredClone(toRaw(movements))

        editDraft.value = parseMovementToEdit(rawMovements)

        modalEditMovementesExpenses.value = true
    }

    async function handleOpenModalEditTransfer(transfer: TMovementsWithTransfer) {

        if (!transfer.transfer_id) {
            notifyError("Erro", "Transferência não encontrada")
            return
        }

        const Datatransfer = await getTransferById(transfer.transfer_id)

        //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
        const rawTransfer =  structuredClone(toRaw(Datatransfer))

        editDraftTransfer.value = parseTransferToEdit(rawTransfer)
        
        modalEditTransfer.value = true
    }


    function handleOptionClick(option: TOptionAction, data: TMovementsSummary) {

        if (option.value === "edit" && data.type_transaction === "receita") {
            handleOpenModalEditMovementsRevenue(data)
            return 
        }

        if (option.value === "edit" && data.type_transaction === "despesa") {
            handleOpenModalEditMovementsExpense(data)
            return 
        }

       if (option.value === "edit" && (data.type_transaction === "transferencia_entrada" || data.type_transaction === "transferencia_saida")) {
            handleOpenModalEditTransfer(data)
            return
       }


        const raw = structuredClone(toRaw(data))

        const payload: TMovementsSummary = {
            ...raw,
            value_transaction: Number(raw.value_transaction ?? 0),
            date_transaction: new Date(raw.date_transaction ?? "")
        }

        if (option.value === "efetivar" && data.type_transaction === "receita") {
            editDraft.value = payload
            labelOptions.value.colorButton = "green"
            labelOptions.value.textButton = "Receber"
            labelOptions.value.title = "Deseja efetivar esta receita?"
            labelOptions.value.text = "Ao efetivar essa receita será adicionado o valor na Conta."
            cardPostValueTransaction.value = true
            return
        } else if (option.value === "efetivar" && data.type_transaction === "despesa") {
            editDraft.value = payload
            labelOptions.value.colorButton = "red"
            labelOptions.value.textButton = "Pagar"
            labelOptions.value.title = "Deseja efetivar esta despesa?"
            labelOptions.value.text = "Ao efetivar essa despesa será descontado o valor na Conta."
            cardPostValueTransaction.value = true
            return
        } else if (option.value === "delete" && data.type_transaction === "receita") {
            editDraft.value = payload
            payload.is_deleted = true
            labelOptions.value.colorButton = "green"
            labelOptions.value.textButton = "Deletar"
            labelOptions.value.title = "Deseja deletar esta receita?"
            labelOptions.value.text = "Essa ação não poderá ser desfeita. O valor será removido da conta."
            cardDeletTransaction.value = true
            return
        } else if (option.value === "delete" && data.type_transaction === "despesa") {
            editDraft.value = payload
            payload.is_deleted = true
            labelOptions.value.colorButton = "red"
            labelOptions.value.textButton = "Deletar"
            labelOptions.value.title = "Deseja deletar esta despesa?"
            labelOptions.value.text = "Essa ação não poderá ser desfeita. O valor será retornado ao saldo da conta."
            cardDeletTransaction.value = true
            return
        } else if (option.value === "delete" && (data.type_transaction === "transferencia_entrada" || data.type_transaction === "transferencia_saida")) {
            editDraft.value = payload
            payload.is_deleted = true
            labelOptions.value.colorButton = "blue"
            labelOptions.value.textButton = "Deletar"
            labelOptions.value.title = "Deletar transferência"
            labelOptions.value.text = "Essa ação não poderá ser desfeita."
            cardDeleteTransfer.value = true
            return
        }

        mutate(payload)
    }

</script>


<template>
    <div class="mt-6 container-main">

        <CardDeleteMovementTransfer @success="handleMutationSuccess" :title-botton="labelOptions.textButton" :title="labelOptions.title" :text="labelOptions.text" :color-botton="labelOptions.colorButton" :draft="editDraft" v-model="cardDeleteTransfer" />
        <CardDeletTransaction @success="handleMutationSuccess" :title-botton="labelOptions.textButton" :title="labelOptions.title" :text="labelOptions.text" :color-botton="labelOptions.colorButton" :draft="editDraft" v-model="cardDeletTransaction" />
        <CardSettleTransactionModal @success="handleMutationSuccess" v-model="cardPostValueTransaction" :draft="editDraft" :title-botton="labelOptions.textButton" :title="labelOptions.title" :text="labelOptions.text" :color-botton="labelOptions.colorButton" />
        <CardEdtiMovementsExpenses @success="handleMutationSuccess" :draft="editDraft"  v-model="modalEditMovementesExpenses"/>
        <CardEditMovementsRevenue @success="handleMutationSuccess" :draft="editDraft" v-model="modalEditMovementsRevenue"/>
        <CardEditTransfer :draft="editDraftTransfer" v-model="modalEditTransfer"/>
        
        
        <FilterDrawer :items="[ 'Recebidas', 'Pagas', 'Pendentes']" :field-type-active="false" color-button="primary" @apply-filter="handleApplyFilter" @reset-filter="handleClearFilter" v-model="drawer"/>
          
        <div class="text-center d-flex ga-4 ml-4 mb-5 btn-options">
            
            <v-menu
                transition="scale-transition"
                >
                <template v-slot:activator="{ props }">
                    <v-btn
                    color="primary"
                    v-bind="props"
                    class="text-none"
                    variant="tonal"
                    append-icon="mdi-arrow-down-drop-circle"
                    >
                    {{ titleButtonOption }}
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item
                    v-for="(item, i) in itemsRouter"
                    :key="i"
                    :value="i"
                    @click="getTitleRouter(item)"
                    >
                    <template v-slot:prepend>
                        <v-icon :color="item.color">mdi-circle-medium</v-icon>
                    </template>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <div class="w-100 d-flex justify-sm-end ga-3 pr-4 ">
                <v-btn
                color="primary"
                prepend-icon="mdi-filter-variant"
                class="text-none"
                variant="tonal"
                @click="drawer = true"
                >
                Filtro
                </v-btn>
            </div>

        </div>

        <div class="main-cards">
            <v-card subtitle="Saldo Atual">
                <v-skeleton-loader v-if="isPendingCurrentBalance" type="list-item-avatar"></v-skeleton-loader>
                <div v-else class="d-flex align-center ga-2 pl-2 mb-2">
                    <div class="pa-2 rounded-lg ">
                        <v-avatar 
                        color="primary"
                        variant="tonal" 
                        icon="mdi-bank-outline"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="text-h6 font-weight-semibold">{{ formatCurrency(balanceCurrent.saldo_atual) }}</span>
                </div>
                <template #append>
                    <v-tooltip text="O cálculo do saldo atual é independente do período selecionado, considerando o saldo inicial das contas ativas juntamente com todas as movimentações efetivadas de entrada e saída">
                        <template v-slot:activator="{ props }">
                            <v-icon class="icon-help" v-bind="props" size="20px" icon="mdi-information-outline"></v-icon>
                        </template>
                    </v-tooltip>
                </template>
            </v-card>
            <v-card :loading="isPending" subtitle="Receitas">
                 <v-skeleton-loader v-if="isPending" type="list-item-avatar"></v-skeleton-loader>
                 <div v-else class="d-flex align-center ga-2 pl-2 mb-2">
                    <div class="pa-2 rounded-lg ">
                        <v-avatar 
                        color="success"
                        variant="tonal" 
                        icon="mdi-arrow-down-thin-circle-outline"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="text-h6 font-weight-semibold">{{ formatCurrency(summary.receitas) }}</span>
                </div>
                <template #append>
                    <v-tooltip text="O cálculo do total de receitas considera todas as movimentações de entrada efetivadas vinculadas às contas ativas.">
                        <template v-slot:activator="{ props }">
                            <v-icon class="icon-help" v-bind="props" size="20px" icon="mdi-information-outline"></v-icon>
                        </template>
                    </v-tooltip>
                </template>
            </v-card>
            <v-card :loading="isPending" subtitle="Despesas">
                <v-skeleton-loader v-if="isPending" type="list-item-avatar"></v-skeleton-loader>
                 <div v-else class="d-flex align-center ga-2 pl-2 mb-2">
                     <div class="pa-2 rounded-lg ">
                        <v-avatar 
                        color="error"
                        variant="tonal" 
                        icon="mdi-arrow-up-thin-circle-outline"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="text-h6 font-weight-semibold"> {{ formatCurrency(summary.despesas) }}</span>
                </div>

                <template #append>
                    <v-tooltip text="O cálculo do total de despesas considera todas as movimentações de saída efetivadas vinculadas às contas ativas.">
                        <template v-slot:activator="{ props }">
                            <v-icon class="icon-help" v-bind="props" size="20px" icon="mdi-information-outline"></v-icon>
                        </template>
                    </v-tooltip>
                </template>
            </v-card>
            <v-card :loading="isPending" subtitle="Balanco Mensal">
                <v-skeleton-loader v-if="isPending" type="list-item-avatar"></v-skeleton-loader>
                 <div v-else class="d-flex align-center ga-2 pl-2 mb-2">
                    <div class="pa-2 rounded-lg ">
                        <v-avatar 
                        color="primary"
                        variant="tonal" 
                        icon="mdi-scale-balance"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="text-h6 font-weight-semibold">{{ formatCurrency(summary.balancoMensal) }}</span>
                </div>
                <template #append>
                    <v-tooltip text="O balanço mensal é calculado com base na soma de todas as receitas efetivadas menos todas as despesas efetivadas do período selecionado.">
                        <template v-slot:activator="{ props }">
                            <v-icon class="icon-help" v-bind="props" size="20px" icon="mdi-information-outline"></v-icon>
                        </template>
                    </v-tooltip>
                </template>
            </v-card>
        </div>
        
        <div class="w-100 pa-2 container-table">

            <v-card
            flat
            class="table"
            :loading="isPending"
            >
            <template v-slot:text>
                
                <v-expand-transition>
                    <div v-show="isFiltered" class="text-center mb-2">
                    
                        <span class="text-h7 font-weight-semibold">Filtros:</span>
                        <v-chip
                        v-if="lastFilter?.start_day && lastFilter.end_day"
                        class="ma-2"
                        @click:close="handleClearFilter"
                        color="primary"
                        closable
                        >
                        {{ `De ${new Date(lastFilter?.start_day ?? new Date()).toLocaleDateString("pt-br", {timeZone: "UTC"})} à ${new Date(lastFilter?.end_day ?? new Date()).toLocaleDateString("pt-br", {timeZone: "UTC"})}`}}
                        </v-chip>

                        <v-chip
                        v-if="lastFilterLabels.cats"
                        class="ma-2"
                        closable
                        @click:close="handleClearFilter"
                        :key="name"
                        v-for="name in lastFilterLabels.cats"
                        >
                        {{ name }}
                        </v-chip>

                        <v-chip
                        v-if="lastFilterLabels.accs"
                        class="ma-2"
                        closable
                        @click:close="handleClearFilter"
                        :key="name"
                        v-for="name in lastFilterLabels.accs"
                        >
                        {{ name }}
                        </v-chip>

                        <v-chip
                        v-if="lastFilter?.situation"
                        class="ma-2"
                        closable
                        @click:close="handleClearFilter"
                        :color="(lastFilter?.situation === 'Pagas' || lastFilter?.situation === 'Recebidas') ? 'success' : 'error'"
                        >
                        {{ lastFilter?.situation }}
                        </v-chip>

                        <v-chip
                        class="ma-2"
                        closable
                        @click:close="handleClearFilter"
                        color="primary"
                        v-for="type in lastFilter?.for_type"
                        >
                        {{ type }}
                        </v-chip>
                    
                    </div>
                </v-expand-transition>

                <div v-if="!isFiltered" style="margin-bottom: 12px;">
                    <DateInput  @apply-filter-month="handleGetPeriod"></DateInput>
                </div>

                <v-text-field
                    v-model="search"
                    label="Pesquisar"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    hide-details
                    single-line
                    autocomplete="off"
                ></v-text-field>
            </template>
                <v-data-table
                :headers="headers"
                :items="tableData!"
                :search="search"
                :loading="isPending"
                mobile-breakpoint="md"
                items-per-page="6"
                >

                <template v-slot:item.status_transaction="{ item }">
                    <v-icon 
                    :color="item.status_transaction === 'recebido' || item.status_transaction === 'entrada' || item.status_transaction === 'saida' || item.status_transaction === 'pago' ? 'green' : 'red'"
                    :icon="item.status_transaction === 'recebido' || item.status_transaction === 'saida' || item.status_transaction === 'entrada' || item.status_transaction === 'pago' ? 'mdi-check-circle' : 'mdi-alert-circle'"
                    >
                    </v-icon>
                    <v-tooltip
                        activator="parent"
                        location="top"
                    >{{ item.status_transaction === 'recebido' || item.status_transaction === 'entrada' ||  item.status_transaction === 'pago' ? 'Efetivada' : 'Pendente' }}</v-tooltip>
                </template>

                <template v-slot:item.value_transaction="{item}">
                    <v-chip :color="item.type_transaction ===  'receita' || item.type_transaction === 'transferencia_entrada' ? 'green' : 'red'">
                        {{ formatCurrency(item.value_transaction) }}
                    </v-chip>
                </template>

                <template v-slot:item.date_transaction="{item}"> 
                    {{ formatDate(item.date_transaction) }}
                </template>

                <template v-slot:item.actions="{ item }">
                        <v-menu
                            transition="slide-y-transition"
                            >
                            <template v-slot:activator="{ props }">
                                <v-icon class="hover:scale-150 hover:bg-gray-200 rounded-xl"  v-bind="props" icon="mdi-dots-vertical" size="large"></v-icon>
                            </template>
                            <v-list>
                                <v-list-item
                                v-for="action in getOptions(item)"
                                :key="action.title"
                                :value="action.value"
                                :prepend-icon="action.icon"
                                @click="handleOptionClick(action, item)"
                                >
                                <v-list-item-title>{{ action.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                </template>
                </v-data-table>
            </v-card>
        </div>
    </div>


</template>

<style scoped>

.container-main {
    margin-top: 30px;
}

.main-cards {
    margin: 10px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.icon-help:hover {
    transform: scale(1.3);
    cursor: pointer;
}


:deep(.v-card-text) {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: white;
}

:deep(.v-data-table-footer) {
    position: sticky;
    bottom: 0;
    background-color: white;
}

:deep(.v-data-table-header__content) {
    font-weight: 800;
}

@media (max-width: 1400px) {
    .main-cards {
        display: grid;
        grid-template-columns: 1fr;
        padding: 0 6px 0 6px;
    }

    .container-table {
        width: 100%;
        padding: 10px;
        flex: 1;
        min-height: 0;
    }

    .container-main {
        margin-top: 30px;
    }

    .table {
        height: fit-content;
    }

}

@media (max-width: 680px) {

    .btn-options {
        padding-left: 2px;
    }

    .container-main {
        margin-top: 30px;
    }

    .container-table {
        width: 100%;
        padding: 10px;
    }

    .table {
        height: fit-content;
        padding: 10px;
    }

}

</style>