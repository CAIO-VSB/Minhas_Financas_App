<script setup lang="ts">

  const props = defineProps<{
    colorBotton: string,
    titleBotton: string,
    title: string,
    text: string,
    draft: TTransferPayload | null
  }>()

  import { useInvalidate } from "~/composables/useInvalidate"
  import { useHttpTransfer } from '~/composables/useHttp/useHttpTransfer'
  import type { TTransfer } from "~~/types/transfer/TTransfer";
  import type { TTransferPayload } from "~~/schemas/transfer.schema";

  const { invalidate } = useInvalidate()
  const { deleteTransferById } = useHttpTransfer()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()

  const modelValue = defineModel<boolean>()

  const  { mutate } = useMutation({

  mutationFn: (payload: TTransferPayload) => deleteTransferById(payload.id!, payload),

  onSuccess: () => {
    invalidate(QUERY_KEYS.movements.all)
    invalidate(QUERY_KEYS.movements.only_expenses)
    invalidate(QUERY_KEYS.movements.only_revenues)
    invalidate(QUERY_KEYS.movements.current_balance)
    invalidate(QUERY_KEYS.accounts.getBalanceForAccount)
    invalidate(QUERY_KEYS.tranfer.all)
    notifySuccess("Sucesso", "Acão realizada com sucesso", 6000)
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

  const payload: TTransferPayload = {
    ...raw
  }

  if (props.draft.id) {
    payload.is_deleted = true
    mutate(payload)
    return
  }

}


</script>


<template >

  <div>
      <v-dialog
        transition="dialog-bottom-transition"
        width="450"
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
                      <p style="color: rgba(0, 0, 0, 0.70);;">De</p>
                        <v-avatar size="30">
                            <v-img :src="props.draft?.logo_origem"></v-img>
                        </v-avatar>
                      <p style="color: rgba(0, 0, 0, 0.5); text-align: center;">{{ props.draft?.account_origin_name }}</p>
                  </div>

                  <div >
                    <p style="color: rgba(0, 0, 0, 0.70);">Para</p>
                      <v-avatar size="30">
                        <v-img :src="props.draft?.logo_destino"></v-img>
                      </v-avatar>
                    <p style="color: rgba(0, 0, 0, 0.5); text-align: center;">{{ props.draft?.account_destination_name}}</p>
                  </div>

                  <div>
                      <p style="color: rgba(0, 0, 0, 0.70);">Valor</p>
                      <p style="color: rgba(0, 0, 0, 0.5); font-size: 0.90rem;"> {{ formatCurrency(props.draft?.value_transfer ?? 0)}}</p>
                  </div>
              </div> 
            </v-card-text>

              <v-divider></v-divider>

              <v-card-actions style="display: flex; justify-content: space-between; margin-top: 13px;">
              <v-btn
                  text="Cancelar"
                  variant="text"
                  :color="props.colorBotton"
                  class="text-none"
                  @click="isActive.value = false"
              ></v-btn>
              
              <v-btn
                  :text="props.titleBotton"
                  variant="flat"
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
  gap: 23px;
}

.info > div:nth-child(1) {
  display: flex;
  flex-direction: column;
  max-width: 240px;
  font-size: 0.90rem;
}

.info > div:nth-child(2) {
  display: flex;
  flex-direction: column;
  max-width: 320px;
  font-size: 0.90rem;
}

</style>