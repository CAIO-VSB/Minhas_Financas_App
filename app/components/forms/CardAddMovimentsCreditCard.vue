<script lang="ts" setup>
    import CurrencyInput from "~/components/ui/CurrencyInput.vue"
    import { useHttpCategories } from '~/composables/useHttp/useHttpCategories'
    import { useHttpCreditsCards } from "~/composables/useHttp/useHttpCreditCard"
    import { useHttpMovementCreditCard } from "~/composables/useHttp/useHttpMovementCreditCard.js"
    import { useValidateSchemas } from "~/composables/useValidateSchema"
    import { useValidateFields } from "~/composables/useValidateFields"
    import { useInvalidate } from "~/composables/useInvalidate"
    import CardAddCategorie from '~/components/forms/CardAddCategorie.vue'
    import type { TMovementCreditCard } from "~~/types/credit_card/TMovementCreditCard"
    import type { TRecurrence } from "~~/types/recurrence/TRecurrence"
    import { useRecurrenceStore } from "~~/store/modules/recurrence-store"
    import CardAddCreditCard from "./CardAddCreditCard.vue"
    import type { TCreditCard } from "~~/types/credit_card/TCredit-card.js"

    const { notifyError, notifyInfo, notifySuccess } = useNotify()
    const { getCategoriesOnlyActive } = useHttpCategories()
    const { getCreditCardOnlyActive } = useHttpCreditsCards()
    const { validateSchemaMovementsCreditCard } = useValidateSchemas()
    const { postMovementCreditCard } = useHttpMovementCreditCard()
    const { invalidate } = useInvalidate()
    const { nameRules, selectRules, dateRules, currencyRules } = useValidateFields()

    const recurrenceStore = useRecurrenceStore()

    const { data:categories } = useQuery({
      queryKey: QUERY_KEYS.categories.active,
      queryFn: getCategoriesOnlyActive,
    })

    const { data:creditCardOnlyActive, isPending } = useQuery({
      queryKey: QUERY_KEYS.creditCards.all,
      queryFn: getCreditCardOnlyActive,
    })

    const emit = defineEmits<{
      success: []
    }>()

    const form = ref()
    const modelValue = defineModel<boolean>()
    const modelInvoice = ref<number | null>(null)
    const menuCreditCard = ref(false)
    const modelCreditCard = ref<number | null>(null)
    const menuCategorias = ref(false)
    const modelCategorias = ref<number | null>(null)
    const searchCategorias = ref("")
    const modalAddCategorie = ref(false)
    const modalAddCreditCard = ref(false)
    const showInputParcelado = ref("")
    const showInputFixa = ref("")
    const showSwitch = ref(false)
    const creditCardData = ref<TCreditCard | null>(null)
    const modalHelpInvoice = ref(false)
    const date = ref(`${String(new Date().getFullYear())}-${String(new Date().getMonth() + 1)}`)
    const menu = ref(false)
    const updateInvoiceAutomatically = ref(false)

    const movementCreditCardForm = ref<TMovementCreditCard>({
      credit_card_id: null,
      invoice_id: null,
      categorie_id: null,
      description_credit: "",
      value_transaction: 0.00,
      purchase_date: new Date(),
      observation: "",
      status_movement: "ativa",
      invoice_month: null,
      invoice_year: null,
      refund_of_movement_id: null,
      description_reversal: null,
      status_invoice: null,
      type_recurrence: null
    })

    const recorrenceForm = ref<TRecurrence>({
      value_recurrence: 0.00,
      description_recurrence: "",
      accounts_id: null,
      categorie_id: null,
      type_recurrence: "",
      frequency_recurrence: "Meses",
      total_installments: 2,
      day_maturity: null,
      is_active: true
    })

    watch(() => [
      movementCreditCardForm.value.value_transaction,
      movementCreditCardForm.value.description_credit,
      movementCreditCardForm.value.categorie_id,
      movementCreditCardForm.value.purchase_date,
      modelCreditCard
      ] as const, ([value, description, categorie, purchase_date]) => {
      recorrenceForm.value.value_recurrence = value 
      recorrenceForm.value.description_recurrence = description
      recorrenceForm.value.categorie_id = categorie
      recorrenceForm.value.day_maturity = purchase_date
    }, {immediate: true}) 

    watch(showInputFixa, (newVal) => {
      if (newVal === 'fixa') {
        showInputParcelado.value = ""
        showSwitch.value = true
        recorrenceForm.value.type_recurrence = newVal
      } else if (newVal === 'avista') {
        showSwitch.value = false
      }
    })

    watch(showInputParcelado, (newVal) => {
      if (newVal === 'parcelada') {
        showInputFixa.value = ""
        showSwitch.value = true
        recorrenceForm.value.type_recurrence = newVal
      } else if (newVal === 'unica') {
        showInputParcelado.value = ""
        showSwitch.value = false
      }
    })

    watch(menuCategorias, (val) => {
      if (!val) searchCategorias.value = ""
    })

    watch(modelCategorias, (val) => {
      if (!val) searchCategorias.value = ""
      movementCreditCardForm.value.categorie_id = val
    })

    watch(modelCreditCard, (val) => {
      movementCreditCardForm.value.credit_card_id = val

      const selectCard = creditCardOnlyActive.value?.find(
        card => card.id === val
      )

      if (selectCard) {
        creditCardData.value = selectCard
        updateSuggestedInvoice()
      }
    })

    const filterCategorias = computed(() => {
      return categories.value?.filter(item => item.name_identifier.toLowerCase().includes(searchCategorias.value.toLowerCase()))
    })

    function resetForm() {
      showInputFixa.value = ""
      showInputParcelado.value = ""
      recorrenceForm.value.frequency_recurrence = ""
      recorrenceForm.value.total_installments = 2
      recorrenceForm.value.frequency_recurrence = "Meses"
      modelCategorias.value = null
      modelInvoice.value = null
      modelCreditCard.value = null
      movementCreditCardForm.value.categorie_id = null
      movementCreditCardForm.value.description_credit = ""
      movementCreditCardForm.value.observation = ""
      movementCreditCardForm.value.value_transaction = 0.00
      movementCreditCardForm.value.purchase_date = new Date()
      showSwitch.value = false
    }

    function resetFormAndCloseModal() {
      showInputFixa.value = ""
      showInputParcelado.value = ""
      recorrenceForm.value.frequency_recurrence = ""
      recorrenceForm.value.total_installments = 2
      recorrenceForm.value.frequency_recurrence = "Meses"
      modelCategorias.value = null
      modelInvoice.value = null
      modelCreditCard.value = null
      movementCreditCardForm.value.categorie_id = null
      movementCreditCardForm.value.description_credit = ""
      movementCreditCardForm.value.observation = ""
      movementCreditCardForm.value.value_transaction = 0.00
      movementCreditCardForm.value.purchase_date = new Date()
      showSwitch.value = false
      modelValue.value = false
    }

    function handleOpenModalAddCategorie() {
      modalAddCategorie.value = true
    }

    function handleOpenModalAddCreditCard() {
      modalAddCreditCard.value = true
    }

    function salveCreditCardDate(data: TCreditCard) {
      creditCardData.value = data
    }

    function updateSuggestedInvoice() {
      const purchaseDate = movementCreditCardForm.value.purchase_date
      const closingDay = creditCardData.value?.closing_day

      if (!purchaseDate || !closingDay){
        return
      }

      const result = calculateInvoiceMonth(
        new Date(purchaseDate),
        closingDay ?? 0
      )

      updateInvoiceAutomatically.value = true

      console.log("Ta caindo aqui?")

      date.value = `${result.year}-${String(result.month).padStart(2, "0")}`

      nextTick(() => {
        updateInvoiceAutomatically.value = false
      })
    }

    watch(() => movementCreditCardForm.value.purchase_date, () => {
      console.log("E aqui? Ta caindo????????????")
      updateSuggestedInvoice()
    })


    function handleInvoiceManualChange() {
      if (updateInvoiceAutomatically.value) {
        return
      }

      menu.value = false
    }

    const { mutate:mutateMovements, isPending:isPendingMovements  } = useMutation({

      mutationFn: postMovementCreditCard,

      onSuccess: () => {
        invalidate(QUERY_KEYS.movementsCreditCard.byCreditCard)
        invalidate(QUERY_KEYS.movementsCreditCard.totalInvoice)
        notifySuccess("Sucesso", "Operação realizada com sucesso", 6000)
        resetForm()
        emit("success")
      },

      onError: (error) => {
        handleErrorApplication(error.statusCode)
      },

    })

  async function submitMovement(options: {closeAfterSave: boolean}) {

    if (!movementCreditCardForm.value.purchase_date) {
      notifyError(
        "Data inválida",
        "Não foi possível concluir a ação porque a data informada é inválida ou está ausente.",
      )
      return
    }

    if (!recorrenceForm.value.total_installments) {
      notifyError(
        "Total de parcelas inválido",
        "Não foi possível concluir a ação porque o total de parcela é inválido ou está ausente.",
      )
      return
    }

    if (recorrenceForm.value.total_installments >= 100) {
      notifyError("Atenção", "A quantidade de parcelas não pode exceder 100.", 7000)
      return
    }

    const dateFormated = dateToDateOnly(movementCreditCardForm.value.purchase_date)

    const [year, month] = date.value.split("-").map(Number)

    try {
      const formValid = await form.value.validate()

      if (formValid) {

        const movementsCrediCardPayload = {
          ...movementCreditCardForm.value,
          purchase_date: dateFormated,
          credit_cards_id: modelCreditCard.value,
          closingDay: creditCardData.value?.closing_day,
          invoice_month: month,
          invoice_year: year,
        }

        const recurrencePayload = {
          ...recorrenceForm.value,
          day_maturity: movementCreditCardForm.value.purchase_date
        }

        const resultSchema = validateSchemaMovementsCreditCard(movementsCrediCardPayload)
        if (!resultSchema.success) return

        if (showInputFixa.value || showInputParcelado.value) {
          await recurrenceStore.movementsCreditCardFormated(movementCreditCardForm.value, recurrencePayload)
          invalidate(QUERY_KEYS.movementsCreditCard.byCreditCard)
          invalidate(QUERY_KEYS.movementsCreditCard.totalInvoice)
          notifySuccess("Sucesso", "Operação realizada com sucesso", 6000)
          emit("success")
        } else {
          mutateMovements(resultSchema.data)
          console.log('Caiu aqui???????????????')
        } 

        resetForm()
          if (options.closeAfterSave) {
            modelValue.value = false
          }
        }

    } catch (err) {
      notifyInfo("Erro", "Algo deu errado. Tente novamente em instantes.", 7000)
    } 

  }


