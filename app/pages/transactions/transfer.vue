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
    import type { TTransferPayload } from '~~/schemas/transfer.schema'

    type option = {
        title: string,
        color: string,
        value: string,
        route: string
    }

    const { getTransfer } = useHttpTransfer()
    const { getMoviments, getCurrentBalance } = useHttpMovements()
    const {  notifyInfo, notifySuccess, notifyError } = useNotify()

    const editDraft = ref<TTransfer | null>(null)
    const confirmDraft = ref<TTransferPayload | null>(null)
   
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

    function getOptions(): TOptionAction [] {
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

        if (option.value === "arquivo") {
            notifyInfo("Em desenvolvimento", "Estamos trabalhando nesta funcionalidade para disponibilizá-la em breve.", 6000, true)
            return
        }

        const raw = structuredClone(toRaw(data))

        if (!raw.date_transfer) {
            notifyError(
                "Data inválida",
                "Não foi possível concluir a ação porque a data informada é inválida ou está ausente.",
            )
            return
        }

        const dateFormated = dateToDateOnly(raw.date_transfer)

        const payload = {
            ...raw,
            value_transfer: Number(raw.value_transfer ?? 0),
            date_transfer: dateFormated,
        }

        if (option.value === "delete") {
            confirmDraft.value = payload
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
    <CardDeleteTransfer :title-botton="labelOptions.textButton" :title="labelOptions.title" :text="labelOptions.text" :color-botton="labelOptions.colorButton" :draft="confirmDraft" v-model="cardDeleteTransfer" />

    <div class="mt-7 container-main">

        <div class="text-center d-flex ga-4 ml-4 mb-5 btn-options">
            
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

            <div class="w-100 d-flex justify-sm-end ga-3 pr-4 ">
                <v-btn
                :color="ColorButtonOption"
                prepend-icon="mdi-plus"
                class="text-none btn-add-transfer elevation-1"
                variant="flat"
                @click="modalAddTransfer = true"
                >
                NOVA TRANSFERÊNCIA
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
                    <span class="font-weight-semibold card-value">{{ formatCurrency(balanceCurrent.saldo_atual) }}</span>
                </div>                
                <template #subtitle>
                    <p class="card-label">Saldo atual</p>
                </template>
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
                    <span class="font-weight-semibold card-value">{{ formatCurrency(sumary.receitas)}}</span>
                </div>
                 <template #subtitle>
                    <p class="card-label">Receitas</p>
                </template>
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
                 <div v-else  class="d-flex align-center ga-2 pl-2 mb-2">
                    <div class="pa-2 rounded-lg ">
                        <v-avatar 
                        color="error"
                        variant="tonal" 
                        icon="mdi-arrow-up-thin-circle-outline"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="font-weight-semibold card-value"> {{ formatCurrency(sumary.despesas) }}</span>
                </div>
                 <template #subtitle>
                    <p class="card-label">Despesas</p>
                </template>
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
                 <div v-else  class="d-flex align-center ga-2 pl-2 mb-2">
                    <div class="pa-2 rounded-lg ">
                        <v-avatar 
                        color="primary"
                        variant="tonal" 
                        icon="mdi-scale-balance"
                        size="40"
                        rounded="lg"
                        ></v-avatar>
                    </div>
                    <span class="font-weight-semibold card-value">{{ formatCurrency(sumary.balanco_mensal) }}</span>
                </div>
                 <template #subtitle>
                    <p class="card-label">Balanço mensal</p>
                </template>
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
                class="table  elevation-2"
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
                                <v-icon  class="hover-icon rounded-xl"  v-bind="props" icon="mdi-dots-vertical" size="large"></v-icon>
                            </template>
                            <v-list>
                                <v-list-item
                                v-for="action in getOptions()"
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

    .btn-add-transfer {
        font-size: clamp(0.75rem, 2.5vw, 0.75rem);
    }

}

@media (max-width: 680px) {

    .btn-options {
        display: flex;
        flex-direction: column;
        padding-right: 10px;
    }

    .btn-add-transfer {
        width: 100%;
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