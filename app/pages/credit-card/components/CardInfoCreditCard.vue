<script setup lang="ts">
  import { useHttpCreditsCards } from "~/composables/useHttp/useHttpCreditCard"
  import type { TCreditCard } from "~~/types/credit_card/TCredit-card";
  import { addMonths } from "date-fns"
  import CardPaymentTotalInvoice from "~/components/forms/CardPaymentTotalInvoice.vue";
  import NoticePaymentTotalInvoice from "~/components/ui/NoticePaymentTotalInvoice.vue"
  import NoticePaymentePartialInvoice from "~/components/ui/NoticePaymentePartialInvoice.vue";
  import CardPaymentPartial from "~/components/forms/CardPaymentPartialInvoice.vue";
  import { boolean } from "zod";
  import type { TOptionAction } from "~~/types/option_action/TOptionAction";

  const { notifyError, notifyInfo, notifySuccess } = useNotify()

  const { getCreditCardOnlyActive } = useHttpCreditsCards()

  const { data:allCreditCard, isPending } = useQuery({
    queryKey: QUERY_KEYS.creditCards.all,
    queryFn: getCreditCardOnlyActive,
  })

  const modelNoticePaymentTotalInvoice = ref(false)
  const modelNoticePaymentPartial = ref(false)
  const modelCardPaymentTotal = ref(false)
  const modelCardPaymentPartial = ref(false)


  type TPeriod = {
    year: number,
    month: number
  }

  const props = defineProps<{
    creditCard: TCreditCard | null,
    totalInvoice: number | null,
    loading: boolean | null,
    period: TPeriod,
    invoiceId : number | null,
    statusInvoices: string | null
  }>()

  function getOptions(): TOptionAction [] {

    const options = [
      props.statusInvoices === 'aberta' ? { title: 'Pagamento total', icon: 'mdi-check-circle-outline', value: 'pag_total' } : null,
      props.statusInvoices === 'aberta' ? { title: 'Pagamento parcial', icon: 'mdi-circle-half-full', value: 'pag_parcial' } : null,
      props.statusInvoices === 'aberta' ? { title: 'Pagamento adiantado', icon: 'mdi-clock-fast', value: 'pag_adiantado' } : null,
      { title: 'Reabrir fatura', icon: 'mdi-lock-open-variant', value: 'reabrir_fatu' },
    ]

    return options.filter(Boolean) as TOptionAction[]

  } 

  const sumary = computed(() => {
    const row = props.creditCard

    if (!row) {
      return {
        limiteTotal: 0,
        ultimosDigitos: "",
        fechamento: "",
        vencimento: ""
      }
    }
   
    const closingDay = row.closing_day ?? 0
    const dueDay = row.due_day ?? 0

    if (props.period?.month === null && props.period?.year === null ) {
      notifyError(
        "Período inválido",
        "Não foi possível identificar o mês e o ano da fatura."
      )
      return
    }

    const closingDate = new Date(
      props.period.year,
      props.period.month,
      closingDay
    )

    let dueDate = new Date(
      props.period.year,
      props.period.month,
      dueDay
    )

    if (dueDay !== null && closingDay !== null) {
      if (dueDay <= closingDay) {
        dueDate = addMonths(dueDate, 1)
      }
    }

    return {
      limiteTotal: row.limit_card,
      ultimosDigitos: row.four_digits,
      fechamento: closingDate.toLocaleDateString("pt-BR"),
      vencimento: dueDate.toLocaleDateString("pt-BR")
    }

  })

  function showModalPaymentTotal() {
    modelCardPaymentTotal.value = true
  }

  function showModalPaymentPartial() {
    modelCardPaymentPartial.value = true
  }

  function handleOptionClick(option: string | null) {

    if (option === 'pag_total') {
      modelNoticePaymentTotalInvoice.value = true
      return
    }

    if (option === 'pag_parcial') {
      modelNoticePaymentPartial.value = true
      return
    }

  }


</script>

<template>
    <div class="">
        <v-card
          class="mx-auto"
          :loading="props.loading ?? false"
        >
        <template #title>
          <span style="font-size: var(--text-base);" class="title-card text-textSecundary">Detalhamento</span>
        </template>

        <v-card-text>
            <div class="d-flex flex-column ga-4">
              <div class="d-flex justify-space-between">
                <span style="font-size: var(--text-base);" class="text-textSecundary">Valor a pagar</span>
                <span class="mr-2" style="font-size: var(--text-base); font-weight: 500;"> <v-chip variant="text" color="primary">{{ formatCurrency(totalInvoice) }}</v-chip></span>
              </div>
              <div class="d-flex justify-space-between">
                <span style="font-size: var(--text-base);" class="text-textSecundary">Status da fatura</span>
                <span class="mr-2" style="font-size: var(--text-base); font-weight: 500;"> <v-chip variant="text" color="primary">{{ `Fatura ${statusInvoices ?? 'zerada'}`}}</v-chip></span>
              </div>
              <div class="d-flex justify-center mt-2 ga-3">
                <v-menu
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="primary"
                      v-bind="props"
                      prepend-icon="mdi-dots-vertical"
                      class="w-100"
                      variant="flat"
                    >
                      Ações da fatura
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, i) in getOptions()"
                      :key="i"
                      :value="i"
                      :prepend-icon="item.icon"
                      @click="handleOptionClick(item.value || null)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex flex-column ga-4">
              <div class="d-flex justify-space-between">
                <span style="font-size: var(--text-base);" class="text-textSecundary">Fechamento</span>
                <span class="mr-2" style="font-size: var(--text-base); font-weight: 500;">{{ sumary?.fechamento }}</span>
              </div>
              <div class="d-flex justify-space-between ">
                <span style="font-size: var(--text-base)" class="text-textSecundary">Vencimento</span>
                <span class="mr-2" style="font-size: var(--text-base); font-weight: 500;">{{ sumary?.vencimento }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span style="font-size: var(--text-base);" class="text-textSecundary">Limite total</span>
                <span class="mr-2" style="font-size: var(--text-base); font-weight: 500;">{{ formatCurrency(sumary?.limiteTotal ?? 0.00) }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span style="font-size: var(--text-base);" class="text-textSecundary">4 últimos dígitos </span>
                <span class="mr-2" style="font-size: var(--text-base); font-weight: 500;">{{ sumary?.ultimosDigitos }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <div>
          <CardPaymentTotalInvoice :period="props.period" :invoice-id="props.invoiceId"  :total-invoice="props.totalInvoice" :draft="props.creditCard" v-model="modelCardPaymentTotal"/>
          <CardPaymentPartial :period="props.period" :invoice-id="props.invoiceId"  :total-invoice="props.totalInvoice" :draft="props.creditCard" v-model="modelCardPaymentPartial"/>
          <NoticePaymentTotalInvoice @show-modal-payment="showModalPaymentTotal" :invoice-value="props.totalInvoice ?? 0.00" v-model="modelNoticePaymentTotalInvoice"/>
          <NoticePaymentePartialInvoice @show-modal-payment="showModalPaymentPartial" :invoice-value="props.totalInvoice ?? 0.00" v-model="modelNoticePaymentPartial" />
        </div>
    </div>
</template>

<style scoped> 

.title-card {
  display: flex;
  align-items: center;
  text-align: center;
}

.title-card::before,
.title-card::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(128, 128, 128, 0.25); /* Espessura e cor da linha */
  margin: 0 10px; /* Espaço entre a linha e o texto */
}


</style>