<script setup lang="ts">
  definePageMeta({
    title: "Cartões de Crédito",
    layout: "layout-dashboard",
    middleware: "session"
  })

  import alertImg from "~/assets/img-credit-card-alert.png"
  import CardAddCartao from "~/components/forms/CardAddCreditCard.vue"
  import { useHttpCreditsCards } from "~/composables/useHttp/useHttpCreditCard"
  import { useHttpMovementCreditCard } from "~/composables/useHttp/useHttpMovementCreditCard"
  import BaseFab from "~/components/ui/BaseFab.vue";
  import type { TCreditCard } from "~~/types/credit_card/TCredit-card"
  import CardEditCard from "~/components/forms/CardEditCreditCard.vue";
  import { useInvalidate } from "~/composables/useInvalidate"
  import type { TOptionAction } from "~~/types/option_action/TOptionAction";
  import CardInfoCreditCard from "~/pages/credit-card/components/CardInfoCreditCard.vue";
  import CardMovementsCreditCard from "~/pages/credit-card/components/CardMovementsCreditCard.vue";
  import DateInput from '~/components/ui/DateInput.vue'
  import CardAddMovimentsCreditCard from "~/components/forms/CardAddMovimentsCreditCard.vue";
  import type { TPeriod } from "~~/types/period/TPeriod"

  const { getCreditCardOnlyActive, patchCreditCardById, getCreditCardOnlyDisable } = useHttpCreditsCards()
  const { getByCreditCard, getTotalInvoice } = useHttpMovementCreditCard()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { invalidate } = useInvalidate()

  const { data:allCreditCard, isPending } = useQuery({
    queryKey: QUERY_KEYS.creditCards.all,
    queryFn: getCreditCardOnlyActive,
  })

  const { data:allDeactivatedCrediCard, isPending: isPendingDisable } = useQuery({
    queryKey: QUERY_KEYS.creditCards.disable,
    queryFn: getCreditCardOnlyDisable,
  })

  const showMenu = ref(false)
  const menu = ref(false)
  const modalAddCard = ref(false)
  const modalEditCard = ref(false)
  const modalAddMovementCreditCard = ref(false)
  const editDraft = ref<TCreditCard | null>(null)
  const selectedCardData = ref<TCreditCard | null>(null)
  const selectedCard = ref("")
  const selectdLogo = ref("")

  const period = ref({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  })

  const { data:dataByCreditCard, isPending: isPendingByCreditCard, refetch  } = useQuery({
    queryKey: QUERY_KEYS.movementsCreditCard.byCreditCard,
    queryFn: () => getByCreditCard(period.value.month, period.value.year, selectedCardData.value?.id ?? 0),
    enabled: computed(() => !!selectedCardData.value?.id)
  })

  const { data:totalInvoice, isPending: isPendingTotalInvoice, refetch: refetchTotalInvoice } = useQuery({
    queryKey: computed(() => [
      ...QUERY_KEYS.movementsCreditCard.totalInvoice,
      selectedCardData.value?.id,
      period.value.month,
      period.value.year
    ]),
    queryFn: () => getTotalInvoice(period.value.month, period.value.year, selectedCardData.value?.id ?? 0),
    enabled: computed(() => !!selectedCardData.value?.id)
  })

  const  { mutate } = useMutation({

  mutationFn: (payload: TCreditCard) => patchCreditCardById(payload.id!, payload),

  onSuccess: () => {
    invalidate(QUERY_KEYS.creditCards.all)
    invalidate(QUERY_KEYS.creditCards.disable)
  },

  onError: (error) => {
    handleErrorApplication(error.data)
  },

  })
 
  /**
   * Watch responsável por escutar as mudanças nos dados vindo do banco de dados
   * Sempre que mudar algum dado e existir valor, buscamos pelo id e setamos o novos valores
   */
  watch(allCreditCard, (val) => {
    if (val?.length) {
      //Sempre atualizar o selectedCardData com os dados mais recentes
      const current = val.find(item => item.id === selectedCardData.value?.id) ?? val[0]
      selectedCard.value = current?.name_identifier ?? ""
      selectdLogo.value = current?.url_logo ?? ""
      selectedCardData.value = current ?? null
      editDraft.value = current ?? null
    }
  }, {immediate: true})

  const totalForInvoice = computed(() => totalInvoice.value?.total ?? 0)

  const valueLimitedUsed = computed(() => {
    return calcuteLimitedUsed(totalForInvoice.value, selectedCardData.value?.limit_card ?? 0)
  })

  const showAlertLimitedUsed = computed(() => valueLimitedUsed.value >= 85)

  function getOptions(creditCard: TCreditCard): TOptionAction [] {
    return [
      {title: "Editar", icon: "mdi-lead-pencil", value: "edit"},
      {
        title: creditCard.active ? "Inativar" : "Ativar",
        icon: creditCard.active ? "mdi-minus-circle-off" : "mdi-check-circle",
        value: creditCard.active ? false : true
      },
      { title: 'Adicionar novo cartão', icon: 'mdi-plus-circle', value: "new" }
    ]
  }

  function handleGetPeriod(value: TPeriod) {
    console.log("Período recebido do DateInput:", value)
    period.value = value
    refetch()
    refetchTotalInvoice()
  }

  function handleSelectedCard(card: TCreditCard) {
    selectedCard.value = card.name_identifier ?? ""
    selectdLogo.value = card.url_logo ?? ""
    selectedCardData.value = card 
    menu.value = false
    editDraft.value = structuredClone(toRaw(card))
    handleGetPeriod(period.value)
  }

  function handleOpenModalEditCardCredit(creditCard: TCreditCard) {
    modalEditCard.value = true
    editDraft.value = structuredClone(toRaw(creditCard))
  }

  function handleAddCarton() {
    modalAddCard.value = true
  }

  function handleOptionClick(option:TOptionAction, data: TCreditCard) {

    if (option.value === "edit") {
      handleOpenModalEditCardCredit(data)
      return
    }

    if (option.value === "new") {
      handleAddCarton()
      return
    }

    const payload = structuredClone(toRaw(data))

    if (typeof option.value === "boolean") {
      payload.active = option.value
      notifySuccess("Sucesso", "Operação realizada com sucesso", 6000)
    }

    mutate(payload)
   
  }

