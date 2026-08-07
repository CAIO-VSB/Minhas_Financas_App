<script setup lang="ts">
  import { useHttpCreditsCards } from "~/composables/useHttp/useHttpCreditCard"
  import type { TCreditCard } from "~~/types/credit_card/TCredit-card";

  const { getCreditCardOnlyActive, patchCreditCardById, getCreditCardOnlyDisable } = useHttpCreditsCards()

  const { data:allCreditCard, isPending } = useQuery({
    queryKey: QUERY_KEYS.creditCards.all,
    queryFn: getCreditCardOnlyActive,
  })

  // const { data:allDeactivatedCrediCard, isPending: isPendingDisable } = useQuery({
  //   queryKey: QUERY_KEYS.creditCards.disable,
  //   queryFn: getCreditCardOnlyDisable,
  // })

  const props = defineProps<{
    creditCard: TCreditCard | null
  }>()

  const sumary = computed(() => {
    const row = props.creditCard
    const currentYear = new Date().getFullYear()
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0')
    const dayClosingFormated = row?.closing_day?.toString().padStart(2, '0')
    const dayDueFormated = row?.due_day?.toString().padStart(2, '0')

    return {
      limiteTotal: row?.limit_card,
      ultimosDigitos: row?.four_digits,
      fechamento: `${dayClosingFormated}/${currentMonth}/${currentYear}`,
      vencimento: `${dayDueFormated}/${currentMonth}/${currentYear}`
    }

  })


</script>

<template>
    <div class="">
        <v-card
          class="mx-auto"
          title="Detalhamento"
        >
        <v-card-text>
            <div class="d-flex flex-column ga-4">
              <div class="d-flex justify-space-between bg-backgroundPrimary">
                <span style="font-size: var(--text-base);" class="text-textSecundary">Valor a pagar</span>
                <span class="mr-2" style="font-size: var(--text-base); font-weight: 500;">R$10.0000000000</span>
              </div>
              <div class="d-flex justify-center mt-2">
                <v-btn class="text-none w-100" color="blue">
                  Fechar fatura
                </v-btn>
              </div>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex flex-column ga-4">
              <div class="d-flex justify-space-between bg-backgroundPrimary">
                <span style="font-size: var(--text-base);" class="text-textSecundary">Fechamento</span>
                <span class="mr-2" style="font-size: var(--text-base); font-weight: 500;">{{ sumary.fechamento }}</span>
              </div>
              <div class="d-flex justify-space-between ">
                <span style="font-size: var(--text-base)" class="text-textSecundary">Vencimento</span>
                <span class="mr-2" style="font-size: var(--text-base); font-weight: 500;">{{ sumary.vencimento }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span style="font-size: var(--text-base);" class="text-textSecundary">Limite total</span>
                <span class="mr-2" style="font-size: var(--text-base); font-weight: 500;">{{ formatCurrency(sumary.limiteTotal ?? 0.00) }}</span>
              </div>
              <div class="d-flex justify-space-between bg-backgroundPrimary">
                <span style="font-size: var(--text-base);" class="text-textSecundary">4 últimos dígitos </span>
                <span class="mr-2" style="font-size: var(--text-base); font-weight: 500;">{{ sumary.ultimosDigitos }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
    </div>
</template>