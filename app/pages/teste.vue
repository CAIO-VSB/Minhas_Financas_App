<script setup lang="ts">
import { datetime, RRule } from "rrule"

const periodo = ref("")
const parcela = ref(2)
const dataVencimento = ref<Date>()

// computed em vez de ref: recalcula sozinho toda vez que dataVencimento mudar
const startDate = computed(() => {
    if (!dataVencimento.value) return null

    return {
        ano: dataVencimento.value.getFullYear(),
        mes: dataVencimento.value.getMonth() +1, // +1 aqui: Date nativo é 0-11, rrule espera 1-12
        dia: dataVencimento.value.getDate()        // getDate(), não getDay()
    }
})

const mapaFrequencia: Record<string, number> = {
    "Dias": RRule.DAILY,
    "Semanas": RRule.WEEKLY,
    "Meses": RRule.MONTHLY,
    "Anos": RRule.YEARLY,
}

const result = ref<Date[]>([])

function gerarParcelas() {
    if (!startDate.value) {
        console.log("Escolha uma data de vencimento primeiro")
        return
    }

    const freq = mapaFrequencia[periodo.value]

    if (freq === undefined) {
        console.log("Escolha um período válido primeiro")
        return
    }

    const rule = new RRule({
        freq,
        interval: 1,
        dtstart: datetime(startDate.value.ano, startDate.value.mes, startDate.value.dia),
        count: parcela.value
    })

    result.value = rule.all()
}
</script>

<template>
    <div>
        <v-date-input v-model="dataVencimento" label="Data de vencimento"></v-date-input>
    </div>

    <div class="pa-2">
        <v-number-input
            v-model="parcela"
            label="Parcelas"
            :min="2"
            :max="499"
        ></v-number-input>
    </div>

    <div class="pa-2">
        <v-select
            v-model="periodo"
            label="Periodicidade"
            :items="['Dias', 'Semanas', 'Meses', 'Anos']"
        ></v-select>
    </div>

    <v-btn @click="gerarParcelas" color="primary" class="mb-6 pa-2">
        Gerar
    </v-btn>

    <div class="ml-2">
        <span>Resultado</span>
        {{ result }}
    </div>

    <div class="d-flex align-center ga-6">
        <div class="ml-3 mt-5"> 
            Tabela:
        </div>
        <div>
            Situaçõa
        </div>
        <div
        v-for="value in result"
        >
            Data
            {{ value.toLocaleDateString("pt-br", {timeZone: "UTC"}) }}
        </div>
        <div>
            Conta
            Banco NU
        </div>
        <div>
            Categoria
            Salário
        </div>
    </div>
</template>