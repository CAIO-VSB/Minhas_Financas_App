<script setup lang="ts">
  definePageMeta({
    title: "Cartões de Crédito",
    layout: "layout-dashboard",
    middleware: "session"
  })

  import alertImg from "~/assets/img-credit-card-alert.png"
  import CardAddCartao from "~/components/forms/CardAddCreditCard.vue"
  import { useHttpCreditsCards } from "~/composables/useHttp/useHttpCreditCard"
  import { VueDatePicker } from '@vuepic/vue-datepicker';
  import { ptBR } from 'date-fns/locale';
  import BaseFab from "~/components/ui/BaseFab.vue";
  import type { TCreditCard } from "~~/types/credit_card/TCredit-card"
  import CardEditCard from "~/components/forms/CardEditCreditCard.vue";
  import { useInvalidate } from "~/composables/useInvalidate"
  import type { TOptionAction } from "~~/types/option_action/TOptionAction";

  const { getCreditCardOnlyActive, patchCreditCard, getCreditCardOnlyDisable } = useHttpCreditsCards()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { invalidate } = useInvalidate()

  const { data:allCreditCard } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: getCreditCardOnlyActive,
  })

  const { data:allDeactivatedCrediCard } = useQuery({
    queryKey: ['credit-cards-disable'],
    queryFn: getCreditCardOnlyDisable,
  })

  const showMenu = ref(false)
  const menu = ref(false)
  const modalAddCard = ref(false)
  const modalEditCard = ref(false)
  const editDraft = ref<TCreditCard | null>(null)
  const selectedCardData = ref<TCreditCard | null>(null)
  const selectedCard = ref("")
  const selectdLogo = ref("")
  const period = ref({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  })

  const monthName = computed(() => {
    const nameMonth = new Date(period.value.year, period.value.month, 1)
    return nameMonth.toLocaleString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() + nameMonth.toLocaleString('pt-BR', {month: 'long'}).slice(1).toLowerCase()
  })

  const  { mutate } = useMutation({

  mutationFn: (payload: TCreditCard) => patchCreditCard(payload),

  onSuccess: () => {
    invalidate("credit-cards")
    invalidate("credit-cards-disable")
    notifySuccess("Sucesso", "Cartão de crédito editado com sucesso", 6000)
  },

  onError: (error) => {
    notifyInfo("Atenção", `Erro ao edita cartão de crédito. Tente novamente mais tarde ou contate o surpote técnico. Erro detalhado: ${error.message}`)
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
    }
  }, {immediate: true})

  function getOptions(creditCard: TCreditCard): TOptionAction [] {
    return [
      {title: "Editar", icon: "mdi-lead-pencil", value: "edit"},
      {
        title: creditCard.active ? "Inativar" : "Ativar",
        icon: creditCard.active ? "mdi-minus-circle-off" : "mdi-check-circle",
        value: creditCard.active ? false : true
      },
      { title: 'Adicionar novo Cartão', icon: 'mdi-plus-circle', value: "new" }
    ]
}

  function handleSelectedCard(card: TCreditCard) {
    selectedCard.value = card.name_identifier ?? ""
    selectdLogo.value = card.url_logo ?? ""
    selectedCardData.value = card 
    menu.value = false
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
    }

    mutate(payload)
   
  }



</script>

<template>
 <v-empty-state
  v-if="allCreditCard?.length === 0"
  title="Adicione um cartão de crédito"
  text="Cadastre um cartão de crédito para começar a visualizar suas faturas e acompanhar seus lançamentos."
  :image="alertImg"
  >
  <v-btn @click="modalAddCard = true" color="primary" prepend-icon="mdi-plus">
    Adicionar cartão
  </v-btn>
  </v-empty-state>
  <div v-if="allCreditCard" class="main-container">
    <div class="container-side-left">
      <div>
        <v-card>
          <div class="flex align-baseline w-full !p-1">
            <div class=" flex flex-col gap-5 text-center w-full mt-5 mb-3">
              <v-menu
              v-model="menu"
              :close-on-content-click="false"
              location="center"
              >
                <template  v-slot:activator="{ props }">
                <v-list-item
                style="border-bottom: 1px solid black; padding: 3px; "
                color="black"
                v-bind="props"
                :prepend-avatar="selectdLogo"
                >
                  {{ selectedCard }}
                </v-list-item>
                </template>
                
                <v-card min-width="350"
                  title="Cartões ativos"
                  subtitle="Lista de cartões ativos"
                >
                  <v-divider></v-divider>
                  <v-list>
                    <v-list-item @click="handleSelectedCard(card)" v-for="card in allCreditCard" rounded="xl"  :prepend-avatar="card.url_logo" :value="card" >
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
              <div>
                <span>Período da fatura: {{ monthName }}</span>
                <VueDatePicker :teleport="true" :locale="ptBR" v-model="period" month-picker :formats="{ month: 'LLLL' }" />
              </div>

              <CardAddCartao v-model="modalAddCard"/>

              <CardEditCard
              :draft="editDraft"
              v-model="modalEditCard" />

            </div>
        
          <div class="text-center">
            <v-menu v-if="selectedCardData">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  size="30"
                  variant="text"
                  v-bind="props"
                >
                </v-btn>
              </template>

              <v-list >
                <v-list-item
                  v-for="item in getOptions(selectedCardData)"
                  :key="item.title"
                  :value="item.title"
                  :prepend-icon="item.icon"
                  @click="handleOptionClick(item, selectedCardData)"
                >
                  <v-list-item-title >{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu
            v-model="showMenu"
            location="bottom end"
            scroll-strategy="close"
            >
              <v-list
                class="py-0"
                density="compact"
                item-value="code"
                item-props
                slim
              >
                <template v-slot:prepend>
                  <v-icon class="mr-n2" size="small"></v-icon>
                </template>
              </v-list>
            </v-menu>
          </div>
        </div>
        </v-card>
        
      </div>

      <div class="!mt-20">
        <v-card
          class="mx-auto"
          prepend-icon="mdi-order-bool-descending-variant"
          title="Info do cartao"
        >
          <v-card-text>Terá as informações do cartão</v-card-text>
        </v-card>
      </div>
    </div>


    <div class="">

      <v-card>
        <v-card-item>
          <v-card-title>
            Cards de movimentaces
          </v-card-title>

          <v-card-subtitle>
            subtitle do card
          </v-card-subtitle>
        </v-card-item>

        <v-card-text>
          Histórico de movimentações
        </v-card-text>
      </v-card>

    </div>
    <div class="fab-wrapper">
      <v-tooltip text="Nova despesa" location="left">
        <template #activator="{ props }">
          <BaseFab 
          v-bind="props"
          color="blue"
          icon="mdi-plus"
          size="60"
          />
        </template>
      </v-tooltip>
    </div>
    </div>
    
</template>

<style scoped lang="scss">

.main-container {
  margin: 5px;
  margin-right: 7px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: minmax(350px, 0.65fr) minmax(0, 1.5fr);
  gap: 5px;
  height: 100vh;
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


@media (max-width: 950px) {
  .main-container {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0 6px 0 6px;
  }
}


</style>