<script setup lang="ts">

definePageMeta({
    title: "Visão Geral",
    layout: "layout-dashboard"
})

// Lista curta dos meses para mostrar no grid expandido
const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

// Lista completa para mostrar no chip principal ex: "Maio 2026"
const fullMonths = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

// Estado do período selecionado — mês e ano atual por padrão
// getMonth() retorna 0-11 onde Janeiro = 0 e Dezembro = 11
const period = ref({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
})

watch(period.value, (val) => {
    console.log("O valor chegando", val)
})
// Ano visualizado no grid — pode ser diferente do selecionado
// Ex: usuário navega para 2027 no grid mas ainda não selecionou nenhum mês
const currentYear = ref(new Date().getFullYear())

// Controla se o grid de meses está aberto ou fechado
const expanded = ref(false)

// Navega o ano no grid expandido — não altera o período selecionado
// +1 avança, -1 volta
function changeYear(direction: number) {
    currentYear.value += direction
}

// Navega para o mês anterior no modo padrão (seta esquerda)
// Se for Janeiro, volta para Dezembro do ano anterior
function prevMonth() {
    if (period.value.month === 0) {
        period.value.month = 11
        period.value.year--
        currentYear.value-- // mantém currentYear sincronizado com period
    } else {
        period.value.month--
    }
}

// Navega para o próximo mês no modo padrão (seta direita)
// Se for Dezembro, avança para Janeiro do próximo ano
function nextMonth() {
    if (period.value.month === 11) {
        period.value.month = 0
        period.value.year++
        currentYear.value++ // mantém currentYear sincronizado com period
    } else {
        period.value.month++
    }
}

// Seleciona um mês no grid e fecha o modo expandido
// index = posição do mês no array (0 = Jan, 11 = Dez)
function selectMonth(index: number) {
    period.value.month = index
    period.value.year = currentYear.value // usa o ano que estava sendo visualizado no grid
    expanded.value = false
}

// Verifica se o mês do grid é o período atualmente selecionado
// Precisa checar mês E ano — para não marcar "Mai 2025" quando "Mai 2026" está selecionado
function isActive(index: number) {
    return index === period.value.month && currentYear.value === period.value.year
}

// Monta o texto do chip principal ex: "Maio 2026"
// computed recalcula automaticamente quando period muda
const monthLabel = computed(() => {
    return `${fullMonths[period.value.month]} ${period.value.year}`
})

</script>

<template>

    <div>
        
    </div>
    <div>
        <!-- Modo padrão: setas para navegar mês a mês + chip clicável para expandir -->
        <div v-if="!expanded" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <v-btn icon="mdi-chevron-left" variant="text" @click="prevMonth" />
            <!-- Ao clicar no chip, abre o grid de meses -->
            <span
                @click="expanded = true"
                style="cursor: pointer; font-size: 16px; font-weight: 500; text-transform: capitalize; border: 1.5px solid #7F77DD; color: #7F77DD; padding: 4px 16px; border-radius: 20px;"
            >
                {{ monthLabel }}
            </span>
            <v-btn icon="mdi-chevron-right" variant="text" @click="nextMonth" />
        </div>

        <!-- Modo expandido: navegação por ano + grid de meses -->
        <div v-else>
            <!-- Setas para navegar o ano sem fechar o grid -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 24px; margin-bottom: 1rem;">
                <v-btn icon="mdi-chevron-left" variant="text" @click="changeYear(-1)" />
                <span style="font-size: 16px; font-weight: 500;">{{ currentYear }}</span>
                <v-btn icon="mdi-chevron-right" variant="text" @click="changeYear(1)" />
            </div>

            <!-- Grid de meses — ao clicar seleciona e fecha o grid -->
            <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                <v-btn
                    v-for="(month, index) in months"
                    :key="index"
                    :variant="isActive(index) ? 'outlined' : 'text'"
                    :color="isActive(index) ? 'primary' : 'red'"
                    rounded="xl"
                    size="small"
                    @click="selectMonth(index)"
                >
                    {{ month }}
                </v-btn>
            </div>
        </div>
    </div>
</template>