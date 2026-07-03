<script lang="ts" setup>

  import { useSelectedIcon, type TSelectIcon } from "~/composables/useCategorie/useSelectedIcon"

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
  { name: 'Eletrônicos', icon: 'mdi-dots-horizontal', type: 'Despesa' },
]
  const { selectIcon } = useSelectedIcon()

  const dialogFilter = ref(false)
  const radios = ref("")
  const currentRadio = ref("")
  const loading = ref(false)

  function selectdItem(data: TSelectIcon) {
    selectIcon(data)
  }

  watch(radios, (newValue: string) => {
    currentRadio.value = newValue
    dialogFilter.value = false
  })

  const modelValue = defineModel<boolean>()

</script>

<template>
  <div class="text-center pa-4">

    <v-dialog
      v-model="modelValue"
    >

      <v-card
        class="mx-auto"
      >
        <v-toolbar>
          <v-toolbar-title class="title-card">Ícone</v-toolbar-title>
        </v-toolbar>

        <v-divider></v-divider>

        <div class="icon-grid">
          <div
          v-for="item in icons"
          :key="item"
          @click="selectdItem(item)"
          class="icon-cell"
          >
          <v-icon :icon="item.icon" size="32"></v-icon>
          </div>
        </div>

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

.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 10px;
  overflow: auto;
  max-width: 100%;
  width: 348px;
  margin: 10px;
}

.icon-cell:hover {
  background-color: rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.icon-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 30px;
  transition: background-color 0.15s ease;
}

.item-text {
  font-size: 1rem;
  color: #AFB1AC;
}

@media (max-width: 820px) {
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    padding: 5px;
    overflow: auto;
    max-width: 100%;
    width: 298px;
    margin: 8px;
  }
}

@media (max-width: 380px) {
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    padding: 5px;
    overflow: auto;
    max-width: 100%;
    width: 262px;
    margin: 8px;
  }
}


::v-deep(.v-selection-control .v-label ) {
  font-size: 0.85rem;
}

::v-deep(.v-card-item .v-card-title ) {
  font-size: 1.3rem;
}
</style> 