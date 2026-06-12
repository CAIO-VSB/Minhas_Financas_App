<script setup lang="ts">

    definePageMeta({
        title: "Transações",
        layout: "layout-dashboard"
    })

    import { useHttpTransfer } from '~/composables/useHttp/useHttpTransfer'
    import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'
    import DateInput from '~/components/ui/DateInput.vue'
    import type { TTransfer } from '~~/types/transfer/TTransfer'
    import type { TOptionAction } from '~~/types/option_action/TOptionAction'
    import type { TPeriod } from '~~/types/period/TPeriod'
    import CardAddTransfer from '~/components/forms/CardAddTransfer.vue'
    import CardEditTransfer from '~/components/forms/CardEditTransfer.vue'
    import CardDeleteTransfer from '~/components/forms/CardDeleteTransfer.vue'

    type option = {
        title: string,
        color: string,
        value: string,
        route: string
    }

    const { getTransfer } = useHttpTransfer()
    const { getMoviments, getCurrentBalance } = useHttpMovements()

    const editDraft = ref<TTransfer | null>(null)
   
    const route = useRoute()
    const search = ref('')
    const modalAddTransfer = ref(false)
    const modalEditTransfer = ref(false)
    const cardDeleteTransfer = ref(false)
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


    const { data:movements, isPending:isPendingMovements, refetch:RefetchMovements } = useQuery({
        queryKey: QUERY_KEYS.movements.all,
        queryFn: () => getMoviments(period.value.month, period.value.year)
    })

    const { data:currentBalance, isPending:isPendingCurrentBalance } = useQuery({
        queryKey: QUERY_KEYS.movements.current_balance,
        queryFn: getCurrentBalance
    })
  
    const { data, isPending, refetch } = useQuery({
        queryKey: QUERY_KEYS.tranfer.all,
        queryFn: () => getTransfer(period.value.month, period.value.year),
    })

    function handleGetPeriod(value: TPeriod) {
        period.value = value
        refetch()
        RefetchMovements()
    }

    
    const sumary = computed(() => {

        const row = movements.value?.[0]

        return {
            receitas: Number(row?.t_receitas ?? 0.00),
            despesas: Number(row?.t_despesas ?? 0.00),
            balanco_mensal: Number(row?.balanco_mensal ?? 0.00),
            saldo_atual: Number(row?.saldo_atual ?? 0.00)
        }
    })

    const balanceCurrent = computed(() => {
        
        const row = currentBalance.value?.[0]

        return {
            saldo_atual: Number(row?.saldo_atual ?? 0.00)
        }

    })

    const itemsRouter = [
        { title: 'Todas as transações', color: "#673AB7", value: "todas",          route: "/transactions" },
        { title: 'Despesas',            color: "#F44336", value: "despesas",       route: "/transactions/expense" },
        { title: 'Receitas',            color: "#4CAF50", value: "receitas",       route: "/transactions/revenue" },
        { title: 'Transferências',      color: "#2196F3", value: "transferencias", route: "/transactions/transfer" },
    ]
        
    const headers = [
        { key: 'date_transfer', title: 'Data'  },
        { key: 'observation', title: 'Observação' },
        { key: 'account_origin_name', title: 'De' },
        { key: 'account_destination_name', title: 'Para' },
        { key: 'value_transfer', title: 'Valor' },
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

    function getOptions(transfer: TTransfer): TOptionAction [] {
        return [
        { title: 'Editar',  value: "edit", icon: "mdi-pencil" },
        { title: 'Deletar', value: "delete", icon: "mdi-delete-forever" }
        ]
    } 

    function handleOpenModalEditTransfer(transfer: TTransfer) {

        console.log("Está passando o id?", transfer.id)
    
        //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
        const rawTransfer =  structuredClone(toRaw(transfer))

        editDraft.value = parseTransferToEdit(rawTransfer)

        modalEditTransfer.value = true
    }

    function handleOptionClick(option: TOptionAction, data: TTransfer) {

        if (option.value === "edit") {
            handleOpenModalEditTransfer(data)
            return 
        }

        const raw = structuredClone(toRaw(data))

        const payload: TTransfer = {
            ...raw,
            value_transfer: Number(raw.value_transfer ?? 0),
            date_transfer: new Date(raw.date_transfer ?? ""),
        }

        if (option.value === "delete") {
            editDraft.value = data
            payload.is_deleted = true
            labelOptions.value.colorButton = "blue"
            labelOptions.value.textButton = "Deletar"
            labelOptions.value.title = "Deletar transferência"
            labelOptions.value.text = "Essa ação não poderá ser desfeita."
            cardDeleteTransfer.value = true
            return
        }
    }
 
</script>


<template>
    
    <CardAddTransfer v-model="modalAddTransfer"/>
    <CardEditTransfer :draft="editDraft" v-model="modalEditTransfer" />
    <CardDeleteTransfer :title-botton="labelOptions.textButton" :title="labelOptions.title" :text="labelOptions.text" :color-botton="labelOptions.colorButton" :draft="editDraft" v-model="cardDeleteTransfer" />
    <div class="container-main">

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
                @click="modalAddTransfer = true"
                >
                NOVA TRANSFERÊNCIA
                </v-btn>
                
            </div>

        </div>

        <div class="main-cards">
            <v-card subtitle="Saldo Atual">
                <v-skeleton-loader v-if="isPendingCurrentBalance" type="list-item-avatar"></v-skeleton-loader>
                <div v-else  class="main-value-formated">
                    <v-icon icon="mdi-bank"></v-icon>
                    <span>{{ formatCurrency(balanceCurrent.saldo_atual) }}</span>
                </div>
                <template #append>
                    <v-tooltip  text="O cálculo do saldo atual é independente do período selecionado, considerando o saldo inicial das contas ativas juntamente com todas as movimentações efetivadas de entrada e saída">
                        <template v-slot:activator="{ props }">
                            <v-icon class="icon-help" v-bind="props" size="20px" icon="mdi-information-outline"></v-icon>
                        </template>
                    </v-tooltip>
                </template>
            </v-card>
            <v-card :loading="isPending" subtitle="Receitas">
                 <v-skeleton-loader v-if="isPending" type="list-item-avatar"></v-skeleton-loader>
                 <div v-else class="main-value-formated">
                    <v-icon color="green" icon="mdi-arrow-up-bold-circle"></v-icon>
                    <span>{{ formatCurrency(sumary.receitas)}}</span>
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
                 <div v-else  class="main-value-formated">
                    <v-icon color='red' icon="mdi-arrow-down-bold-circle"></v-icon>
                    <span> {{ formatCurrency(sumary.despesas) }}</span>
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
                 <div v-else  class="main-value-formated">
                    <v-icon color="blue" icon="mdi-scale-balance"></v-icon>
                    <span>{{ formatCurrency(sumary.balanco_mensal) }}</span>
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

            <div style="margin-bottom: 12px;">
                <DateInput  @apply-filter-month="handleGetPeriod"></DateInput>
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
                :items="data"
                :search="search"
                hide-no-data
                mobile-breakpoint="md"
                >

                <template v-slot:item.account_origin_name="{ item }">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <v-avatar size="30">
                            <v-img :src="item.logo_origem"></v-img>
                        </v-avatar>
                        <span>{{ item.account_origin_name }}</span>
                    </div>
                </template>

                <template v-slot:item.account_destination_name="{ item }">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <v-avatar size="30">
                            <v-img :src="item.logo_destino"></v-img>
                        </v-avatar>
                        <span>{{ item.account_destination_name }}</span>
                    </div>
                </template>

                <template v-slot:item.value_transfer="{item}">
                    <v-chip color="#2196F3">
                        {{ formatCurrency(item.value_transfer ?? 0.00) }}
                    </v-chip>
                </template>

                <template v-slot:item.date_transfer="{item}">
                    {{ formatDate(item.date_transfer) }}
                </template>

                <template v-slot:item.actions="{ item }">
                    
                        <v-menu
                            transition="slide-y-transition"
                            >
                            <template v-slot:activator="{ props }">
                                <v-icon  class="hover:scale-150 hover:bg-gray-200 rounded-xl"  v-bind="props" icon="mdi-dots-vertical" size="large"></v-icon>
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
    margin-top: 35px;
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
    max-height: calc(100vh - 220px);
    height: fit-content;
}

.main-value-formated {
    font-size: 1.2rem;
    display: flex;
    gap: 20px;
    padding-left: 10px;
    margin-bottom: 10px;
}


:deep(.v-data-table-header__content) {
    font-weight: 800;
}

@media (max-width: 950px) {
  .main-cards {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0 6px 0 6px;
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
}


</style>