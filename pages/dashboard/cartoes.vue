<script setup lang="ts">

definePageMeta({
  title: "Cartões de Crédito",
  layout: "layout-dashboard"
})

  const menuItems = [
    { title: 'Editar Cartão', prependIcon: 'mdi-pencil', code: 'edit' }
  ]

  const showMenu = ref(false)
  const menuTarget = ref(null)

  import { VueDatePicker } from "@vuepic/vue-datepicker"
  import { ptBR } from "date-fns/locale"

    const month = ref({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  import CardAddCartao from "~/components/CardAddCartao.vue"

  const cartaoSelecionado = ref("")
  const imgSelecionada = ref<unknown>(null)
  const menu = ref(false)
  const semprePuxarcartao = ref("Cartão inter")
  const modal = ref(false)

  
  async function show (evt) {
    if (showMenu.value) {
      showMenu.value = false
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    menuTarget.value = evt.target.closest('.v-btn')
    showMenu.value = true
  }

  function addCarton() {
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
                :prepend-avatar="imgSelecionada"
                >

                {{ cartaoSelecionado || semprePuxarcartao}}

                </v-list-item>
                </template>
                <v-card min-width="350"
                  title="Cartões ativos"
                  subtitle="Lista de cartões ativos"
                >
                  <v-divider></v-divider>
                  <v-list>
                    <v-list-item  rounded="xl" @click="selecionarCartao('Banco Nubank')" value="nu" :prepend-avatar="nuImg">
                      <v-list-item-title>Cartão nubank</v-list-item-title>
                    </v-list-item>
                  </v-list>

                  <v-list>
                    <v-list-item   rounded="xl" @click="selecionarCartao('Banco Inter')" value="inter" :prepend-avatar="interImg">
                      <v-list-item-title>Cartão inter</v-list-item-title>
                    </v-list-item>
                  </v-list>

                  <v-list>
                    <v-list-item   rounded="xl" @click="selecionarCartao('Banco do Brasil')" value="brasil" :prepend-avatar="brasilImg">
                      <v-list-item-title>Cartão brasil</v-list-item-title>
                    </v-list-item>
                  </v-list>

                  <v-divider></v-divider>

                  <v-list>
                    <v-list-item
                      prepend-icon="mdi-plus"
                      title="Adicionar novo cartão"
                      value="new"
                      @click="addCarton"
                    >
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>

              <div>
                <label for="teste">Fatura mês {{ month.month }}</label>
                <VueDatePicker :formats="{ month: 'LLLL' }" v-model="month" month-picker :teleport="true" :locale="ptBR" />
              </div>

              <Teleport v-if="modal" to="body">
                <CardAddCartao v-model="modal"/>
              </Teleport>
            
            </div>
        
          <div class="text-center">
            <v-btn
            icon="mdi-dots-vertical"
            variant="text"
            @click="show"
            >
            </v-btn>
              <v-tooltip
              activator="parent"
              location="end"
              >
              Opções
            </v-tooltip>
            <v-menu
              v-model="showMenu"
              :offset="[-8,-12]"
              :target="menuTarget"
              location="bottom end"
              scroll-strategy="close"
            >
              <v-list
                :items="menuItems"
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
          title="Icons"
        >
          <v-card-text>Terá as informações do cartão</v-card-text>
        </v-card>
      </div>
    </div>


    <div class="">

      <v-card>
        <v-card-item>
          <v-card-title>
            Titlo
          </v-card-title>

          <v-card-subtitle>
            sub tituloe se tiver
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
    grid-template-columns: (repeat(auto-fit, minmax(200px, 2fr)));
  }
}


</style>