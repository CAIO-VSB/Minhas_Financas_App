<script setup lang="ts">

    const props = defineProps<{
        draft: TMovementsPayload | null
    }>()

    const  emit = defineEmits<{
        success: []
    }>()

    import { useInvalidate } from "~/composables/useInvalidate"
    import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'
    import type { TMovementsPayload } from "~~/schemas/movements.schema";

    const { invalidate } = useInvalidate()
    const { deleteMovementsRecurrenceById } = useHttpMovements()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()

    const modelValue = defineModel<boolean>()
    const editScope = ref("somente_esta")

    const  { mutate } = useMutation({

    mutationFn: (payload: TMovementsPayload) => deleteMovementsRecurrenceById(payload.id!, payload, editScope.value, payload.recurrence_id!),

    onSuccess: () => {
        invalidate(QUERY_KEYS.movements.all)
        invalidate(QUERY_KEYS.movements.only_expenses)
        invalidate(QUERY_KEYS.movements.only_revenues)
        invalidate(QUERY_KEYS.movements.current_balance)
        invalidate(QUERY_KEYS.accounts.getBalanceForAccount)
        notifySuccess(
        "Sucesso",
        "Operação realizada com sucesso.",
        5000
        )
        resetStates()
        emit("success")
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
            ...raw
        }

        mutate(payload)
    
    }

</script>


<template >

  <div>
      <v-dialog
        transition="dialog-bottom-transition"
        width="610"
        v-model="modelValue"
      >
        <template v-slot:default="{ isActive }">
          <v-card>
            
              <template #title>
              <span>Deseja deletar esta {{ props.draft?.type_transaction === 'despesa' ? 'despesa' : 'receita' }}?</span>
              </template>

              <template #subtitle>
              <span>Atenção! Essa ação não poderá ser desfeita</span>
              </template>

              <v-divider></v-divider>

            <v-card-text class="text-display-large pa-5">
              <div class="info-transaction">
                  <div>
                      <p style="color: rgba(0, 0, 0, 0.70);;">Descrição</p>
                      <p style="color: rgba(0, 0, 0, 0.5);">{{ props.draft?.description_transaction }}</p>
                  </div>

                  <div>
                      <p style="color: rgba(0, 0, 0, 0.70);">Valor</p>
                      <p style="color: rgba(0, 0, 0, 0.5);  text-align: center;">{{ formatCurrency(props.draft?.value_transaction ?? 0.00) }}</p>
                  </div>
              </div> 

              <div class="info-alert">
                <div>
                    <p style="color: rgba(0, 0, 0, 0.70); margin-top: 30px;" class="font-weight-bold">Atenção! Esta é uma {{  props.draft?.type_transaction === 'despesa' ? 'despesa' : 'receita'  }} {{ props.draft?.type_recurrence === 'fixa' ? 'fixa' : 'parcelada'  }}. O que você deseja excluir?</p>
                </div>
                <v-radio-group v-model="editScope" hide-details class="mt-2">
                    <v-radio :color="props.draft?.type_transaction === 'despesa' ? 'red' : 'green'" label="Somente esta" value="somente_esta"></v-radio>
                    <v-radio :color="props.draft?.type_transaction === 'despesa' ? 'red' : 'green'" label="Todas as pendentes" value="pendentes"></v-radio>
                    <v-radio :color="props.draft?.type_transaction === 'despesa' ? 'red' : 'green'" label="Todas (incluindo efetivadas)" value="todas"></v-radio>
                </v-radio-group>
              </div> 
            </v-card-text>

              <v-divider></v-divider>

              <v-card-actions style="display: flex; justify-content: space-between; margin-top: 13px;">
              <v-btn
                  text="Cancelar"
                  variant="text"
                  :color="props.draft?.type_transaction === 'despesa' ? 'red' : 'green'"
                  class="text-none "
                  @click="resetStates"
              ></v-btn>
              
              <v-btn
                  text="Deletar"
                  variant="elevated"
                  :color="props.draft?.type_transaction === 'despesa' ? 'red' : 'green'"
                  class="text-none"
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
    font-size: 1rem;
}

.info-transaction > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    max-width: 350px;
    font-size: 1rem;
}

</style>