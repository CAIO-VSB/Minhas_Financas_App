<script setup lang="ts">

    definePageMeta({
        title: "Dashboard",
        layout: "layout-dashboard"
    })

    import AppCard from '~/components/ui/AppCard.vue'
    import BaseCard from '~/components/ui/BaseCard.vue';
    import DateInput from '~/components/ui/DateInput.vue'
    import { useHttpDashboard } from "~/composables/useHttp/useHttpDashboard"
    import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'
    import { useDonutChart } from "~/composables/useVueCharts/useDonuChart"
    import { useBarChart, type BarDatum } from "~/composables/useVueCharts/useBarChart"
    import type { TPeriod } from '~~/types/period/TPeriod';

    const { getExpenseByCategorie, getRenevueByCategorie, getAllSumary, getTotalByCards } = useHttpDashboard()
    const { getCurrentBalance } = useHttpMovements()

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

    function handleGetPeriod(value: TPeriod) {
        period.value = value
        refecthByCategorieRenevue()
        refetchByCategorieExpense()
        refecthByCards()
        refecthSumary()
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
            <BaseCard title="Receitas por categoria" subtitle="Visualize a origem das suas receitas">
                <div class="pa-5">
                    <VChart :option="renevueOption" autoresize style="height: 450px"/>
                    <div class="d-flex justify-end pa-1">
                        <v-sheet :width="200" :height="25" class="rounded-lg px-3" border>
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

            <BaseCard title="Despesas por categoria" subtitle="Visualize onde seus gastos estão concentrados">
                <div class="pa-5">
                    <VChart :option="expenseOption" autoresize style="height: 450px"/>
                    <div class="d-flex justify-end pa-1">
                        <v-sheet :width="200" :height="25" class="rounded-lg px-3" border>
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
            <BaseCard title="Balanço mensal" subtitle="Compare suas receitas e despesas mensais">
                <div class="pa-5 d-flex">
                    <VChart :option="balancoOption" autoresize style="height: 350px"/>
                    <div class="w-100 mt-4 d-flex flex-column ga-4">
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

            <BaseCard title="Minhas contas" subtitle="Visualize o saldo das suas contas ativas">
                <div class="pa-5">
                    teste
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
}


@media (max-width: 600px) {
    .dashboard-wrapper {
        padding: 16px;
    }

    .main-cards {
        grid-template-columns: 1fr;
    }
}

</style>