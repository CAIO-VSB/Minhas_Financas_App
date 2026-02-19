<script setup lang="ts">
  definePageMeta({
    title: "Cartões de Crédito",
    layout: "layout-dashboard",
    middleware: "session"
  })

  
  import CardAddCartao from "~/components/CardAddCartao.vue"
  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
  import { VueDatePicker } from '@vuepic/vue-datepicker';
  import { ptBR } from 'date-fns/locale';

  const { getAccounts } = useHttpAccounts()

  const { isPending, data, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })

  const items = [
    { title: 'Editar Cartão', prependIcon: 'mdi-dots-vertical', code: 'edit' }
  ]

  const showMenu = ref(false)
  const menu = ref(false)
  const modal = ref(false)
  const testeCartao = ref("")
  const logoTeste = ref("")
  const period = ref({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  })

  const monthName = computed(() => {
    const name = new Date(period.value.year, period.value.month, 1)
    return name.toLocaleString('pt-BR', { month: 'long' })
  })


  function teste(cartao: any) {
    console.log("Cartão selecionado" + JSON.stringify(cartao))
    testeCartao.value = cartao.name_bank
    logoTeste.value = cartao.url_image
    menu.value = false
  }

  function handleAddCarton() {
    modal.value = true
  }

</script>

<template>
  <div class="main-container">
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
                :prepend-avatar="logoTeste"
                >
                  {{ testeCartao  }}
                </v-list-item>
                </template>
                
                <v-card min-width="350"
                  title="Cartões ativos"
                  subtitle="Lista de cartões ativos"
                >
                  <v-divider></v-divider>
                  <v-list>
                    <v-list-item @click="teste(value)" v-for="value in data" rounded="xl" :prepend-avatar="value.url_image" :value="value" >
                      <v-list-item-title>{{ value.name_identifier }}</v-list-item-title>
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


              <CardAddCartao v-model="modal"/>

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
      <v-fab 
      :app="true" 
      color="blue" 
      icon="mdi-plus"
      title="Lançar despesas"
      >
      </v-fab>
    </div>
</template>

<style scoped lang="scss">

.main-container {
  margin: 5px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: minmax(150px, 0.75fr) minmax(0, 1.5fr);
  gap: 5px;
  height: 100vh;
}

@media (max-width: 600px) {
  .main-container {
    display: grid;
    grid-template-columns: (repeat(auto-fit, minmax(350px, 2fr)));
    padding: 0 6px 0 6px;
  }
}


</style>