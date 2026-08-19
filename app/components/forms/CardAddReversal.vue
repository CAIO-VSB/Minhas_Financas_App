<script setup lang="ts">

    import type { TMovementCreditCard } from "~~/types/credit_card/TMovementCreditCard"
    import type { TCreditCard } from "~~/types/credit_card/TCredit-card"
    import type { TMovementCreditCardPayload } from "~~/schemas/movementCreditCard.schema"
    import { useValidateFields } from "~/composables/useValidateFields"
    import CurrencyInput from "~/components/ui/CurrencyInput.vue"
    import { useHttpCreditsCards } from "~/composables/useHttp/useHttpCreditCard"
    import { useInvalidate } from "~/composables/useInvalidate"
    import { useHttpMovementCreditCard } from "~/composables/useHttp/useHttpMovementCreditCard"
    import { useValidateSchemas } from "~/composables/useValidateSchema"
    

    const { nameRules, selectRules, dateRules, currencyRules } = useValidateFields()
    const { getCreditCardOnlyActive } = useHttpCreditsCards()
    const { patchMovementCardById } = useHttpMovementCreditCard()
    const { invalidate } = useInvalidate()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()
    const { validateSchemaMovementsCreditCard } = useValidateSchemas()

    const props = defineProps<{
      draft: TMovementCreditCard | null,
    }>()

    const modelValue = defineModel<boolean>()

    const date = ref(`${String(new Date().getFullYear())}-${String(new Date().getMonth() + 1)}`)
    const menu = ref(false)
    const menuCreditCard = ref(false)
    const selectedCard = ref<TCreditCard | null>(null)
    const movementObservation = ref("")
    const descriptionMovement = ref("")
    const form = ref()


    watch(() => props.draft, (newDraft) => {
    
      const selectCard = creditCardOnlyActive.value?.find(
        card => card.id === newDraft?.credit_card_id
      )

      if (selectCard) {
        descriptionMovement.value = `Estorno - ${selectCard.name_identifier || 'Cartão de crédito'}`
      }

    })

    const { data:creditCardOnlyActive, isPending } = useQuery({
      queryKey: QUERY_KEYS.creditCards.all,
      queryFn: getCreditCardOnlyActive,
    })

    const { mutate, isPending:isPendingMovements  } = useMutation({

      mutationFn: (payload: TMovementCreditCardPayload) => patchMovementCardById(payload.id!, payload, "estorno"),

      onSuccess: () => {
        invalidate(QUERY_KEYS.movementsCreditCard.byCreditCard)
        invalidate(QUERY_KEYS.movementsCreditCard.totalInvoice)
        notifySuccess("Sucesso", "Operação realizada com sucesso", 6000)
        //emit("success")
        modelValue.value = false
      },

      onError: (error) => {
        handleErrorApplication(error.statusCode)
      },

    })

    async function submitMovement() {

        if (!props.draft?.purchase_date) {
            notifyError(
                "Data inválida",
                "Não foi possível concluir a ação porque a data informada é inválida ou está ausente.",
            )
            return
        }

        const dateFormated = dateToDateOnly(props.draft.purchase_date)

        const [year, month] = date.value.split("-").map(Number)

        try {
            
        const formValid = await form.value.validate()

        if (formValid) {

            const movementsCrediCardPayload = {
                ...props.draft,
                purchase_date: dateFormated,
                invoice_month: month,
                invoice_year: year,
                observation: movementObservation.value,
                description_reversal: descriptionMovement.value,
                status_movement: "estornada"
            }

            const resultSchema = validateSchemaMovementsCreditCard(movementsCrediCardPayload)

            if (!resultSchema.success) return

            mutate(resultSchema.data)

        }

        } catch (err) {
            notifyInfo("Erro", "Algo deu errado. Tente novamente em instantes.", 7000)
        } 
    }

    
</script>


<template>

    <div>
        <v-form ref="form" v-if="props.draft">
            <v-dialog v-model="modelValue" max-width="500">
                <v-card  title="Estornar lançamento">
                    <v-divider></v-divider>
                        <v-card-text >
                            <CurrencyInput prepend-inner-icon="mdi-cash"  input-color="#2196F3" base-color="#2196F3" color="#2196F3" :rules="currencyRules"  autocomplete="off" label="Valor*" v-model="props.draft.value_transaction" />
                        
                            <v-text-field prepend-inner-icon="mdi-pencil" :rules="nameRules" :counter="45" maxlength="45" autocomplete="name" name="name" label="Descrição*" variant="underlined" v-model="descriptionMovement">
                            </v-text-field>

                            <v-date-input prepend-inner-icon="mdi-calendar" prepend-icon="" :rules="dateRules" autocomplete="off" name="date" label="Data*" variant="underlined" v-model="props.draft.purchase_date"></v-date-input>

                            <v-select
                                autocomplete="off"
                                :loading="isPending"
                                v-model="props.draft.credit_card_id"
                                v-model:menu="menuCreditCard"
                                :items="creditCardOnlyActive"
                                item-title="name_identifier"
                                item-value="id"
                                variant="underlined"
                                label="Cartão de crédito"
                                persistent-hint
                                :rules="selectRules"
                                prepend-inner-icon="mdi-credit-card"
                                clearable
                                disabled
                                >
                                
                                <template v-slot:selection="{item}">
                                    <v-avatar style="width: 30px; height: 30px; margin-right: 12px;"> 
                                    <v-avatar :image="item.url_logo" ></v-avatar>
                                    </v-avatar>
                                    <span>{{ item.name_identifier }}</span>
                                </template>

                                <template v-slot:item="{props, item}">
                                    <v-list-item @click="selectedCard = item" v-bind="props">
                                    <template v-slot:prepend>
                                        <v-avatar :image="item.url_logo" ></v-avatar>
                                    </template>
                                    </v-list-item>
                                </template>
                            </v-select>

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
                                    ></v-text-field>
                                </template>
                                <v-month-picker
                                    v-model="date"
                                    @update:model-value="menu = false"
                                ></v-month-picker>
                            </v-menu>

                            <v-text-field class="mt-4" prepend-inner-icon="mdi-note-text" v-model="movementObservation" :counter="100" maxlength="100" autocomplete="off" label="Observação" variant="underlined"></v-text-field >

                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions >
                        <v-btn
                        class="text-none"
                        text="Fechar"
                        variant="text"
                        @click="modelValue = false"
                        ></v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                        class="text-none"
                        value="btn-salvar"
                        color="primary"
                        text="Salvar"
                        variant="flat"
                        @click="submitMovement"
                        :loading="isPendingMovements"
                        ></v-btn>
                        </v-card-actions>
                    </v-card>
            </v-dialog>
        </v-form>
    </div>

</template>