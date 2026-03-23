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
  import CardEditCard from "~/components/forms/CardEditCard.vue";

  const { getCreditCard } = useHttpCreditsCards()

  const { isPending, data, error } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: getCreditCard,
  })

  const items = [
    { title: 'Editar Cartão', prependIcon: 'mdi-dots-vertical', code: 'edit' }
  ]

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

 
  watch(data, (val) => {
    if (val?.length && !selectedCard.value) {
      selectedCard.value = val[0]?.name_identifier ?? "Selecione um cartão"
      selectdLogo.value = val[0]?.url_logo ?? ""
      selectedCardData.value = val[0] ?? null
    }
  }, {immediate: true})


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

</script>

<template>
 <v-empty-state
  v-if="data?.length === 0"
  title="Adicione um cartão de crédito"
  text="Cadastre um cartão de crédito para começar a visualizar suas faturas e acompanhar seus lançamentos."
  :image="alertImg"
  >
  <v-btn @click="modalAddCard = true" color="primary" prepend-icon="mdi-plus">
    Adicionar cartão
  </v-btn>
  </v-empty-state>
  <div v-if="data" class="main-container">
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
                    <v-list-item @click="handleSelectedCard(card)" v-for="card in data" rounded="xl"  :prepend-avatar="card.url_logo" :value="card" >
                      <v-list-item-title>{{ card.name_identifier }}</v-list-item-title>
                      <v-divider style="width: 100% !important; margin: 5px;"></v-divider>
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
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  size="30"
                  variant="text"
                  v-bind="props"
                >
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  :value="index"
                  prepend-icon="mdi-pencil"
                  @click="handleOpenModalEditCardCredit(selectedCardData!)"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
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

@media (max-width: 950px) {
  .main-container {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0 6px 0 6px;
  }
}


</style>