<script setup lang="ts">

    definePageMeta({
        title: "Transações",
        layout: "layout-dashboard"
    })

    import CardAddMovimentsRevenue from '~/components/forms/CardAddMovimentsRevenue.vue'
    import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'
    import DateInput from "~~/app/components/ui/DateInput.vue"
    import type { TMovements, TMovementsSummary } from '~~/types/movements/TMovements'
    import type { TOptionAction } from '~~/types/option_action/TOptionAction'
    import type { TMovementsOnlyRenevue } from '~~/types/movements/TMovementsOnlyRevenue'
    import type { TMovementsByFilter } from "~~/types/movements/TMovementsByFilter"
    import type { TPeriod } from '~~/types/period/TPeriod'
    import CardSettleTransactionModal from '~/components/forms/CardSettleTransactionModal.vue'
    import CardEditMovementsRevenue from '~/components/forms/CardEditMovementsRevenue.vue'
    import CardDeletTransaction from '~/components/forms/CardDeletTransaction.vue'
    import FilterDrawer from './components/FilterDrawer.vue'
    import type { TMovementsPayload } from '~~/schemas/movements.schema.js'

    type option = {
        title: string,
        color: string,
        value: string,
        route: string
    }

    const { patchMovementsById,  getMovimentsOnlyRevenuesByFilter } = useHttpMovements()
    const {  notifyInfo, notifySuccess, notifyError } = useNotify()
    const { invalidate } = useInvalidate()
    const { getOnlyRevenues } = useHttpMovements()

    const editDraft = ref<TMovements | null>(null)
    const confirmDraft = ref<TMovementsPayload | null>(null)

    const route = useRoute()

    const modalAddRevenue = ref(false)

    const modalEditMovementsRevenue = ref(false)

    const cardPostValueTransaction = ref(false)

    const cardDeletTransaction = ref(false)

    const isFiltered = ref(false)

    const filteredData = ref<TMovementsOnlyRenevue[] | null>(null)

    const lastFilter = ref<TMovementsByFilter | null>(null)

    const drawer = ref(false)

    const search = ref('')

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
        queryKey: QUERY_KEYS.movements.only_revenues,
        queryFn: () => getOnlyRevenues(period.value.month, period.value.year),
    })

    function handleGetPeriod(value: TPeriod) {
        period.value = value
        refetch()
        isFiltered.value = false
    }

    async function handleApplyFilter(filter: TMovementsByFilter) {

       lastFilter.value = filter
       const movements = await getMovimentsOnlyRevenuesByFilter(
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

    const sumary = computed(() => {

        const row = tableData.value?.[0]

        return {
            receitas_pendentes: Number(row?.t_receitas_pendentes ?? 0.00),
            receitas_efetivadas: Number(row?.t_receitas_efetivadas ?? 0.00),
            total_geral: Number(row?.total_geral_receitas ?? 0.00),
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
        return currentItem.value?.title 
    })

    const ColorButtonOption = computed(() => {
        return currentItem.value?.color
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

        mutationFn: (payload: TMovementsPayload) => patchMovementsById(payload.id!, payload),

        onSuccess: () => {
            invalidate(QUERY_KEYS.movements.all)
            invalidate(QUERY_KEYS.movements.only_expenses)
            invalidate(QUERY_KEYS.movements.only_revenues)
            invalidate(QUERY_KEYS.movements.current_balance)
            invalidate(QUERY_KEYS.accounts.getBalanceForAccount)
            notifySuccess("Sucesso", "Transação editada com sucesso", 6000)
        },

        onError: (error) => {
            handleErrorApplication(error.statusCode)
        },

    })

    function handleOpenModalEditMovementsRevenue(movements: TMovementsSummary) {

        //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
        const rawMovements =  structuredClone(toRaw(movements))

        editDraft.value = parseMovementToEdit(rawMovements)

        modalEditMovementsRevenue.value = true
    }

    function handleOptionClick(option: TOptionAction, data: TMovementsSummary) {

        if (option.value === "edit" && data.type_transaction === "receita") {
            handleOpenModalEditMovementsRevenue(data)
            return 
        }

        if (option.value === "arquivo") {
            notifyInfo("Em desenvolvimento", "Estamos trabalhando nesta funcionalidade para disponibilizá-la em breve.", 6000, true)
            return
        }

        const raw = structuredClone(toRaw(data))
        if (!raw.date_transaction) {
            notifyError(
                "Data inválida",
                "Não foi possível concluir a ação porque a data informada é inválida ou está ausente.",
            )
            return
        }
        const dateFormated = dateToDateOnly(raw.date_transaction)

        const payload: TMovementsPayload = {
            ...raw,
            value_transaction: Number(raw.value_transaction ?? 0),
            date_transaction: dateFormated,
        }

        if (option.value === "efetivar" && data.type_transaction === "receita") {
            confirmDraft.value = payload
            labelOptions.value.colorButton = "green"
            labelOptions.value.textButton = "Receber"
            labelOptions.value.title = "Deseja efetivar esta receita?"
            labelOptions.value.text = "Ao efetivar essa receita será adicionado o valor na Conta."
            cardPostValueTransaction.value = true
            return
        } else if (option.value === "delete" && data.type_transaction === "receita") {
            payload.is_deleted = true
            confirmDraft.value = payload
            labelOptions.value.colorButton = "green"
            labelOptions.value.textButton = "Deletar"
            labelOptions.value.title = "Deseja deletar esta receita?"
            labelOptions.value.text = "Essa ação não poderá ser desfeita. O valor será removido da conta."
            cardDeletTransaction.value = true
            return
        }

        mutate(payload)
    }


</script>


<template>
    <div class="mt-7 container-main">

        <CardAddMovimentsRevenue v-model="modalAddRevenue" />
        <CardDeletTransaction @success="handleMutationSuccess" :title-botton="labelOptions.textButton" :title="labelOptions.title" :text="labelOptions.text" :color-botton="labelOptions.colorButton" :draft="confirmDraft" v-model="cardDeletTransaction" />
        <CardEditMovementsRevenue @success="handleMutationSuccess" :draft="editDraft" v-model="modalEditMovementsRevenue"/>
        <CardSettleTransactionModal @success="handleMutationSuccess" v-model="cardPostValueTransaction" :draft="confirmDraft" :title-botton="labelOptions.textButton" :title="labelOptions.title" :text="labelOptions.text" :color-botton="labelOptions.colorButton" />

        <FilterDrawer :items="[ 'Recebidas', 'Pendentes']" :field-type-active="true" color-button="green" @apply-filter="handleApplyFilter" @reset-filter="handleClearFilter" v-model="drawer"/>

        <div class="text-center text-center d-flex ga-4 ml-4 mb-5 btn-container">
            
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
                color="success"
                prepend-icon="mdi-plus"
                class="text-none btn-add-receita elevation-1"
                variant="flat"
                @click="modalAddRevenue = true"
                >
                NOVA RECEITA
                </v-btn>

                <v-btn
                color="green"
                prepend-icon="mdi-filter"
                class="text-none btn-filter elevation-1"
                variant="outlined"
                @click="drawer = true"
                >
                Filtro
                </v-btn>

            </div>

        </div>

         <div class="main-cards">
            <v-card :loading="isPending">
                <div class="d-flex align-center ga-2 pl-2 mb-2">
                    <div class="pa-2 rounded-lg">
                        <v-avatar 
                        color="green" 
                        icon="mdi-arrow-down-thin-circle-outline"
                        variant="tonal"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="font-weight-semibold card-value">{{ formatCurrency(sumary.receitas_pendentes) }}</span>
                </div>
                <template #subtitle> <span class="card-label">Receitas pendentes</span> </template>

            </v-card>
            <v-card :loading="isPending" subtitle="Receitas recebidas">
                 <div class="d-flex align-center ga-2 pl-2 mb-2">
                    <div class="pa-2 rounded-lg">
                        <v-avatar 
                        color="green" 
                        icon="mdi-arrow-up-thin-circle-outline"
                        variant="tonal"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="font-weight-semibold card-value">{{ formatCurrency(sumary.receitas_efetivadas) }}</span>
                </div>
                <template #subtitle> <span class="card-label">Receitas recebidas</span> </template>

            </v-card>
            <v-card :loading="isPending" subtitle="Total">
                 <div class="d-flex align-center ga-2 pl-2 mb-2">
                    <div class="pa-2 rounded-lg">
                        <v-avatar 
                        color='primary' 
                        icon="mdi-scale-balance"
                        variant="tonal"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="font-weight-semibold card-value"> {{ formatCurrency(sumary.total_geral) }}</span>
                </div>
                <template #subtitle> <span class="card-label">Total</span> </template>
            </v-card>
        </div>
        
        <div class=" w-100 pa-2 container-table">

            <v-card
                flat
                class="table  elevation-2"
                :loading="isPending"
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
                :loading="isPending"
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
                    <v-chip color="green">
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
                                <v-icon class="hover-icon rounded-xl"   v-bind="props" icon="mdi-dots-vertical" size="large"></v-icon>
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

    .btn-add-receita {
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

    .container-table {
        width: 100%;
        padding: 10px;
    }

    .container-main {
        margin-top: 30px;
    }

    .table {
        height: fit-content;
        padding: 10px;
    }

  
}

</style>