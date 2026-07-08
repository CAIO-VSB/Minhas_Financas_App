<script setup lang="ts">

  const props = defineProps<{
    colorBotton: string,
    titleBotton: string,
    title: string,
    text: string,
    draft: TMovements | null
  }>()

  const  emit = defineEmits<{
    success: []
  }>()

  import type { TMovements } from "~~/types/movements/TMovements"
  import { useInvalidate } from "~/composables/useInvalidate"
  import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'


  const { invalidate } = useInvalidate()
  const { patchMovementsById } = useHttpMovements()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()


  const modelValue = defineModel<boolean>()

  const  { mutate } = useMutation({

  mutationFn: (payload: TMovements) => patchMovementsById(payload.id!, payload),

  onSuccess: () => {
    invalidate(QUERY_KEYS.movements.all)
    invalidate(QUERY_KEYS.movements.only_expenses)
    invalidate(QUERY_KEYS.movements.only_revenues)
    invalidate(QUERY_KEYS.movements.current_balance)
    invalidate(QUERY_KEYS.accounts.getBalanceForAccount)
    invalidate(QUERY_KEYS.tranfer.all)
    emit("success")
  },

  onError: (error) => {
    handleErrorApplication(error.statusCode)
  },

})


async function submitForm() {

  if(!props.draft) {
    notifyError("Ops!", "Algo não parece certo. Confira os dados e tente novamente.")
    return
  } 

  const raw = structuredClone(toRaw(props.draft))

  const payload: TMovements = {
    ...raw
  }

  if (props.draft.type_transaction === "receita") {
    payload.is_deleted = true
    modelValue.value = false
    notifySuccess("Sucesso", "Receita deletada com sucesso", 6000)
  }
  
  if (props.draft.type_transaction === "despesa") {
    payload.is_deleted = true
    modelValue.value = false
    notifySuccess("Sucesso", "Despesa deletada com sucesso", 6000)
  }

  mutate(payload)
  
}


</script>


<template >

  <div>
      <v-dialog
        transition="dialog-bottom-transition"
        width="550"
        v-model="modelValue"
      >
        <template v-slot:default="{ isActive }">
          <v-card>
            
              <template #title>
              {{ props.title }}
              </template>

              <template #subtitle>
              {{ props.text }}
              </template>

              <v-divider></v-divider>

            <v-card-text class="text-display-large pa-5">
              <div class="info">
                  <div>
                      <p style="color: rgba(0, 0, 0, 0.70);;">Descrição</p>
                      <p style="color: rgba(0, 0, 0, 0.5);">{{ props.draft?.description_transaction }}</p>
                  </div>

                  <div>
                      <p style="color: rgba(0, 0, 0, 0.70);">Valor</p>
                      <p style="color: rgba(0, 0, 0, 0.5);  text-align: center;">{{ formatCurrency(props.draft?.value_transaction ?? 0.00) }}</p>
                  </div>
              </div> 
            </v-card-text>

              <v-divider></v-divider>

              <v-card-actions style="display: flex; justify-content: space-between; margin-top: 13px;">
              <v-btn
                  text="Cancelar"
                  variant="tonal"
                  :color="props.colorBotton"
                  class="text-none "
                  @click="isActive.value = false"
              ></v-btn>
              
              <v-btn
                  :text="props.titleBotton"
                  variant="elevated"
                  :color="props.colorBotton"
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

.info {
    display: flex;
    gap: 10rem;
}

.info > div:nth-child(1) {
    display: flex;
    flex-direction: column;
    max-width: 240px;
    font-size: 1rem;
}

.info > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    max-width: 350px;
    font-size: 1rem;
}

</style>