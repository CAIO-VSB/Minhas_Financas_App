<script setup lang="ts">

    definePageMeta({
        title: "Visão Geral",
        layout: "layout-dashboard"
    })

    import type { TPeriod} from "~~/types/period/TPeriod"
   
    const emit = defineEmits<{
        applyFilterMonth: [filter: TPeriod]
    }>()    

    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

    const fullMonths = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

    const period = ref({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    })

    const currentYear = ref(new Date().getFullYear())

    const expanded = ref(false)

    function changeYear(direction: number) {
        currentYear.value += direction
        emit("applyFilterMonth", period.value)
    }

    function prevMonth() {
        if (period.value.month === 0) {
            period.value.month = 11
            period.value.year--
            currentYear.value-- 
            emit("applyFilterMonth", period.value)
        } else {
            period.value.month--
            emit("applyFilterMonth", period.value)
        }
    }

    function nextMonth() {
        if (period.value.month === 11) {
            period.value.month = 0
            period.value.year++
            currentYear.value++ 
            emit("applyFilterMonth", period.value)
        } else {
            period.value.month++
            emit("applyFilterMonth", period.value)
        }
    }

    function selectMonth(index: number) {
        period.value.month = index
        period.value.year = currentYear.value 
        expanded.value = false
        emit("applyFilterMonth", period.value)
    }

    function isActive(index: number) {
        return index === period.value.month && currentYear.value === period.value.year
    }

    const monthLabel = computed(() => {
        return `${fullMonths[period.value.month]} ${period.value.year}`
    })

</script>

<template>

    <div>
        
        <v-expand-transition>
            <div v-show="!expanded" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                <v-btn style="color: #2196F3;" icon="mdi-chevron-left" variant="text" @click="prevMonth" />
                <span
                    @click="expanded = true"
                    style="cursor: pointer; font-size: 16px; font-weight: 500; text-transform: capitalize; border: 2.1px solid #2196F3; color: #2196F3; padding: 4px 16px; border-radius: 20px;"
                >
                    {{ monthLabel }}
                </span>
                <v-btn style="color: #2196F3;" icon="mdi-chevron-right" variant="text" @click="nextMonth" />
            </div>
        </v-expand-transition>

        <v-expand-transition>
            <div v-show="expanded">
                <div style="display: flex; align-items: center; justify-content: center; gap: 24px; margin-bottom: 1rem;">
                    <v-btn style="color: #2196F3;" icon="mdi-chevron-left" variant="text" @click="changeYear(-1)" />
                    <span style="font-size: 16px; font-weight: 500; color: #2196F3;">{{ currentYear }}</span>
                    <v-btn style="color: #2196F3;" icon="mdi-chevron-right" variant="text" @click="changeYear(1)" />
                </div>

                
                <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                        <v-btn
                            v-for="(month, index) in months"
                            :key="index"
                            :variant="isActive(index) ? 'outlined' : 'text'"
                            :color="isActive(index) ? 'primary' : ''"
                            rounded="xl"
                            size="small"
                            @click="selectMonth(index)"
                        >
                            {{ month }}
                    </v-btn>
                </div>
            </div>
        </v-expand-transition>
    </div>
</template>

<style lang="scss">
  
</style>