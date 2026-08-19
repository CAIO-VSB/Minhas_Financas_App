<script setup lang="ts">

    const props = defineProps<{
        draft: TMovementCreditCardPayload | null
    }>()

    const  emit = defineEmits<{
        success: []
    }>()

    import { useInvalidate } from "~/composables/useInvalidate"
    import { useHttpRecurrence } from '~/composables/useHttp/useHttpRecurrence'
    import type { TMovementCreditCardPayload } from "~~/schemas/movementCreditCard.schema";

    const { invalidate } = useInvalidate()
    const { patchMovementsCreditCardRecurrenceById } = useHttpRecurrence()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()

    const modelValue = defineModel<boolean>()
    const editScope = ref("somente_esta")
    const dateFormated = ref("")

    watch(() => props.draft, (val) => {
        dateFormated.value = val?.purchase_date.split("-").reverse().join("/") ?? "Data inválida"
    })

    const  { mutate } = useMutation({

    mutationFn: (payload: TMovementCreditCardPayload) => patchMovementsCreditCardRecurrenceById(payload.id!, payload, editScope.value, payload.recurrence_id!),

    onSuccess: () => {
        invalidate(QUERY_KEYS.movementsCreditCard.byCreditCard)
        invalidate(QUERY_KEYS.movementsCreditCard.totalInvoice)
        notifySuccess("Sucesso", "Operação realizada com sucesso", 6000)
        emit("success")
        modelValue.value = false
        resetStates()
    },

    onError: (error) => {
        handleErrorApplication(error.statusCode)
    },

    })

    function resetStates() {
      editScope.value = "somente_esta"
      modelValue.value = false
    }

    async function submitForm() {

        if(!props.draft) {
            notifyError("Ops!", "Algo não parece certo. Confira os dados e tente novamente.")
            return
        } 

        const raw = structuredClone(toRaw(props.draft))

        const payload = {
            ...raw,
            status_movement: "deletada"
        }

        mutate(payload)
    
    }

</script>


<template >

  <div>
      <v-dialog
        transition="dialog-bottom-transition"
        width="700"
        v-model="modelValue"
      >
        <template v-slot:default="{ isActive }">
          <v-card>
            
              <template #title>
              <span>Deseja deletar esta despesa {{ props.draft?.type_recurrence}}?</span>
              </template> 

              <template #subtitle>
              <span >Atenção! Essa ação não poderá ser desfeita</span>
              </template>

              <v-divider></v-divider>

            <v-card-text class="text-display-large pa-5">
              <div class="info-transaction">
                  <div>
                      <p style="color: rgba(0, 0, 0, 0.70);;">Descrição</p>
                      <p style="color: rgba(0, 0, 0, 0.5);">{{ props.draft?.description_credit }}</p>
                  </div>

                  <div>
                      <p style="color: rgba(0, 0, 0, 0.70);">Valor</p>
                      <p style="color: rgba(0, 0, 0, 0.5);  text-align: center;">{{ formatCurrency(props.draft?.value_transaction ?? 0.00) }}</p>
                  </div>

                  <div>
                      <p style="color: rgba(0, 0, 0, 0.70);">Data da compra</p>
                      <p style="color: rgba(0, 0, 0, 0.5);  text-align: center;">{{ dateFormated }}</p>
                  </div>
              </div> 

              <div class="info-alert">
                <div>
                    <p style="color: rgba(0, 0, 0, 0.70); margin-top: 30px;" class="font-weight-bold">Atenção! Esta é uma {{  props.draft?.type_recurrence }}. O que você deseja excluir?</p>
                </div>
                <v-radio-group v-model="editScope" hide-details class="mt-2">
                    <v-radio color="primary" label="Somente esta" value="somente_esta"></v-radio>
                    <v-radio color="primary" label="Esta, e as futuras" value="esta_futuras"></v-radio>
                    <v-radio color="primary" label="Todas as despesas, incluindo as passadas" value="todas"></v-radio>
                </v-radio-group>
              </div> 
            </v-card-text>

              <v-divider></v-divider>

              <v-card-actions style="display: flex; justify-content: space-between; margin-top: 13px;">
              <v-btn
                  text="Cancelar"
                  variant="text"
                  class="text-none "
                  @click="resetStates"
                  color="primary"
              ></v-btn>
              
              <v-btn
                  text="Deletar"
                  variant="flat"
                  class="text-none"
                  color="primary"
                  @click="submitForm"
              ></v-btn>
              </v-card-actions>
            
          </v-card>
        </template>
      </v-dialog>
  </div>


</template>

<style scoped>

.info-transaction {
    display: flex;
    gap: 10rem;
}

.info-transaction > div:nth-child(1) {
    display: flex;
    flex-direction: column;
    max-width: 240px;
    font-size: 1.1rem;
}

.info-alert {
    font-size: 1rem;
}

.info-transaction > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    max-width: 350px;
    font-size: 1.1rem;
}

.info-transaction > div:nth-child(3) {
    display: flex;
    flex-direction: column;
    max-width: 350px;
    font-size: 1.1rem;
}

</style>