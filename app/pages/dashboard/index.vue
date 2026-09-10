<script setup lang="ts">

    definePageMeta({
        title: "Dashboard",
        layout: "layout-dashboard",
    })

    import AppCard from '~/components/ui/AppCard.vue'
    import BaseCard from '~/components/ui/BaseCard.vue';
    import DateInput from '~/components/ui/DateInput.vue'
    import { useHttpDashboard } from "~/composables/useHttp/useHttpDashboard"
    import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'
    import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
    
    import { useDonutChart } from "~/composables/useVueCharts/useDonuChart"
    import { useBarChart, type BarDatum } from "~/composables/useVueCharts/useBarChart"
    import type { TPeriod } from '~~/types/period/TPeriod';

    const { getExpenseByCategorie, getRenevueByCategorie, getAllSumary, getTotalByCards, getLastMovements } = useHttpDashboard()
    const { getCurrentBalance, getMoviments } = useHttpMovements()
    const { getAllAccounts } = useHttpAccounts()

    const period = ref({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    })

    const { data:expenseByCategorie, isPending:isPendingExpenseByCategorie, refetch:refetchByCategorieExpense } = useQuery({
        queryKey: QUERY_KEYS.dashboard.expenseByCategorie,
        queryFn: () => getExpenseByCategorie(period.value.month, period.value.year)
    })

    const { data:renevueByCategorie, isPending:isPendingByCategorieRenevue, refetch:refecthByCategorieRenevue } = useQuery({
        queryKey: QUERY_KEYS.dashboard.renevueByCategorie,
        queryFn: () => getRenevueByCategorie(period.value.month, period.value.year)
    })

    const { data:dataSumary, isPending:isPendingSumary, refetch:refecthSumary } = useQuery({
        queryKey: QUERY_KEYS.dashboard.sumary,
        queryFn: () => getAllSumary(period.value.month, period.value.year)
    })

    const { data:currentBalance, isPending:isPendingCurrentBalance } = useQuery({
        queryKey: QUERY_KEYS.movements.current_balance,
        queryFn: getCurrentBalance
    })

    const { data:byCards, isPending:isPendingByCards, refetch:refecthByCards } = useQuery({
        queryKey: QUERY_KEYS.dashboard.cards,
        queryFn: () => getTotalByCards(period.value.month, period.value.year)
    })

    const { data:allAccounts, isPending: isPendingAccounts } = useQuery({
        queryKey: QUERY_KEYS.accounts.all,
        queryFn: getAllAccounts,
    })

    const { data: allMovements, isPending: isPendingMovements, refetch: refetchMovements } = useQuery({
        queryKey: QUERY_KEYS.movements.all,
        queryFn: () => getMoviments(period.value.month, period.value.year)
    })

    const { data: allLastMovements, isPending: isPendingLastMovements, refetch: refetchLastMovements } = useQuery({
        queryKey: QUERY_KEYS.dashboard.lastMovements,
        queryFn: () => getLastMovements(period.value.month, period.value.year)
    })

    const onlyAccountsActive = computed(() => {
        return allAccounts.value?.filter(item => item.active === true) 
    })

    const balanceCurrent = computed(() => {        
        const row = currentBalance.value?.[0]

        return {
            saldo_atual: Number(row?.saldo_atual ?? 0.00)
        }
        
    })
    
    const balanceByCards = computed(() => {        
        const row = byCards.value?.[0]

        return {
            total_cartoes: Number(row?.t_cartoes ?? 0.00)
        }
        
    })

    const summary = computed(() => {

        const row = dataSumary.value?.[0]

        return {
            receitas: Number(row?.t_receitas ?? 0),
            despesas: Number(row?.t_despesas ?? 0),
            balancoMensal: Number(row?.balanco_mensal ?? 0)
        }
    })

    const totalExpensesPending = computed(() => {
        const result = allMovements.value
        ?.filter(item => (item.status_transaction === 'pendente' && item.type_transaction === 'despesa'))
        .reduce((acc, item) => acc + Number(item.value_transaction), 0) ?? 0.00

        return result
    })

    const totalRenevuePending = computed(() => {
        const result = allMovements.value
        ?.filter(item => (item.status_transaction === 'pendente' && item.type_transaction === 'receita'))
        .reduce((acc, item) => acc + Number(item.value_transaction), 0) ?? 0.00

        return result
    })


    const totalByRenevue = computed(() => {
        const result = renevueByCategorie.value?.reduce((acc, item) => {
            return acc + item.value 
        }, 0)

        return result
    })

    const totalByExpense = computed(() => {
        const result = expenseByCategorie.value?.reduce((acc, item) => {
            return acc + item.value 
        }, 0)

        return result
    })

    function navigateToTransaction() {
        navigateTo("/transactions")
    }

    function handleGetPeriod(value: TPeriod) {
        period.value = value
        refecthByCategorieRenevue()
        refetchByCategorieExpense()
        refecthByCards()
        refecthSumary()
        refetchLastMovements()
        refetchMovements()
    }

    const barData = computed<BarDatum[]>(() => [
        { name: 'Receitas', value: summary.value.receitas, color: '#2BB673' },
        { name: 'Despesas', value: summary.value.despesas, color: '#FF6B6B' },
    ])

    const { option: expenseOption } = useDonutChart(computed(() => expenseByCategorie.value ?? []))
    const { option: renevueOption } = useDonutChart(computed(() => renevueByCategorie.value ?? []))
    const { option: balancoOption } = useBarChart(barData)



