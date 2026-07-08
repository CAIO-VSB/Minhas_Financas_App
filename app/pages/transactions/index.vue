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
    import ListToolBar from './components/ListToolBar.vue'
    import AppCard from '~/components/ui/AppCard.vue'

    const { getMoviments, patchMovementsById, getCurrentBalance, getMovimentsByFilter } = useHttpMovements()
    const { getCategoriesOnlyActive } = useHttpCategories()
    const { getAccountsOnlyActive } = useHttpAccounts()
    const { getTransferById } = useHttpTransfer()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()
    const { invalidate } = useInvalidate()

    
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

    function showDrawer(value: boolean) {
        drawer.value = value
    }

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
        const cats = lastFilter.value?.categorie_id?.map(id => {
            const found = categories.value?.find(c => c.id === id) 
            return found ? {id: found.id, name: found.name_identifier} : null
        })

        const accs = lastFilter.value?.accounts_id?.map(id => {
            const found = accounts.value?.find(a => a.id === id)
            return found ? {id: found.id, name: found.name_identifier} : null
        })

        return { cats, accs}
    })

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
            handleErrorApplication(error.statusCode)
        },

    })

    function handleMutationSuccess() {
        if (isFiltered.value && lastFilter.value) {
            handleApplyFilter(lastFilter.value)
        }
    }

    function handleClearFilter(value: string, filter?: TMovementsByFilter | null, idCategorie?: number, idAccount?: number) {
        switch (value) {
            case "period":
                lastFilter.value!.start_day = null
                lastFilter.value!.end_day = null
                isFiltered.value = false
                break;
            case "categories":
                if (!filter) return
                const categorieId = idCategorie
                const categoriesRemaining = filter.categorie_id?.filter(id => id !== categorieId) ?? null
                const payloadCategorie: TMovementsByFilter = {
                    ...filter,
                    categorie_id: categoriesRemaining?.length ? categoriesRemaining : null
                }
                handleApplyFilter(payloadCategorie)
                break;
            case "accounts":
                if (!filter) return
                const accountId = idAccount
                const accountsRemaining = filter.accounts_id?.filter(id => id !== accountId) ?? null
                const payloadAccounts: TMovementsByFilter = {
                    ...filter,
                    accounts_id: accountsRemaining?.length ? accountsRemaining : null
                }
                handleApplyFilter(payloadAccounts)
                break; 
            case "situation":
                if (!filter) return
                const payloadSituation: TMovementsByFilter = {
                    ...filter,
                    situation: null
                }
                handleApplyFilter(payloadSituation)
                break; 
            case "for_type":
                if (!filter) return
                const payloadFortype: TMovementsByFilter = {
                    ...filter,
                    for_type: null
                }
                handleApplyFilter(payloadFortype)
                break; 
            default:
                break;
        }
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
            notifyError("Error", "Transferência não encontrada")
            return
        }

        const Datatransfer = await getTransferById(transfer.transfer_id)

        //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
        const rawTransfer =  structuredClone(toRaw(Datatransfer))

        editDraftTransfer.value = parseTransferToEdit(rawTransfer)
        
        modalEditTransfer.value = true
    }


    function handleOptionClick(option: TOptionAction, data: TMovementsSummary) {        
        const optionsMap: Record<string, () => void> = {
            "arquivo": () => notifyInfo("Em desenvolvimento", "Estamos trabalhando nesta funcionalidade para disponibilizá-la em breve.", 6000, true),
            "edit_receita": () =>  handleOpenModalEditMovementsRevenue(data),
            "edit_despesa": () => handleOpenModalEditMovementsExpense(data),
            "edit_transferencia_entrada": () =>  handleOpenModalEditTransfer(data),
            "edit_transferencia_saida": () => handleOpenModalEditTransfer(data),
        }

        const key = option.value === "edit" ? `edit_${data.type_transaction}` : option.value
        const action = optionsMap[key as string]

        if (action) {
            action()
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
        } 
        if (option.value === "efetivar" && data.type_transaction === "despesa") {
            editDraft.value = payload
            labelOptions.value.colorButton = "red"
            labelOptions.value.textButton = "Pagar"
            labelOptions.value.title = "Deseja efetivar esta despesa?"
            labelOptions.value.text = "Ao efetivar essa despesa será descontado o valor na Conta."
            cardPostValueTransaction.value = true
            return
        }  
        if (option.value === "delete" && data.type_transaction === "receita") {
            editDraft.value = payload
            payload.is_deleted = true
            labelOptions.value.colorButton = "green"
            labelOptions.value.textButton = "Deletar"
            labelOptions.value.title = "Deseja deletar esta receita?"
            labelOptions.value.text = "Essa ação não poderá ser desfeita. O valor será removido da conta."
            cardDeletTransaction.value = true
            return
        }
        if (option.value === "delete" && data.type_transaction === "despesa") {
            editDraft.value = payload
            payload.is_deleted = true
            labelOptions.value.colorButton = "red"
            labelOptions.value.textButton = "Deletar"
            labelOptions.value.title = "Deseja deletar esta despesa?"
            labelOptions.value.text = "Essa ação não poderá ser desfeita. O valor será retornado ao saldo da conta."
            cardDeletTransaction.value = true
            return
        } 
        if (option.value === "delete" && (data.type_transaction === "transferencia_entrada" || data.type_transaction === "transferencia_saida")) {
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
            <ListToolBar @show-drawer="showDrawer" />
        </div>

        <div class="main-cards">
           <AppCard subtitle="Saldo atual" :loading="isPendingCurrentBalance" size="40" :value="balanceCurrent.saldo_atual" color="primary" icon="mdi-bank" text-tool-tip="O cálculo do saldo atual é independente do período selecionado, considerando o saldo inicial das contas ativas juntamente com todas as movimentações efetivadas de entrada e saída" icon-tool-tip="mdi-information-outline" size-icon-tool-tip="20px"></AppCard>

           <AppCard subtitle="Receitas" :loading="isPending" size="40" :value="summary.receitas" color="success" icon="mdi-arrow-down-thin-circle-outline" text-tool-tip="O valor apresentado corresponde à soma de todas as receitas efetivadas registradas nas contas ativas" icon-tool-tip="mdi-information-outline" size-icon-tool-tip="20px"></AppCard>

           <AppCard subtitle="Despesas" :loading="isPending" size="40" :value="summary.despesas" color="error" icon="mdi-arrow-up-thin-circle-outline" text-tool-tip="O valor apresentado corresponde à soma de todas as despesas efetivadas registradas nas contas ativas" icon-tool-tip="mdi-information-outline" size-icon-tool-tip="20px"></AppCard>

           <AppCard subtitle="Balanço mensal" :loading="isPending" size="40" :value="summary.balancoMensal" color="primary" icon="mdi-scale-balance" text-tool-tip="O balanço mensal é calculado com base na soma de todas as receitas efetivadas menos todas as despesas efetivadas do período selecionado" icon-tool-tip="mdi-information-outline" size-icon-tool-tip="20px"></AppCard>

        </div>
         
        <div class="w-100 pa-2 container-table">

            <v-card
            flat
            class="table elevation-2"
            :loading="isPending"
            >
            <template v-slot:text>
                
                <v-expand-transition>
                    <div v-show="isFiltered" class=" mb-2 ml-2  ">
                        <span v-if="isFiltered" class="font-weight-semibold" style="font-size: var(--text-base); font-weight: 600;">Filtros:</span>
                        <v-chip
                        v-if="lastFilter?.start_day && lastFilter.end_day"
                        class="ma-2"
                        @click:close="handleClearFilter('period')"
                        color="primary"
                        closable
                        >
                        {{ `De ${new Date(lastFilter?.start_day ?? new Date()).toLocaleDateString("pt-br", {timeZone: "UTC"})} à ${new Date(lastFilter?.end_day ?? new Date()).toLocaleDateString("pt-br", {timeZone: "UTC"})}`}}
                        </v-chip>

                        <v-chip
                        v-if="lastFilterLabels.cats"
                        value="categories"
                        class="ma-2"
                        closable
                        @click:close="handleClearFilter('categories', lastFilter, categorie?.id)"
                        :key="categorie?.name"
                        v-for="categorie in lastFilterLabels.cats"
                        >
                        {{ categorie?.name }}
                        </v-chip>

                        <v-chip
                        v-if="lastFilterLabels.accs"
                        class="ma-2"
                        closable
                        @click:close="handleClearFilter('accounts', lastFilter, account?.id)"
                        :key="account?.name"
                        v-for="account in lastFilterLabels.accs"
                        >
                        {{ account?.name }}
                        </v-chip>

                        <v-chip
                        v-if="lastFilter?.situation"
                        class="ma-2"
                        closable
                        @click:close="handleClearFilter('situation',  lastFilter)"
                        :color="(lastFilter?.situation === 'Pagas' || lastFilter?.situation === 'Recebidas') ? 'success' : 'error'"
                        >
                        {{ lastFilter?.situation }}
                        </v-chip>

                        <v-chip
                        class="ma-2"
                        closable
                        @click:close="handleClearFilter('for_type',  lastFilter)"
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
                items-per-page="8"
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
                                <v-icon class="rounded-xl hover-icon" v-bind="props" icon="mdi-dots-vertical" size="large"></v-icon>
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

.hover-icon:hover {
    background-color: rgba(128, 128, 128, 0.256);
}


:deep(.v-data-table-header__content) {
    font-weight: 900;
    font-size: 1rem;
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