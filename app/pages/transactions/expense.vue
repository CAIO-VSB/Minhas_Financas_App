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
    import { useInvalidate } from "~/composables/useInvalidate"
    import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'
    import type { TMovements } from '~~/types/movements/TMovements'
    import type { TMovementsOnlyExpenses } from '~~/types/movements/TMovementsOnlyExpenses'
    import type { TMovementsByFilter } from "~~/types/movements/TMovementsByFilter"
    import type { TOptionAction } from '~~/types/option_action/TOptionAction'
    import { VueDatePicker } from '@vuepic/vue-datepicker'
    import { ptBR } from 'date-fns/locale'

    type TMovementsFormatted = Omit<TMovements, 'value_transaction' | 'date_transaction'> & {
        value_transaction: string,
        date_transaction: string
    }
    
    type option = {
        title: string,
        color: string,
        value: string,
        route: string
    }

    const editDraft = ref<TMovements | null>(null)

    const { getOnlyExpenses, getMovimentsOnlyExpensesByFilter, patchMovements } = useHttpMovements()
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

    async function handleMovementesForPeriod() {
        await nextTick()
        refetch()
        isFiltered.value = false
    }


    const tableData = computed(() => {
        return isFiltered.value ? filteredData.value : data.value
    })

    const transitionsFformatted = computed(() => {
        return tableData.value?.map(item => ({
            ...item,
            date_transaction: new Date(item.date_transaction ?? "").toLocaleDateString("pt-BR"),
            value_transaction: new Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(item.value_transaction ?? 0.00)
        }))
        
    })

    const sumary = computed(() => {

        const row = transitionsFformatted.value?.[0]

        const formated = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

        return {
            despesas_pendentes: formated.format(row?.t_despesas_pendentes ?? 0.00),
            despesas_efetivadas: formated.format(row?.t_despesas_efetivadas ?? 0.00),
            total_geral: formated.format(row?.total_geral_despesas ?? 0.00),
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

    function getOptions(moviments: TMovementsFormatted): TOptionAction [] {

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

        mutationFn: (payload: TMovements) => patchMovements(payload),

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

    function handleOpenModalEditMovementsExpense(movements: TMovementsFormatted) {

        //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
        const rawMovements =  structuredClone(toRaw(movements))

        editDraft.value = {
            ...rawMovements,
            value_transaction: Number(rawMovements.value_transaction.replace(/[^\d,]/g, '').replace(',', '.')),
            date_transaction: new Date(rawMovements.date_transaction.split('/').reverse().join('-') + 'T00:00:00'),
        }

        modalEditMovementesExpenses.value = true
    }


    function handleOptionClick(option: TOptionAction, data: TMovementsFormatted) {

        if (option.value === "edit" && data.type_transaction === "Despesa") {
            handleOpenModalEditMovementsExpense(data)
            return 
        }

        const raw = structuredClone(toRaw(data))

        const payload: TMovements = {
            ...raw,
            value_transaction: Number(raw.value_transaction.replace(/[^\d,]/g, '').replace(',', '.')),
            date_transaction: new Date(raw.date_transaction.split('/').reverse().join('-') + 'T00:00:00'),
        }

        if (option.value === "efetivar" && data.type_transaction === "Despesa") {
            editDraft.value = payload
            labelOptions.value.colorButton = "red"
            labelOptions.value.textButton = "Pagar"
            labelOptions.value.title = "Deseja efetivar esta despesa?"
            labelOptions.value.text = "Ao efetivar essa despesa será descontado o valor na Conta."
            cardPostValueTransaction.value = true
            return
        } else if (option.value === "delete" && data.type_transaction === "Despesa") {
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
    <div class="container-main">

        <cardAddMovimentsExpenses v-model="modalAddExpenses" />
        <CardDeletTransaction @success="handleMutationSuccess" :title-botton="labelOptions.textButton" :title="labelOptions.title" :text="labelOptions.text" :color-botton="labelOptions.colorButton" :draft="editDraft" v-model="cardDeletTransaction" />
        <CardSettleTransactionModal @success="handleMutationSuccess" v-model="cardPostValueTransaction" :draft="editDraft" :title-botton="labelOptions.textButton" :title="labelOptions.title" :text="labelOptions.text" :color-botton="labelOptions.colorButton" />
        <CardEdtiMovementsExpenses @success="handleMutationSuccess" :draft="editDraft"  v-model="modalEditMovementesExpenses"/>

        <filterDrawer :items="['Pendentes', 'Pagas']" :field-type-active="true"  color-button="red" @apply-filter="handleApplyFilter" @reset-filter="handleClearFilter" v-model="drawer"/>
        
        <div class="text-center bnt-options">
            
            <v-menu
                transition="scale-transition"
                >
                <template v-slot:activator="{ props }">
                    <v-btn
                    :color="ColorButtonOption"
                    v-bind="props"
                    class="text-none rounded-xl"
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

            <div class="more-option">
                <v-btn
                :color="ColorButtonOption"
                prepend-icon="mdi-plus"
                class="text-none rounded-xl"
                @click="modalAddExpenses = true"
                >
                NOVA DESPESA
                </v-btn>
                <v-btn
                color="red"
                prepend-icon="mdi-filter"
                class="text-none rounded-xl"
                @click="drawer = true"
                >
                Filtro
                </v-btn>
            </div>

        </div>

        <div class="main-cards">
            <v-card subtitle="Despesas pendentes">
                <v-skeleton-loader v-if="isPending" type="list-item-avatar"></v-skeleton-loader>
                <div v-else  class="main-value-formated">
                    <v-icon color="red" icon="mdi-arrow-down-bold-circle"></v-icon>
                    <span>{{ sumary?.despesas_pendentes }}</span>
                </div>

            </v-card>
            <v-card :loading="isPending" subtitle="Despesas pagas">
                 <v-skeleton-loader v-if="isPending" type="list-item-avatar"></v-skeleton-loader>
                 <div v-else class="main-value-formated">
                    <v-icon color="red" icon="mdi-arrow-up-bold-circle"></v-icon>
                    <span>{{ sumary?.despesas_efetivadas }}</span>
                </div>

            </v-card>
            <v-card :loading="isPending" subtitle="Total">
                <v-skeleton-loader v-if="isPending" type="list-item-avatar"></v-skeleton-loader>
                 <div v-else  class="main-value-formated">
                    <v-icon color='black' icon="mdi-scale-balance"></v-icon>
                    <span> {{ sumary?.total_geral }}</span>
                </div>
            </v-card>
        </div>
        
        <div class="container-table">

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
                class="table"
                :loading="isPending"
                v-else
            >
            <template v-slot:text>

            <div style="margin-bottom: 10px;">
                <VueDatePicker @update:model-value="handleMovementesForPeriod" :teleport="true" :locale="ptBR" v-model="period" month-picker :formats="{ month: 'LLLL' }" />
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
                :items="transitionsFformatted"
                :search="search"
                mobile-breakpoint="md"
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
                    {{ item.value_transaction }}
                    </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                        <v-menu
                            transition="slide-y-transition"
                            >
                             <template v-slot:activator="{ props }">
                                <v-icon class="hover:scale-120 border-1 rounded-full"  v-bind="props" icon="mdi-dots-vertical" size="large"></v-icon>
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

.bnt-options {
    display: flex;
    margin-bottom: 20px;
    gap: 20px;
    margin-left: 20px;
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

.table {
    overflow-y: auto;
    height: fit-content;
    height: calc(100vh - 245px);
}

.main-value-formated {
    font-size: 1.2rem;
    display: flex;
    gap: 20px;
    padding-left: 10px;
    margin-bottom: 10px;
}

.icon-help:hover {
    transform: scale(1.3);
    cursor: pointer;
}


:deep(.v-data-table-header__content) {
    font-weight: 800;
}

@media (max-width: 1200px) {
  .main-cards {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0 6px 0 6px;
  }

      .container-table {
        width: 100%;
        height: 100vh;
        padding: 10px;
    }

    .container-main {
        margin-top: 30px;
        overflow: auto;
        height: 100vh;
    }

    .table {
        overflow-y: auto;
        height: fit-content;
        height: calc(100vh - 115px);
    }


}

@media (max-width: 680px) {
    .bnt-options {
        display: flex;
        margin-bottom: 20px;
        gap: 20px;
        flex-direction: column;
        margin: 10px;
    }

    .more-option {
        width: 100%;
        display: flex;
        gap: 10px;
        flex-direction: column;
    }

    .container-table {
        width: 100%;
        height: 100vh;
        padding: 10px;
    }

    .container-main {
        margin-top: 30px;
        overflow: auto;
        height: 100vh;
    }

    .table {
        overflow-y: auto;
        height: fit-content;
        height: calc(100vh - 115px);
    }

  
}


</style>