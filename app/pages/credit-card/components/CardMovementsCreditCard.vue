<script setup lang="ts">
  import type { TMovementCreditCard } from '~~/types/credit_card/TMovementCreditCard';
  import type { TOptionAction } from '~~/types/option_action/TOptionAction';

  const props = defineProps<{
    movementsCreditCard: TMovementCreditCard[] | null
  }>()

  const search = ref('')
  const headers = [
    { key: 'purchase_date', title: 'Data da compra' },
    { key: 'categorie_name', title: 'Categoria' },
    { key: 'description_credit', title: 'Descrição' },
    { key: 'value_transaction', title: 'Valor' },
    { key: 'actions', title: 'Ações' },
  ]

  function getOptions(creditCardMovements: TMovementCreditCard): TOptionAction [] {

    const options = [
      { title: 'Editar', value: "edit", icon: "mdi-circle-edit-outline" },
      { title: 'Deletar', value: "delete", icon: "mdi-delete-forever" },
    ]

    return options.filter(Boolean) as TOptionAction[]
  }

</script>

<template>
    <div class="">

      <v-card>
        <v-card-item>
          <v-card-title>
            <span class="title-card">Lançamentos</span>
          </v-card-title>
        </v-card-item>

        <v-card-text>
          <v-card
          flat
          >
          <template v-slot:text>
            <v-text-field
              v-model="search"
              label="Pesquisar lançamento"
              prepend-inner-icon="mdi-magnify"
              variant="underlined"
              hide-details
              single-line
            ></v-text-field>
          </template>

            <v-data-table
              :headers="headers"
              :items="movementsCreditCard ?? []"
              :search="search"
              hide-default-footer
              mobile-breakpoint="md"
            >

              <template v-slot:item.purchase_date="{item}"> 
                {{ formatDate(item.purchase_date) }}
              </template>
            
              <template v-slot:item.value_transaction="{item}">
                  <v-chip color="blue">
                      {{ formatCurrency(item.value_transaction) }}
                  </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-menu
                    transition="slide-y-transition"
                    >
                    <template v-slot:activator="{ props }">
                        <v-icon class="rounded-xl hover-icon" v-bind="props" icon="mdi-dots-vertical" size="large"></v-icon>
                    </template>
                    <v-list>
                        <v-list-item
                        v-for="action in getOptions(item)"
                        :key="action.title"
                        :value="action.value"
                        :prepend-icon="action.icon"
                        
                        >
                        <v-list-item-title>{{ action.title }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                  </v-menu>
                </template>

            </v-data-table>
          </v-card>
        </v-card-text>
      </v-card>

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

:deep(.v-data-table-header__content) {
  font-weight: 900;
  font-size: 1rem;
}


</style>