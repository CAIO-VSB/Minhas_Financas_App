<script setup lang="ts">

    const props = defineProps<{
    colorBotton: string,
    titleBotton: string,
    title: string,
    text: string,
    draft: TMovementCreditCardPayload | null
    }>()

    const  emit = defineEmits<{
        success: []
    }>()

    import { useInvalidate } from "~/composables/useInvalidate"
    import { useHttpMovementCreditCard } from '~/composables/useHttp/useHttpMovementCreditCard'
    import type { TMovementCreditCardPayload } from "~~/schemas/movementCreditCard.schema"; 

    const { invalidate } = useInvalidate()
    const { patchMovementCardById } = useHttpMovementCreditCard()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()

    const modelValue = defineModel<boolean>()
    const dateFormated = ref("")

    watch(() => props.draft, (val) => {
        dateFormated.value = val?.purchase_date.split("-").reverse().join("/") ?? "Data inválida"
    })

    const { mutate, isPending:isPendingMovements  } = useMutation({

      mutationFn: (payload: TMovementCreditCardPayload) => patchMovementCardById(payload.id!, payload, null),

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
        width="650"
        v-model="modelValue"
        v-if="props.draft"
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
            </v-card-text>

              <v-divider></v-divider>

              <v-card-actions style="display: flex; justify-content: space-between; margin-top: 13px;">
              <v-btn
                  text="Cancelar"
                  variant="text"
                  :color="props.colorBotton"
                  class="text-none "
                  @click="isActive.value = false"
              ></v-btn>
              
              <v-btn
                  :text="props.titleBotton"
                  variant="flat"
                  :color="props.colorBotton"
                  class="text-none"
                  @click="submitForm"
                  :loading="isPendingMovements"
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

.info > div:nth-child(3) {
    display: flex;
    flex-direction: column;
    max-width: 350px;
    font-size: 1rem;
}

</style>