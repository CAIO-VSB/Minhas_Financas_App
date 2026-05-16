<script setup lang="ts">

    definePageMeta({
        title: "Transações",
        layout: "layout-dashboard"
    })

    import { VueDatePicker } from '@vuepic/vue-datepicker'
    import { ptBR } from 'date-fns/locale'
    import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'
    import type { TMovements } from '~~/types/movements/TMovements'
    import type { TOptionAction } from '~~/types/option_action/TOptionAction'
    import FilterDrawer from './components/FilterDrawer.vue'
    import CardEditMovementsRevenue from '~/components/forms/CardEditMovementsRevenue.vue'
    import CardEdtiMovementsExpenses from '~/components/forms/CardEdtiMovementsExpenses.vue'
    import { useInvalidate } from "~/composables/useInvalidate"

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

    const { getMoviments, patchMovements, getCurrentBalance } = useHttpMovements()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()
    const { invalidate } = useInvalidate()

    const route = useRoute()

    const search = ref('')

    const drawer = ref(false)

    const modalEditMovementsRevenue = ref(false)

    const modalEditMovementesExpenses = ref(false)

    const editDraft = ref<TMovements | null>(null)

    const period = ref({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    })

    const { data, isPending, refetch } = useQuery({
        queryKey: QUERY_KEYS.movements.all,
        queryFn: () => getMoviments(period.value.month, period.value.year)
    })

    const { data:currentBalance, isPending:isPendingCurrentBalance, refetch:refetchCurrentBalance } = useQuery({
        queryKey: QUERY_KEYS.movements.current_balance,
        queryFn: getCurrentBalance
    })

    async function handleMovementesForPeriod() {
        await nextTick()
        refetch()
    }

    const transitionsformatted = computed(() => {
        return data.value?.map(item => ({
            ...item,
            date_transaction: new Date(item.date_transaction ?? "").toLocaleDateString("pt-BR"),
            value_transaction: new Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(item.value_transaction ?? 0.00)
        }))
    })

    const sumary = computed(() => {

        const row = transitionsformatted.value?.[0]

        const formated = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

        return {
            receitas: formated.format(row?.t_receitas ?? 0.00),
            despesas: formated.format(row?.t_despesas ?? 0.00),
            balanco_mensal: formated.format(row?.balanco_mensal ?? 0.00),
            saldo_atual: formated.format(row?.saldo_atual ?? 0.00)
        }
    })

    const balanceCurrent = computed(() => {
        
        const row = currentBalance.value?.[0]

         console.log("currentBalance.value:", currentBalance.value)

        const formated = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

        return {
            saldo_atual: formated.format(row?.saldo_atual ?? 0.00)
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
        return currentItem.value?.title ?? "Todas"
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
            notifySuccess("Sucesso", "Transação editada com sucesso", 6000)
        },

        onError: (error) => {
            notifyInfo("Atenção", `Erro ao editar transação. Tente novamente mais tarde ou contate o surpote técnico. Erro detalhado: ${error.message}`)
        },

    })

    function handleOpenModalEditMovementsRevenue(movements: TMovementsFormatted) {
        modalEditMovementsRevenue.value = true

        //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
        const rawMovements =  structuredClone(toRaw(movements))

        editDraft.value = {
            ...rawMovements,
            value_transaction: Number(rawMovements.value_transaction.replace(/[^\d,]/g, '').replace(',', '.')),
            date_transaction: new Date(rawMovements.date_transaction.split('/').reverse().join('-') + 'T00:00:00'),
        }
  }

    function handleOpenModalEditMovementsExpense(movements: TMovementsFormatted) {
        modalEditMovementesExpenses.value = true

        //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
        const rawMovements =  structuredClone(toRaw(movements))

        editDraft.value = {
            ...rawMovements,
            value_transaction: Number(rawMovements.value_transaction.replace(/[^\d,]/g, '').replace(',', '.')),
            date_transaction: new Date(rawMovements.date_transaction.split('/').reverse().join('-') + 'T00:00:00'),
        }
  }


    function handleOptionClick(option: TOptionAction, data: TMovementsFormatted) {

        if (option.value === "edit" && data.type_transaction === "Receita") {
            handleOpenModalEditMovementsRevenue(data)
            return 
        }

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

        if (option.value === "delete") {
            payload.is_deleted = true
            mutate(payload)
            return
        }

        if (option.value === "efetivar" && data.type_transaction === "Receita") {
            payload.status_transaction = "recebido"
        } else if (option.value === "efetivar" && data.type_transaction === "Despesa") {
            payload.status_transaction = "pago"
        }

        mutate(payload)
    }


</script>


<template>
    <div class="container-main">

        <CardEditMovementsRevenue :draft="editDraft" v-model="modalEditMovementsRevenue"/>
        <CardEdtiMovementsExpenses :draft="editDraft"  v-model="modalEditMovementesExpenses"/>
        
        <filterDrawer v-model="drawer"/>
          
        <div class="text-center bnt-options">
            
            <v-menu
                transition="scale-transition"
                >
                <template v-slot:activator="{ props }">
                    <v-btn
                    color="primary"
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
                color="primary"
                prepend-icon="mdi-filter"
                class="text-none rounded-xl"
                @click="drawer = true"
                >
                Filtro
                </v-btn>
            </div>

        </div>

        <div class="main-cards">
            <v-card subtitle="Saldo Atual">
                <v-skeleton-loader v-if="isPendingCurrentBalance" type="list-item-avatar"></v-skeleton-loader>
                <div v-else  class="main-value-formated">
                    <v-icon icon="mdi-bank"></v-icon>
                    <span>{{ balanceCurrent?.saldo_atual }}</span>
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
                    <span>{{ sumary?.receitas }}</span>
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
                    <span> {{ sumary?.despesas }}</span>
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
                    <span>R$ {{ sumary?.balanco_mensal }}</span>
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

            <v-card
                flat
                class="table"
                :loading="isPending"
            >
           
            <template v-slot:text>

            <div style="margin-bottom: 12px;">
                <VueDatePicker @update:model-value="handleMovementesForPeriod" :teleport="true" :locale="ptBR" v-model="period" month-picker :formats="{ month: 'LLLL' }" />
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
                :items="transitionsformatted"
                :search="search"
                :loading="isPending"
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
                    <v-chip :color="item.type_transaction ===  'Receita' ? 'green' : 'red'">
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
                                :key="action.title!"
                                :value="action.value"
                                :prepend-icon="action.icon!"
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