</script>

<template>
 <v-empty-state
  v-if="!isPending && !isPendingDisable && !allCreditCard?.length && !allDeactivatedCrediCard?.length"
  title="Adicione um cartão de crédito"
  text="Cadastre um cartão de crédito para começar a visualizar suas faturas e acompanhar seus lançamentos."
  :image="alertImg"
  >
  <v-btn @click="modalAddCard = true" color="primary" prepend-icon="mdi-plus">
    Adicionar cartão
  </v-btn>

  </v-empty-state>

  <div v-if=" !isPending && !isPendingDisable && (allCreditCard?.length || allDeactivatedCrediCard?.length)" class="main-container">
    <div class="container-side-left">
      <div>
        <v-card :loading="isPending">
          <div class="flex align-baseline pa-4">
            
            <div class="flex flex-col gap-4 text-center w-full mt-5 mb-3">

              <div class="d-flex align-center ga-2">
                <v-menu
                v-model="menu"
                :close-on-content-click="false"
                location="center"
                >
                  <template  v-slot:activator="{ props }">
                  <v-list-item
                  style="border-bottom: 2px ridge #1867c0; padding: 3px; flex: 1;"
                  color="black"
                  v-bind="props"
                  :prepend-avatar="selectdLogo"
                  >
                    {{ selectedCard }}
                  </v-list-item>
                  </template>
                  
                  <v-card min-width="380"
                    title="Cartões ativos"
                    subtitle="Lista de cartões ativos"
                  >
                    <v-divider></v-divider>
                    <v-list>
                      <v-list-item @click="handleSelectedCard(card)"  v-for="card in allCreditCard" rounded="xl" :prepend-avatar="card.url_logo" :value="card" >
                        <v-list-item-title>{{ card.name_identifier }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list>
                      <v-list-item
                        prepend-icon="mdi-plus"
                        title="Adicionar novo cartão"
                        value="new"
                        @click="handleAddCarton"
                      >
                      </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <v-card v-if="allDeactivatedCrediCard?.length !== 0" subtitle="Lista de cartões desativados">
                       <v-divider></v-divider>
                      <v-list>
                      <v-list-item @click="handleSelectedCard(card)" v-for="card in allDeactivatedCrediCard" rounded="xl" :prepend-avatar="card.url_logo" :value="card" >
                        <v-list-item-title :class="{'text-disabled': !card.active}">{{ card.name_identifier }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                    </v-card>
                  </v-card>
                </v-menu>

                <v-menu v-if="selectedCardData">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      size="10"
                      variant="text"
                      v-bind="props"
                      v-tooltip="'Opções'"
                    >
                    </v-btn>
                  </template>

                  <v-list >
                    <v-list-item
                      v-for="item in getOptions(selectedCardData)"
                      :key="item.title!"
                      :value="item.title"
                      :prepend-icon="item.icon!"
                      @click="handleOptionClick(item, selectedCardData)"
                    >
                      <v-list-item-title >{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <div class="mt-4 mb-4">
                <template v-if="selectedCardData?.limit_card && selectedCardData.limit_card > 0">
                  <div class="d-flex ml-1 align-center ga-2 justify-space-between">
                  <span class="text-textSecundary">Limite Utilizado</span>
                  <small class="mr-2" style="font-weight: 600; font-size: var(--text-sm);">{{ valueLimitedUsed.toFixed() ?? 0.00 }}%</small>
                </div>
                  <v-progress-linear height="15" rounded :color="(valueLimitedUsed < 85 ? 'primary' : 'red')" class="mt-2" :model-value="valueLimitedUsed">
                  </v-progress-linear>
                  
                  <div class="d-flex justify-space-between mt-2">
                    <div class="ml-1 text-textSecundary">{{ formatCurrency(totalForInvoice ?? 0.00) }}</div>
                    <span>de</span>
                    <div class="mr-1 text-textSecundary">{{ formatCurrency(selectedCardData?.limit_card ?? 0.00) }}</div>
                  </div>
                </template>

                <template v-else>
                  <v-alert
                  type="info"
                  variant="tonal"
                  text="Cadastre um limite para acompanhar melhor seus gastos e manter suas finanças sob controle."
                ></v-alert>
                </template >

              </div>
              <v-divider></v-divider>
              <div style="margin-bottom: 12px; margin-top: 12px;">
                <DateInput @apply-filter-month="handleGetPeriod" ></DateInput>
              </div>

          </div>
        </div>

        <div class="pa-2">
          <v-alert
          v-model="showAlertLimitedUsed"
          type="warning"
          variant="tonal"
          title="Limite do cartão"
          text="Seus gastos já ultrapassaram 85% do limite disponível. Considere acompanhar as próximas compras para evitar atingir o limite."
          ></v-alert>
        </div>

      </v-card>
        
      </div>

      <div class="mt-5">
        <CardInfoCreditCard :loading="isPendingByCreditCard" :credit-card="editDraft" :total-invoice="totalForInvoice" :period="period" />
      </div>
  
    </div>

    <div >
      <CardMovementsCreditCard :movements-credit-card="dataByCreditCard ?? null"/>
    </div>

    <div class="fab-wrapper">
      <v-tooltip text="Nova despesa" location="left">
        <template #activator="{ props }">
          <BaseFab 
          v-bind="props"
          color="blue"
          icon="mdi-plus"
          size="60"
          @click="modalAddMovementCreditCard = true"
          />
        </template>
      </v-tooltip>
    </div>
    </div>

    <div>
      
      <CardAddCartao v-model="modalAddCard"/>

      <CardEditCard
      :draft="editDraft"
      v-model="modalEditCard" />

      <CardAddMovimentsCreditCard v-model="modalAddMovementCreditCard" />
      
    </div>
    
</template>

<style scoped lang="scss">

.main-container {
  margin: 5px;
  margin-right: 7px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: minmax(350px, 0.65fr) minmax(0, 1.5fr);
  gap: 10px;
}

.fab-wrapper {
  position: fixed;
  bottom: 25px;
  right: 24px;
  z-index: 9999;
}

.text-disabled {
  text-decoration: line-through;
}

@media (max-width: 1650px) {
  .main-container {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0 6px 0 6px;
  }
}


</style>