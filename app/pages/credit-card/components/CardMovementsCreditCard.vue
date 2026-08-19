<script setup lang="ts">
  import type { TMovementCreditCard } from '~~/types/credit_card/TMovementCreditCard';
  import type { TOptionAction } from '~~/types/option_action/TOptionAction';
  import CardEditMovementCreditCard from "~/components/forms/CardEditMovementCreditCard.vue"
  import CardAddReversal from '~/components/forms/CardAddReversal.vue';
  import CardDeleteMovementCreditCard from '~/components/forms/CardDeleteMovementCreditCard.vue';
  import type { TMovementCreditCardPayload } from '~~/schemas/movementCreditCard.schema';
  import CardEditRecurrenceCreditCard from '~/components/forms/CardEditRecurrenceCreditCard.vue';
  import CardDeleteRecurrenceCreditCard from '~/components/forms/CardDeleteRecurrenceCreditCard.vue';

  const props = defineProps<{
    movementsCreditCard: TMovementCreditCard[] | null
  }>()

  const { notifyError, notifyInfo, notifySuccess } = useNotify()

  const search = ref('')
  const modalEditMovement = ref(false)
  const modalAddReversal = ref(false)
  const modalDeleteMovement = ref(false)
  const modalEditRecurrence = ref(false)
  const modalDeleteRecurrence = ref(false)
  const editDraft = ref<TMovementCreditCard | null>(null)
  const deleteDraft = ref<TMovementCreditCardPayload | null>(null)
  const shoppingActive  = ref<boolean | null>(true)

  const headers = [
    {
      align: 'center' as const,
      key: 'status_movement',
      title: 'Situação',
    },
    { key: 'purchase_date', title: 'Data da compra' },
    { key: 'categorie_name', title: 'Categoria' },
    { key: 'description_credit', title: 'Descrição' },
    { key: 'value_transaction', title: 'Valor' },
    { key: 'actions', title: 'Ações' },
  ]

  const items = computed(() => [
    shoppingActive.value ? { title: 'Mostrar compras deletadas', icon: 'mdi-delete-empty', value: 'mostrar'} : { title: 'Mostrar somente ativas', icon: 'mdi-credit-card-check', value: 'nao-mostrar'},
  ])

  function getOptions(creditCardMovements: TMovementCreditCard): TOptionAction [] {

    const options = [
      { title: 'Editar', value: "edit", icon: "mdi-circle-edit-outline" },
      { title: 'Excluir', value: "delete", icon: "mdi-delete-forever" },
      (creditCardMovements.status_movement === 'ativa' || creditCardMovements.status_movement === 'estornada') ? { title: 'Estornar', value: "estornar", icon: "mdi-arrow-u-left-bottom-bold" } : null,
    ]

    return options.filter(Boolean) as TOptionAction[]
  }

  const movementCreditCardData = computed(() => {
    if (!props.movementsCreditCard) return []

    return shoppingActive.value
    ? props.movementsCreditCard.filter(item => (item.status_movement !== 'deletada'))
    : props.movementsCreditCard
  })

  function handleShowShoopingActive(option: string) {
    shoppingActive.value = option === 'mostrar' ? false : true
  }

  function handleOptionClick(option: TOptionAction, data: TMovementCreditCard) {

    const raw = structuredClone(toRaw(data))

    if (raw.purchase_date === null) {
      notifyError("Error", "Data da compra ausente ou incorreta")
      return
    }

    const dateFormated = dateToDateOnly(raw.purchase_date)

    const payloadDeleteDraft = {
      ...raw,
      purchase_date: dateFormated,
      value_transaction: Number(raw.value_transaction ?? 0)
    }

    if (option.value === 'delete' && (data.type_recurrence === 'fixa' || data.type_recurrence === 'parcelada')) {
      console.log("Caiu aqui ?")
      modalDeleteRecurrence.value = true
      deleteDraft.value = payloadDeleteDraft
      return
    }

    if (option.value === 'edit' && (data.type_recurrence === 'fixa' || data.type_recurrence === 'parcelada')) {
      console.log("Caiu aqui ?")
      modalEditRecurrence.value = true
      const rawMovement = structuredClone(toRaw(data))
      editDraft.value = rawMovement
      return
    }

    if (option.value === 'delete') {
      modalDeleteMovement.value = true
      deleteDraft.value = payloadDeleteDraft
      return
    }

    if (option.value === 'estornar') {
      modalAddReversal.value = true
      const rawMovement = structuredClone(toRaw(data))
      editDraft.value = rawMovement
      return
    }

    if (option.value === 'edit') {
      modalEditMovement.value = true
      const rawMovement = structuredClone(toRaw(data))
      editDraft.value = rawMovement
      return
    }

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
              variant="solo-filled"
              hide-details
              single-line
              clearable
            >
            <template #append-inner>
              <v-menu
                transition="slide-y-transition"
                hide-details
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="primary"
                      v-bind="props"
                      icon="mdi-dots-vertical"
                      variant="text"
                    >
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, i) in items"
                      :key="i"
                      :value="i"
                      :prepend-icon="item.icon"
                      @click="handleShowShoopingActive(item.value)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
            </template>  
          </v-text-field>
          </template>

            <v-data-table
              :headers="headers"
              :items="movementCreditCardData || []"
              :search="search"
              hide-default-footer
              mobile-breakpoint="md"
            >

              <template v-slot:item.purchase_date="{item}"> 
                {{ formatDate(item.purchase_date) }}
              </template>
            
              <template v-slot:item.value_transaction="{item}">
                  <v-chip :color="(item.status_movement === 'ativa') ? 'green' : (item.status_movement === 'deletada') ? 'red' : 'orange'">
                      {{ formatCurrency(item.value_transaction) }}
                  </v-chip>
              </template>

              <template v-slot:item.status_movement="{item}">
                <v-icon 
                  :color="(item.status_movement === 'ativa') ? 'green' : (item.status_movement === 'deletada') ? 'red' : 'orange'"
                  :icon="(item.status_movement === 'ativa') ? 'mdi-sticker-check' : (item.status_movement === 'deletada') ? 'mdi-archive-cancel' : 'mdi-credit-card-refund'"
                  >
                </v-icon>
                <v-tooltip
                  activator="parent"
                  location="top"
                  >{{(item.status_movement === 'ativa') ? 'Compra ativa' : (item.status_movement === 'deletada') ? 'Compra deletada' : 'Compra estornada' }}
                </v-tooltip>
              </template>

              <template v-slot:item.description_credit="{ item }">
                <div class="d-flex flex-column">
                  
                  <span>
                    {{ item.description_credit }}

                    <span v-if="item.total_installments">
                      ({{ item.installment_number }} / {{ item.total_installments }})
                    </span>
                  </span>

                  <span
                    v-if="item.description_reversal"
                    class="text-error text-caption ml-4"
                  >
                    ↳ {{ item.description_reversal }}
                  </span>

                </div>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-menu
                    transition="slide-y-transition"
                    :disabled="(item.status_movement === 'deletada')"
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
                        @click="handleOptionClick(action, item)"
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
      
      <div>
        <CardEditMovementCreditCard :draft="editDraft" v-model="modalEditMovement" />
        <CardAddReversal :draft="editDraft" v-model="modalAddReversal"/>
        <CardDeleteMovementCreditCard :draft="deleteDraft" title="Deletar despesa de cartão?" text="Atenção: esta ação não pode ser desfeita." title-botton="Deletar" color-botton="primary" v-model="modalDeleteMovement" />
        <CardEditRecurrenceCreditCard :draft="editDraft" v-model="modalEditRecurrence" />
        <CardDeleteRecurrenceCreditCard :draft="deleteDraft"  v-model="modalDeleteRecurrence" />
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

:deep(.v-data-table-header__content) {
  font-weight: 900;
  font-size: 1rem;
}

.isDeleted {
  text-decoration: line-through;
}

</style>