</script>

<template>
    <div class="dashboard-wrapper">
        <div class="date-filter">
            <DateInput  @apply-filter-month="handleGetPeriod"/>
        </div>

        <div class="main-cards">
            <div class="card-full">
                <AppCard
                    subtitle="Saldo atual"
                    size="40"
                    :value="balanceCurrent.saldo_atual"
                    color="primary"
                    icon="mdi-bank"
                    text-tool-tip="Saldo atual: considera o saldo inicial das contas ativas e todas as movimentações efetivadas, independentemente do período."
                    icon-tool-tip="mdi-information-outline"
                    size-icon-tool-tip="20px"
                    :loading="isPendingSumary"
                />
            </div>

            <div class="card-item">
                <AppCard
                    subtitle="Receitas"
                    size="40"
                    :value="summary.receitas"
                    color="success"
                    icon="mdi-arrow-down-thin-circle-outline"
                    text-tool-tip="Valor total de suas receitas cadastradas, sejam elas recebidas ou pendentes"
                    icon-tool-tip="mdi-information-outline"
                    size-icon-tool-tip="20px"
                    :loading="isPendingSumary"
                />
            </div>

            <div class="card-item">
                <AppCard
                    subtitle="Despesas"
                    size="40"
                    :value="summary.despesas"
                    color="error"
                    icon="mdi-arrow-up-thin-circle-outline"
                    text-tool-tip="Valor total de suas despesas cadastradas, pagas ou pendentes"
                    icon-tool-tip="mdi-information-outline"
                    size-icon-tool-tip="20px"
                    :loading="isPendingSumary"
                />
            </div>

            <div class="card-item">
                <AppCard
                    subtitle="Cartões de crédito"
                    size="40"
                    :value="balanceByCards.total_cartoes"
                    color="primary"
                    icon="mdi-credit-card"
                    text-tool-tip="Valor total de suas faturas pagas ou a vencer no mês atual"
                    icon-tool-tip="mdi-information-outline"
                    size-icon-tool-tip="20px"
                    :loading="isPendingSumary"
                />
            </div>
        </div>

        <div class="charts-row">
            <BaseCard title="Resumo de pendências" subtitle="Veja o que precisa da sua atenção">
                <div class="pa-5">
                    <div class="d-flex align-center ga-4">
                        <span class="text-no-wrap font-weight-bold">Total de despesas pendentes</span>
                        <div class="d-flex justify-end w-100">
                            <v-chip class="font-weight-bold" variant="text" color="red"><span class="d-flex justify-end mr-5">{{ formatCurrency(totalExpensesPending) }}</span></v-chip>
                        </div>
                    </div>
                    <v-divider style="margin-top: 10px; margin-bottom: 10px;"></v-divider>
                    <div class="d-flex align-center ga-4">
                        <span class="text-no-wrap font-weight-bold">Total de receitas pendentes</span>
                        <div class="d-flex justify-end w-100">
                            <v-chip class="font-weight-bold" variant="text" color="green"><span class="d-flex justify-end mr-5">{{ formatCurrency(totalRenevuePending) }}</span></v-chip>
                        </div>
                    </div>
                    <v-divider style="margin-top: 80px; margin-bottom: 10px; color: black;"></v-divider>
                    <div class="d-flex align-center justify-center" style="margin-bottom: -10px;">
                        <v-btn v-tooltip="'Ir para a tela de transações'" @click="navigateToTransaction" color="primary" variant="text">
                        VER MAIS    
                        </v-btn>
                    </div>
                </div>
            </BaseCard>
            
            <BaseCard :loading="isPendingMovements" title="Últimos lançamentos" subtitle="Confira suas movimentações recentes">
                <v-empty-state
                    v-if="!allMovements?.length"
                    icon="mdi-alert-box"
                    color="primary"
                    title="Opa! Você ainda não possui lançamentos este mês."
                    >
                    <template #text>
                        <span class="text-no-wrap">Adicione seus ganhos no mês atual através do botão (+), para ver seus gráficos.</span>
                    </template>
                </v-empty-state>
                <div class="pa-5" v-else>
                    <v-table height="200px">
                        <thead>
                            <tr>
                                <th class="text-left font-weight-bold">
                                Data
                                </th>
                                <th class="text-left font-weight-bold">
                                Descrição
                                </th>
                                <th class="text-left font-weight-bold">
                                valor
                                </th>
                                <th class="text-left font-weight-bold">
                                Situação
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="item in allLastMovements"
                                :key="item.id"
                            >
                                <td>{{ formatDate(item.date_transaction) }}</td>
                                <td>{{ item.description_transaction }}</td>
                                <td><v-chip :color="(item.type_transaction === 'receita') ? 'success' : 'error'">{{ formatCurrency(item.value_transaction)}}</v-chip></td>
                                <td><v-icon :color="item.status_transaction === 'recebido' || item.status_transaction === 'entrada' || item.status_transaction === 'saida' || item.status_transaction === 'pago' ? 'green' : 'red'" :icon="item.status_transaction === 'recebido' || item.status_transaction === 'saida' || item.status_transaction === 'entrada' || item.status_transaction === 'pago' ? 'mdi-check-circle' : 'mdi-alert-circle'"></v-icon></td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
                
            </BaseCard>

            <BaseCard :loading="isPendingByCategorieRenevue" title="Receitas por categoria" subtitle="Visualize a origem das suas receitas">
                <div class="d-flex align-center justify-center"  v-if="!allMovements?.length" style="height: 510px;">
                    <v-empty-state
                        icon="mdi-alert-box"
                        color="green"
                        title="Opa! Você ainda não possui receitas este mês."
                        >
                        <template #text>
                            <span class="text-no-wrap">Adicione suas receitas no mês atual através do botão (+), para ver seus gráficos.</span>
                        </template>
                    </v-empty-state>
                </div>
                <div class="pa-5" v-else>
                    <VChart class="mt-5" :option="renevueOption" autoresize style="height: 430px"/>
                    <div class="d-flex justify-end pa-1">
                        <v-sheet :width="220" :height="25" class="rounded-lg px-3" border>
                            <span class="text-medium-emphasis">
                                Total geral: 
                            </span>
                            <span class="font-weight-bold">
                                {{ formatCurrency(totalByRenevue ?? 0.00) }}
                            </span>
                        </v-sheet>
                    </div>
                </div>
            </BaseCard>

            <BaseCard :loading="isPendingExpenseByCategorie" title="Despesas por categoria" subtitle="Visualize onde seus gastos estão concentrados">
                <div class="d-flex align-center justify-center"  v-if="!allMovements?.length" style="height: 510px;">
                    <v-empty-state
                        icon="mdi-alert-box"
                        color="error"
                        title="Opa! Você ainda não possui despesas este mês."
                        >
                        <template #text>
                            <span class="text-no-wrap">Adicione suas despesas no mês atual através do botão (+), para ver seus gráficos.</span>
                        </template>
                    </v-empty-state>
                </div>
                <div class="pa-4" v-else>
                    <VChart class="mt-5" :option="expenseOption" autoresize style="height: 430px"/>
                    <div class="d-flex justify-end pa-1">
                        <v-sheet :width="220" :height="25" class="rounded-lg px-3" border>
                            <span class="text-medium-emphasis">
                                Total geral: 
                            </span>
                            <span class="font-weight-bold">
                                {{ formatCurrency(totalByExpense ?? 0.00) }}
                            </span>
                        </v-sheet>
                    </div>
                </div>
            </BaseCard>
        </div>

        <div class="charts-row charts-row-single">
            <BaseCard :loading="isPendingCurrentBalance" title="Balanço mensal" subtitle="Compare suas receitas e despesas mensais">
                <div class="d-flex align-center justify-center"  v-if="!allMovements?.length" style="height: 510px;">
                    <v-empty-state
                        icon="mdi-alert-box"
                        color="primary"
                        title="Opa! Você ainda não possui lançamentos este mês."
                        >
                        <template #text>
                            <span class="text-no-wrap">Adicione seus ganhos no mês atual através do botão (+), para ver seus gráficos.</span>
                        </template>
                    </v-empty-state>
                </div>
                <div class="pa-5 d-flex justify-center charts-balanco" v-else>
                    <VChart class="mt-4" :option="balancoOption" autoresize style="height: 430px"/>
                    <div class="w-100 mt-8 d-flex flex-column ga-4">
                        <div class="d-flex align-center">
                            <span class="font-weight-bold">Receitas</span>
                            <div class="d-flex justify-end w-100">
                                <v-chip class="font-weight-bold" variant="text" color="success">{{ formatCurrency(summary.receitas) }}</v-chip>
                            </div>
                        </div>

                        <div class="d-flex align-center">
                            <span class="font-weight-bold">Despesas</span>
                            <div class="d-flex justify-end w-100">
                                <v-chip class="font-weight-bold" variant="text" color="red">{{ formatCurrency(summary.despesas) }}</v-chip>
                            </div>
                        </div>
                       
                        <v-divider></v-divider>
                        
                        <div class="d-flex align-center">
                            <span class="font-weight-bold">Balanço</span>
                            <div class="d-flex justify-end w-100">
                                <v-chip class="font-weight-bold" variant="text" :color="(summary.balancoMensal <= 0) ? 'red' : 'success' ">{{ formatCurrency(summary.balancoMensal) }}</v-chip>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseCard>

            <BaseCard :loading="isPendingAccounts" title="Minhas contas" subtitle="Visualize o saldo das suas contas ativas">
                <div class="pa-5" v-for="value in onlyAccountsActive" :key="value.id">
                    <div class="d-flex align-center ga-4">
                        <div>
                            <v-img
                            :width="40"
                            rounded="lg"
                            :src="value.url_image"
                            ></v-img>
                        </div>
                        <span class="font-weight-bold">{{ value.name_identifier }}</span>
                        
                    </div>
                    <div class="mt-3">
                        <div class="d-flex justify-end align-center ">
                            <div class="d-flex justify-start w-100">
                                <span class="text-medium-emphasis text-no-wrap mr-3">Saldo atual</span>
                            </div>
                             <v-chip class="font-weight-bold" variant="text" :color="(value.saldo_atual! <= 0) ? 'red' : 'green'"><span class="font-weight-bold mr-4">{{ formatCurrency(value.saldo_atual ?? 0.00) }}</span></v-chip>
                        </div>
                        <v-divider></v-divider>
                    </div>
                </div>
            </BaseCard>
        </div>

    </div>
</template>

<style scoped>

.dashboard-wrapper {
    width: 100%;
    padding: 24px;
}

.date-filter {
    margin-bottom: 32px;
}

.main-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    width: 100%;
}

.charts-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: 100%;
    margin-top: 40px;
}

.charts-row-single {
    grid-template-columns: repeat(2, 1fr);
}



@media (max-width: 1450px) {
    .main-cards {
        grid-template-columns: repeat(2, 1fr);
    }

    .charts-row {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 960px) {
    .main-cards {
        grid-template-columns: repeat(2, 1fr);
    }

    .charts-row {
        grid-template-columns: 1fr;
    }

    .charts-balanco {
        display: flex;
        flex-direction: column;
    }
}


@media (max-width: 600px) {
    .dashboard-wrapper {
        padding: 16px;
    }

    .main-cards {
        grid-template-columns: 1fr;
    }

    .charts-balanco {
        display: flex;
        flex-direction: column;
    }
}

</style>