</script>

<template>


  <div class="text-center">
    <v-form
    @submit.prevent
    ref="form"
    validate-on="lazy blur"
    >
      <v-dialog v-model="modelValue" max-width="650">
        <v-card title="Nova despesa cartão de crédito">
          <v-divider></v-divider>
          <v-card-text>
            <v-row density="comfortable">
              <v-col
              dense cols="12" md="6" sm="12"
              >
              <CurrencyInput prepend-inner-icon="mdi-cash" :rules="currencyRules" autocomplete="off" label="Valor*" v-model="movementCreditCardForm.value_transaction" />
              </v-col>

              <v-col
              cols="12" md="6" sm="12"
              >
              <v-date-input prepend-inner-icon="mdi-calendar" prepend-icon="" :rules="dateRules" autocomplete="off" name="date" label="Data*" variant="underlined" v-model="movementCreditCardForm.purchase_date"></v-date-input>
              </v-col>
              
              <v-col
              cols="12" md="12" sm="12"
              >
              <v-text-field prepend-inner-icon="mdi-pencil"  prepend-icon="" :rules="nameRules" :counter="45" maxlength="45"  autocomplete="name" name="name" label="Descrição*" variant="underlined" v-model="movementCreditCardForm.description_credit"></v-text-field>
              </v-col>

              <v-col
              cols="12" md="12" sm="12"
              >
              <v-select
                autocomplete="off"
                :loading="isPendingMovements"
                v-model="modelCategorias"
                v-model:menu="menuCategorias"
                :items="filterCategorias"
                item-title="name_identifier"
                item-value="id"
                variant="underlined"
                label="Categoria*"
                persistent-hint
                :rules="selectRules"
                prepend-inner-icon="mdi-shape"
                clearable
                >
                  <template #append-inner>
                    <v-tooltip
                    activator="parent"
                    location="top"
                    >Nova categoria</v-tooltip>
                    <v-icon @click.stop="handleOpenModalAddCategorie" class="button-hover" icon="mdi-plus-box"></v-icon>
                  </template>
                  
                  <template v-slot:selection="{item}">
                    <v-avatar style="width: 30px; height: 30px; margin-right: 12px;"> 
                      <v-avatar :icon="item.url_icon"></v-avatar>
                    </v-avatar>
                    <span>{{ item.name_identifier }}</span>
                  </template>

                  <template v-slot:item="{props, item}">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar :icon="item.url_icon"></v-avatar>
                      </template>
                    </v-list-item>
                  </template>

                  <template v-slot:prepend-item>
                    <div class="pa-2 border-b">
                      <v-text-field
                        v-model="searchCategorias"
                        :error="!!searchCategorias && !filterCategorias?.length"
                        density="compact"
                        placeholder="Buscar..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        @click.stop
                        @keydown.stop
                        @mousedown.stop
                        hide-details="auto"
                      >                 
                    </v-text-field>
                    </div>
                  </template>
                </v-select>
              </v-col>

              <v-col
              cols="12" md="12" sm="12"
              >
              <v-select
                autocomplete="off"
                :loading="isPendingMovements"
                v-model="modelCreditCard"
                v-model:menu="menuCreditCard"
                :items="creditCardOnlyActive"
                item-title="name_identifier"
                item-value="id"
                variant="underlined"
                label="Cartão de crédito*"
                persistent-hint
                :rules="selectRules"
                prepend-inner-icon="mdi-credit-card"
                clearable
                >
                  <template #append-inner>
                    <v-tooltip
                    activator="parent"
                    location="top"
                    >Novo cartão de crédito</v-tooltip>
                    <v-icon @click.stop="handleOpenModalAddCreditCard" class="button-hover" icon="mdi-plus-box"></v-icon>
                  </template>
                  
                  <template v-slot:selection="{item}">
                    <v-avatar style="width: 30px; height: 30px; margin-right: 12px;"> 
                      <v-avatar :image="item.url_logo" ></v-avatar>
                    </v-avatar>
                    <span>{{ item.name_identifier }}</span>
                  </template>

                  <template v-slot:item="{props, item}">
                    <v-list-item @click="salveCreditCardDate(item)" v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar :image="item.url_logo" ></v-avatar>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

                <v-col
                cols="12" md="12" sm="12"
                >
                  <v-text-field prepend-inner-icon="mdi-note-text" v-model="movementCreditCardForm.observation" :counter="100" maxlength="100" autocomplete="off" label="Observação" variant="underlined"></v-text-field >
                </v-col>

                
              <v-col cols="12" md="12" sm="12">
                  <v-menu
                      v-model="menu"
                      :close-on-content-click="false"
                      min-width="auto"
                      transition="scale-transition"
                      >
                      <template v-slot:activator="{ props: activatorProps }">
                          <v-text-field
                          v-model="date"
                          label="Fatura"
                          prepend-inner-icon="mdi-calendar"
                          hide-details
                          readonly
                          v-bind="activatorProps"
                          variant="underlined"
                          >
                          </v-text-field>
                      </template>
                      <v-month-picker
                          v-model="date"
                          @update:model-value="handleInvoiceManualChange"
                      ></v-month-picker>
                  </v-menu>
                </v-col>

                <div class="d-flex ga-3 options-footer">
                  <v-switch
                    v-model="showInputFixa"
                    color="error"
                    label="Despesa fixa"
                    hide-details
                    false-value="avista"
                    true-value="fixa"
                    true-icon="mdi-pin"
                    false-icon="mdi-close"
                  ></v-switch> 
                  <v-switch
                    v-model="showInputParcelado"
                    color="error"
                    label="Despesa parcelada"
                    hide-details
                    false-value="unica"
                    true-value="parcelada"
                    true-icon="mdi-repeat"
                    false-icon="mdi-close"
                  ></v-switch> 
                  <div class="d-flex align-center">
                    <v-tooltip location="top" open-on-click>
                      <template v-slot:activator="{ props }">
                          <v-icon v-bind="props" icon="mdi-help-circle" size="25" class="ml-1" style="cursor: pointer;"></v-icon>
                      </template>
                      Ao marcar como fixa, serão geradas as próximas 12 ocorrências, para melhor previsibilidade e controle. Após esse período, você poderá renovar a recorrência.
                  </v-tooltip>
                  </div>
                </div>

                <v-col
                  cols="12" md="6" sm="6" class="mt-3"
                  >
                  <v-number-input
                  v-if="showInputParcelado"
                  v-model="recorrenceForm.total_installments"
                  density="compact"
                  variant="underlined"
                  controlVariant="default"
                  :min="2"
                  :max="100"
                  label="Número de parcelas*"
                  :hideInput="false"
                  inset
                ></v-number-input>
                </v-col>

                <v-col
                  cols="12" md="6" sm="6" class="mt-3"
                  >
                  <v-select
                  v-if="showInputParcelado"
                  v-model="recorrenceForm.frequency_recurrence"
                  label="Periodicidade*"
                  density="compact"
                  :items="['Meses']"
                  variant="underlined"
                  readonly
                ></v-select>
                </v-col>

            </v-row>

            <small class="text-caption text-medium-emphasis"
              >* Indica campos obrigatórios</small
            >
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions >
            <v-btn
              class="text-none"
              text="Fechar"
              variant="text"
              @click="resetFormAndCloseModal"
            ></v-btn>
            <v-spacer></v-spacer>
            <v-btn
              class="text-none"
              value="btn-criar"
              color="primary"
              text="Salvar e criar nova"
              variant="outlined"
              :loading="isPendingMovements"
              @click="submitMovement({closeAfterSave: false})"
            ></v-btn>
            <v-btn
              class="text-none"
              value="btn-salvar"
              color="primary"
              text="Salvar"
              variant="flat"
              :loading="isPendingMovements"
              @click="submitMovement({closeAfterSave: true})"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>

    <div style="position: absolute;">
      <CardAddCategorie v-model="modalAddCategorie"/>
      <CardAddCreditCard v-model="modalAddCreditCard" />
    </div>

  </div>
</template>

<style  scoped>

.icon-add-logo:hover {
  background-color: rgba(128, 128, 128, 0.562);
  border-radius: 60%;
}

.button-hover:hover {
  background-color: rgba(255, 255, 255, 0.418);
  transform: scale(1.1); /* Efeito de zoom */
  transition: 0.3s; /* Transição suave */
}

@media (max-width: 680px) {
  .options-footer {
    flex-direction: column;
  }
}

</style>
