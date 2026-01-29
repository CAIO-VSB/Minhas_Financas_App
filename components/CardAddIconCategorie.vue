<script lang="ts" setup>

  import { useSelectedIcon } from "~/composables/useCategorie/useSelectedIcon"

  // Lista contendo todos os bancos, value e tipo 
  const icons = [
  // ========== RECEITAS ==========
  { name: '13º Salário', icon: 'mdi-cash-multiple', type: 'Receita' },
  { name: 'FGTS', icon: 'mdi-bank', type: 'Receita' },
  { name: 'Mesada', icon: 'mdi-account-cash', type: 'Receita' },
  { name: 'Cashback', icon: 'mdi-cash-refund', type: 'Receita' },
  { name: 'Pensão', icon: 'mdi-hand-coin', type: 'Receita' },
  { name: 'Herança', icon: 'mdi-treasure-chest', type: 'Receita' },
  { name: 'Restituição IR', icon: 'mdi-file-document-refresh', type: 'Receita' },
  { name: 'Prêmio Loteria', icon: 'mdi-trophy-variant', type: 'Receita' },
  { name: 'Empréstimo Recebido', icon: 'mdi-arrow-down-bold-circle', type: 'Receita' },
  { name: 'Auxílio', icon: 'mdi-hand-heart-outline', type: 'Receita' },
  { name: 'Hora Extra', icon: 'mdi-clock-plus', type: 'Receita' },
  { name: 'PLR', icon: 'mdi-currency-usd', type: 'Receita' },
  { name: 'Royalties', icon: 'mdi-crown', type: 'Receita' },
  { name: 'Consultoria', icon: 'mdi-account-tie', type: 'Receita' },
  { name: 'Doação Recebida', icon: 'mdi-charity', type: 'Receita' },
  { name: 'Reembolso Médico', icon: 'mdi-medical-bag', type: 'Receita' },
  { name: 'Gorjeta', icon: 'mdi-hand-coin-outline', type: 'Receita' },
  { name: 'Vale Alimentação', icon: 'mdi-food-apple', type: 'Receita' },
  { name: 'Pensão por Morte', icon: 'mdi-account-heart', type: 'Receita' },
  { name: 'Patrocínio', icon: 'mdi-handshake', type: 'Receita' },

  // ========== DESPESAS ==========
  { name: 'Pets', icon: 'mdi-paw', type: 'Despesa' },
  { name: 'Beleza', icon: 'mdi-lipstick', type: 'Despesa' },
  { name: 'Presentes', icon: 'mdi-gift', type: 'Despesa' },
  { name: 'Streaming', icon: 'mdi-netflix', type: 'Despesa' },
  { name: 'Academia', icon: 'mdi-dumbbell', type: 'Despesa' },
  { name: 'Viagem', icon: 'mdi-airplane', type: 'Despesa' },
  { name: 'Telefone/Internet', icon: 'mdi-wifi', type: 'Despesa' },
  { name: 'Vestuário', icon: 'mdi-tshirt-crew', type: 'Despesa' },
  { name: 'Restaurante', icon: 'mdi-silverware-fork-knife', type: 'Despesa' },
  { name: 'Manutenção Casa', icon: 'mdi-hammer-wrench', type: 'Despesa' },
  { name: 'Delivery', icon: 'mdi-moped', type: 'Despesa' },
  { name: 'Gás/Água/Luz', icon: 'mdi-water-pump', type: 'Despesa' },
  { name: 'Condomínio', icon: 'mdi-office-building', type: 'Despesa' },
  { name: 'Empréstimo', icon: 'mdi-bank-transfer', type: 'Despesa' },
  { name: 'Cartão de Crédito', icon: 'mdi-credit-card', type: 'Despesa' },
  { name: 'Farmácia', icon: 'mdi-pill', type: 'Despesa' },
  { name: 'Combustível', icon: 'mdi-gas-station', type: 'Despesa' },
  { name: 'Uber/Transporte', icon: 'mdi-taxi', type: 'Despesa' },
  { name: 'Cabeleireiro', icon: 'mdi-content-cut', type: 'Despesa' },
  { name: 'Eletrônicos', icon: 'mdi-cellphone', type: 'Despesa' },
]
  const { selectdIcon } = useSelectedIcon()

  const dialogFilter = ref(false)
  const valueEntered = ref("")
  const radios = ref("")
  const currentRadio = ref("")
  const loading = ref(false)

  function selectdItem(icon: string) {
    selectdIcon(icon)
  }

  watch(radios, (newValue: string) => {
    currentRadio.value = newValue
    dialogFilter.value = false
  })

  watch(valueEntered, () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 2000);
  })

  const finalData = computed(() => {
    return icons.filter(item => {
      const onlyText = item.name.toLowerCase().includes(valueEntered.value.toLowerCase())
      const onlyRadio = item.type.toLowerCase().includes(currentRadio.value.toLowerCase())
      return onlyText && onlyRadio
    })
  })

  const modelValue = defineModel<boolean>()

</script>

<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="modelValue"
      max-width="600"
      min-height="600"
    >

      <v-card
        class="mx-auto"
        max-width="450"
        max-height="620"
      >
        <v-toolbar>
          <v-toolbar-title class="title-card">Selecione um ícone de identificação</v-toolbar-title>
        </v-toolbar>

        <div>
            <v-text-field
                color="blue"
                :loading="loading"
                label="Buscar…"
                class="!p-4"
                prepend-inner-icon="mdi-magnify"
                v-model="valueEntered"
                hint="Dica: Os ícones servem como referência visual. Selecione aquele que melhor representa a categoria que você está criando."
                persistent-hint
            >

            <template #append-inner>
                <v-btn
                text="Fechar"
                icon="mdi-filter"
                variant="text"
                @click="dialogFilter = true"
                >
                </v-btn>
            </template>
            </v-text-field>
        </div>

        <v-divider></v-divider>

        <v-list
          lines="two"
          item-props
          activatable
          >
        
          <v-list-item
            v-for="(item, i) in finalData"
            :key="i"
            rounded="xl"
            @click="selectdItem(item.icon)"
          >

          <template v-slot:prepend>
            <v-icon :icon="item.icon" size="35"></v-icon>
          </template>

          <v-list-item-title class="item-text">{{ item.name }}</v-list-item-title>
          
          </v-list-item>

        </v-list>
    </v-card>

  </v-dialog>

  <v-dialog
      v-model="dialogFilter"
      max-width="250"
    >
      <v-card title="Filtro">
    
        <v-divider></v-divider>

        <v-radio-group v-model="radios">
          <v-radio label="Receitas" value="Despesa" ></v-radio>
          <v-radio label="Despesas" value="Receita"></v-radio>
        </v-radio-group>

      </v-card>
    </v-dialog>

  </div>

</template>

<style scoped>

.container-icons {
  padding: 5px;
  height: 100vh;
}

.item-text {
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  color: #AFB1AC;
}

.title-card {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
}

::v-deep(.v-selection-control .v-label ) {
  font-family: "Poppins", sans-serif;
  font-size: 0.85rem;
}

::v-deep(.v-card-item .v-card-title ) {
  font-family: "Poppins", sans-serif;
  font-size: 1.3rem;
}
</style> 