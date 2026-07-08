<script setup lang="ts">

    definePageMeta({
        title: "Transações",
        layout: "layout-dashboard"
    })

    import FilterDrawer from './components/FilterDrawer.vue'
    import CardAddMovimentsExpenses from '~/components/forms/CardAddMovimentsExpenses.vue'
    import CardEdtiMovementsExpenses from '~/components/forms/CardEdtiMovementsExpenses.vue'
    import CardSettleTransactionModal from '~/components/forms/CardSettleTransactionModal.vue'
    import CardDeletTransaction from '~/components/forms/CardDeletTransaction.vue'
    import DateInput from "~~/app/components/ui/DateInput.vue"
    import { useInvalidate } from "~/composables/useInvalidate"
    import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'
    import type { TMovements, TMovementsSummary } from '~~/types/movements/TMovements'
    import type { TMovementsOnlyExpenses } from '~~/types/movements/TMovementsOnlyExpenses'
    import type { TMovementsByFilter } from "~~/types/movements/TMovementsByFilter"
    import type { TOptionAction } from '~~/types/option_action/TOptionAction'
    import type { TPeriod } from '~~/types/period/TPeriod'

    type option = {
        title: string,
        color: string,
        value: string,
        route: string
    }

    const editDraft = ref<TMovements | null>(null)

    const { getOnlyExpenses, getMovimentsOnlyExpensesByFilter, patchMovementsById } = useHttpMovements()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()
    const { invalidate } = useInvalidate()

    const route = useRoute()

    const search = ref('')

    const drawer = ref(false)

    const modalAddExpenses = ref(false)

    const cardPostValueTransaction = ref(false)

    const modalEditMovementesExpenses = ref(false)

    const cardDeletTransaction = ref(false)

    const isFiltered = ref(false)

    const filteredData = ref<TMovementsOnlyExpenses[] | null>(null)

    const lastFilter = ref<TMovementsByFilter | null>(null)

    const labelOptions = ref({
        colorButton: "",
        textButton: "",
        title: "",
        text: ""
    })

    const period = ref({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    })
  
    const { data, isPending, refetch } = useQuery({
        queryKey: QUERY_KEYS.movements.only_expenses,
        queryFn: () =>  getOnlyExpenses(period.value.month, period.value.year),
    })

    function handleGetPeriod(value: TPeriod) {
        period.value = value
        refetch()
        isFiltered.value = false
    }

    const tableData = computed(() => {
        return isFiltered.value ? filteredData.value : data.value
    })

    const sumary = computed(() => {

        const row = tableData.value?.[0]

        return {
            despesas_pendentes: Number(row?.t_despesas_pendentes ?? 0.00),
            despesas_efetivadas: Number(row?.t_despesas_efetivadas ?? 0.00),
            total_geral: Number(row?.total_geral_despesas ?? 0.00),
        }
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
            sortable: true,
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

    const ColorButtonOption = computed(() => {
        return currentItem.value?.color
    })

    function getTitleRouter(item: option) {
        navigateTo(item.route)
    }

    function getOptions(moviments: TMovementsSummary): TOptionAction [] {

        const options = [
            moviments.status_transaction === "pendente" ? {
                title: "Efetivar",
                icon: "mdi-check-all",
                value: "efetivar"
            } : null,
            { title: 'Editar', value: "edit", icon: "mdi-circle-edit-outline" },
            { title: 'Anexar arquivo',  value: "arquivo", icon: "mdi-paperclip" },
            { title: 'Deletar', value: "delete", icon: "mdi-delete-forever" },
        ]

        return options.filter(Boolean) as TOptionAction[]

    } 

    const  { mutate } = useMutation({

        mutationFn: (payload: TMovements) => patchMovementsById(payload.id!, payload),

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

    async function handleApplyFilter(filter: TMovementsByFilter) {

        lastFilter.value = filter
       const movements = await getMovimentsOnlyExpensesByFilter(
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

    function handleMutationSuccess() {
        if (isFiltered.value && lastFilter.value) {
            handleApplyFilter(lastFilter.value)
        }
    }

    function handleClearFilter() {
        filteredData.value = null
        isFiltered.value = false
    }

    function handleOpenModalEditMovementsExpense(movements: TMovementsSummary) {

        //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
        const rawMovements =  structuredClone(toRaw(movements))

        editDraft.value = parseMovementToEdit(rawMovements)

        modalEditMovementesExpenses.value = true
    }


    function handleOptionClick(option: TOptionAction, data: TMovementsSummary) {

        if (option.value === "edit" && data.type_transaction === "despesa") {
            handleOpenModalEditMovementsExpense(data)
            return 
        }

        if (option.value === "arquivo") {
            notifyInfo("Em desenvolvimento", "Estamos trabalhando nesta funcionalidade para disponibilizá-la em breve.", 6000, true)
            return
        }


        const raw = structuredClone(toRaw(data))

        const payload: TMovements = {
            ...raw,
            value_transaction: Number(raw.value_transaction ?? 0),
            date_transaction: new Date(raw.date_transaction ?? ""),
        }

        if (option.value === "efetivar" && data.type_transaction === "despesa") {
            editDraft.value = payload
            labelOptions.value.colorButton = "red"
            labelOptions.value.textButton = "Pagar"
            labelOptions.value.title = "Deseja efetivar esta despesa?"
            labelOptions.value.text = "Ao efetivar essa despesa será descontado o valor na Conta."
            cardPostValueTransaction.value = true
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
        }

        mutate(payload)
    }

 
</script>


<template>
    <div class="mt-7 container-main">

        <CardAddMovimentsExpenses v-model="modalAddExpenses" />
        <CardDeletTransaction @success="handleMutationSuccess" :title-botton="labelOptions.textButton" :title="labelOptions.title" :text="labelOptions.text" :color-botton="labelOptions.colorButton" :draft="editDraft" v-model="cardDeletTransaction" />
        <CardSettleTransactionModal @success="handleMutationSuccess" v-model="cardPostValueTransaction" :draft="editDraft" :title-botton="labelOptions.textButton" :title="labelOptions.title" :text="labelOptions.text" :color-botton="labelOptions.colorButton" />
        <CardEdtiMovementsExpenses @success="handleMutationSuccess" :draft="editDraft"  v-model="modalEditMovementesExpenses"/>

        <FilterDrawer :items="['Pendentes', 'Pagas']" :field-type-active="true"  color-button="red" @apply-filter="handleApplyFilter" @reset-filter="handleClearFilter" v-model="drawer"/>
        
        <div class="text-center d-flex ga-4 ml-4 mb-5 btn-container">
            
            <v-menu
                transition="scale-transition"
                >
                <template v-slot:activator="{ props }">
                    <v-btn
                    :color="ColorButtonOption"
                    v-bind="props"
                    class="text-none elevation-1"
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

            <div class="w-100 d-flex justify-sm-end ga-3 pr-4 btn-options">
                <v-btn
                :color="ColorButtonOption"
                prepend-icon="mdi-plus"
                class="text-none btn-add-despesa elevation-1"
                variant="tonal"
                @click="modalAddExpenses = true"
                >
                NOVA DESPESA
                </v-btn>
                <v-btn
                color="red"
                prepend-icon="mdi-filter"
                class="text-none btn-filter elevation-1"
                variant="tonal"
                @click="drawer = true"
                >
                Filtro
                </v-btn>
            </div>

        </div>

        <div class="main-cards">
            <v-card >
                <v-skeleton-loader v-if="isPending" type="list-item-avatar"></v-skeleton-loader>
                <div v-else class="d-flex align-center ga-2 pl-2 mb-2">
                    <div class="pa-2 rounded-lg">
                        <v-avatar 
                        color="red" 
                        icon="mdi-arrow-down-thin-circle-outline"
                        variant="tonal"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="font-weight-semibold card-value " >{{ formatCurrency(sumary.despesas_pendentes ?? 0.00) }}</span>
                </div>
                <template #subtitle> <span class="card-label">Despesas pendentes</span> </template>

            </v-card>
            <v-card :loading="isPending">
                 <v-skeleton-loader v-if="isPending" type="list-item-avatar"></v-skeleton-loader>
                 <div v-else class="d-flex align-center ga-2 pl-2 mb-2">
                    <div class="pa-2 rounded-lg">
                        <v-avatar 
                        color="red" 
                        icon="mdi-arrow-up-thin-circle-outline"
                        variant="tonal"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="font-weight-semibold card-value ">{{ formatCurrency(sumary.despesas_efetivadas ?? 0.00) }}</span>
                </div>
                <template #subtitle> <span class="card-label">Despesas pagas</span> </template>

            </v-card>
            <v-card :loading="isPending">
                <v-skeleton-loader v-if="isPending" type="list-item-avatar"></v-skeleton-loader>
                 <div v-else class="d-flex align-center ga-2 pl-2 mb-2">
                    <div class="pa-2 rounded-lg">
                        <v-avatar 
                        color='primary' 
                        icon="mdi-scale-balance"
                        variant="tonal"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="font-weight-semibold card-value "> {{ formatCurrency(sumary.total_geral) }}</span>
                </div>
                <template #subtitle> <span class="card-label">Total</span> </template>
            </v-card>
        </div>
        
        <div class="w-100 pa-2 container-table">

            <template v-if="isPending">
                <v-skeleton-loader 
                    v-for="n in 12" 
                    :key="n" 
                    type="list-item-avatar"
                    class="mb-2"
                />
            </template>
            
            <v-card
                flat
                class="table elevation-2"
                :loading="isPending"
                v-else
            >
            <template v-slot:text>

            <div style="margin-bottom: 10px;">
                <DateInput @apply-filter-month="handleGetPeriod" ></DateInput>
            </div>

            <v-text-field
                v-model="search"
                label="Pesquisar"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
            ></v-text-field>
            </template>
                <v-data-table
                :headers="headers"
                :items="tableData!"
                :search="search"
                mobile-breakpoint="md"
                items-per-page="6"
                >

                <template v-slot:item.status_transaction="{ item }">
                    <v-icon 
                    :color="item.status_transaction === 'recebido' || item.status_transaction === 'pago' ? 'green' : 'red'"
                    :icon="item.status_transaction === 'recebido' || item.status_transaction === 'pago' ? 'mdi-check-circle' : 'mdi-alert-circle'"
                    >
                    </v-icon>
                    <v-tooltip
                        activator="parent"
                        location="top"
                    >{{ item.status_transaction === 'recebido' || item.status_transaction === 'pago' ? 'Efetivada' : 'Pendente' }}</v-tooltip>
                </template>

                <template v-slot:item.value_transaction="{item}">
                    <v-chip color="red">
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
                                <v-icon class=" hover-icon rounded-xl"  v-bind="props" icon="mdi-dots-vertical" size="large"></v-icon>
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

.main-cards {
    margin: 10px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.more-option {
    width: 100%;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding-right: 20px;
}

.container-table {
    width: 100%;
    padding: 10px;
}

.icon-help:hover {
    transform: scale(1.3);
    cursor: pointer;
}

.card-label {
    font-size: var(--text-base);
}

.card-value {
    font-size: var(--text-md);
    font-weight: 500;
}

.hover-icon:hover {
    background-color: rgba(128, 128, 128, 0.256);
}


:deep(.v-data-table-header__content) {
    font-weight: 800;
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

@media (max-width: 1200px) {

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

    .btn-filter {
        width: 50%;
    }

    .btn-add-despesa {
        width: 50%;
        font-size: clamp(0.75rem, 2.5vw, 0.75rem);
    }

}

@media (max-width: 680px) {

    .btn-container {
        margin: 20px;        
        flex-direction: column;
    }


    .btn-filter {
        width: 50%;
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