<script setup lang="ts">

    definePageMeta({
        title: "Transações",
        layout: "layout-dashboard"
    })


    import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'
    import type { TMovements } from '~~/types/movements/TMovements'
    import type { TOptionAction } from '~~/types/option_action/TOptionAction'

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

    const { getMoviments } = useHttpMovements()

    const route = useRoute()

    const search = ref('')
  
    const { data, isPending } = useQuery({
        queryKey: QUERY_KEYS.movements.all,
        queryFn: getMoviments,
    })


    const transitionsFformatted = computed(() => {
        return data.value?.map(item => ({
            ...item,
            date_transaction: new Date(item.date_transaction ?? "").toLocaleDateString("pt-BR"),
            value_transaction: new Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(item.value_transaction ?? 0.00)
        }))
        
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

    const ColorButtonOption = computed(() => {
        return currentItem.value?.color
    })

    function getTitleRouter(item: option) {
        navigateTo(item.route)
    }

    function getOptions(moviments: TMovementsFormatted): TOptionAction [] {
        return [
        {
            title: moviments.status_transaction === 'pendente' ? 'Efetivar' : 'Editar',
            icon: moviments.status_transaction === 'pendente' ? "mdi-check-all" : "mdi-circle-edit-outline",
            value: moviments.status_transaction === 'pendente' ? 'efetivar' : 'editar'
        },
        { title: 'Anexar arquivo',  value: "arquivo", icon: "mdi-paperclip" },
        { title: 'Deletar', value: "delete", icon: "mdi-delete-forever" }
        ]
    } 


 
</script>


<template>
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
                >
                NOVA TRANSFERÊNCIA
                </v-btn>
                
                <v-btn
                color="primary"
                prepend-icon="mdi-filter"
                class="text-none rounded-xl"
                >
                Filtro
                </v-btn>
            </div>

        </div>

        <div class="main-cards">
            <v-card text="Saldo Atual"></v-card>
            <v-card text="Receitas"></v-card>
            <v-card text="Despesas"></v-card>
            <v-card text="Balanco Mensal"></v-card>
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
                hide-no-data
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

                <template v-slot:item.actions="{ item }">
                    <v-btn icon variant="text" size="small">
                        <v-menu
                            transition="slide-y-transition"
                            >
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-dots-vertical" size="large"></v-icon>
                            </template>
                            <v-list>
                                <v-list-item
                                v-for="action in getOptions(item)"
                                :key="action.title"
                                :value="action.value"
                                :prepend-icon="action.icon"
                                >
                                <v-list-item-title>{{ action.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-btn>
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