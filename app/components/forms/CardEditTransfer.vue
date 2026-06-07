<script lang="ts" setup>

  import { useValidateFields } from "~/composables/useValidateFields"
  import { useInvalidate } from "~/composables/useInvalidate"
  import CurrencyInput from "~/components/ui/CurrencyInput.vue"
  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
  import { useHttpTransfer } from "~/composables/useHttp/useHttpTransfer"
  import { useValidateSchemas } from "~/composables/useValidateSchema" 
  import type { TTransfer } from "~~/types/transfer/TTransfer"

  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const {  selectRules, currencyRules, dateRules } = useValidateFields() 
  const { invalidate } = useInvalidate()
  const { getAccountsOnlyActive } = useHttpAccounts()
  const { patchTransfer, patchTransferById } = useHttpTransfer()
  const { validateSchemaTransfer } = useValidateSchemas()

  const props = defineProps<{
    draft: TTransfer | null
  }>()

  watch(props, (newVal) => {
    console.log("Valor para editar vindo do modal", newVal)
  })

  const form = ref()
  const modelValue = defineModel<boolean>()
  const modelAccountOrigin = ref<number | null>(null)
  const modelAccountDestination = ref<number | null>(null)
 
  const { data:accounts } = useQuery({
    queryKey: QUERY_KEYS.accounts.active,
    queryFn: getAccountsOnlyActive,
  })

  //Watch reponsável por mostrar a categoria e conta atual
  watch(() => props.draft, (newDraft) => {
    if (newDraft) {
      modelAccountOrigin.value = newDraft.account_origin ?? null
      modelAccountDestination.value = newDraft.account_destination ?? null
    }
  }, {immediate: true})

  //Watch responsável por atualizar a categoria escolhida pelo usário no ato da edição
  watch(modelAccountOrigin, (val) => {
    if (props.draft) props.draft.account_origin = val
  })

  //Watch responsável por atualizar a conta escolhida pelo usário no ato da edição
  watch(modelAccountDestination, (val) => {
    if (props.draft) props.draft.account_destination = val
  })


  watch([modelAccountOrigin, modelAccountDestination], ([origin, destination]) => {
    if (origin === destination) {
      modelAccountOrigin.value = null
    } else if (destination === origin) {
      modelAccountDestination.value = null
    }
  })

  function resetForm() {
    props.draft!.value_transfer = 0.00 
    props.draft!.observation = "" 
    modelValue.value = false
    modelAccountDestination.value = null
    modelAccountOrigin.value = null
  }

  const  { mutate, isPending  } = useMutation({

    mutationFn: (payload: TTransfer) => patchTransferById(payload.id!, payload),

    onSuccess: () => {
      invalidate(QUERY_KEYS.tranfer.all)
      invalidate(QUERY_KEYS.movements.all)
      invalidate(QUERY_KEYS.movements.current_balance)
      invalidate(QUERY_KEYS.accounts.getBalanceForAccount)
      notifySuccess("Sucesso", "Tranferência editada com sucesso", 6000)
      modelValue.value = false
      resetForm()
    },

    onError: (error) => {
      notifyError("😢", "Ops! Algo deu errado ao editar a tranferência. Tente novamente ou entre em contato com o suporte. Detalhes: " + error.message)
    },

  })

  async function handleEditTransfer() {

    try {

      if(!props.draft) {
        notifyError("Ops!", "Algo não parece certo. Confira os dados e tente novamente.")
        return
      } 
        const formValid = await form.value.validate()
        const resultSchema = validateSchemaTransfer(props.draft)

        console.log("Objeto a ser envidado" + JSON.stringify(props.draft))
        
        if (formValid) {
          if (resultSchema.success) {  
            mutate(props.draft)
          }
        }
    } catch (err) {
      notifyError("Error", "Erro ao criar tranferência. Tente novamente")
    }

  }

</script>

<template>
  <div class="text-center">
    <v-form
    @submit.prevent
    ref="form"
    validate-on="lazy blur"
    v-if="props.draft"
    >
      <v-dialog persistent v-model="modelValue" max-width="600">
        <v-card prepend-icon="mdi-swap-horizontal" title="Editar Transferência">
          <v-divider></v-divider>
          <v-card-text>
            <form>

              <CurrencyInput :rules="currencyRules" prepend-icon="mdi-cash" input-color="#2196F3" base-color="#2196F3" color="#2196F3" text-color="#2196F3" autocomplete="off" label="Valor*" v-model="props.draft.value_transfer"/>
              
              <v-date-input :rules="dateRules" v-model="props.draft.date_transfer" prepend-icon="mdi-calendar"  autocomplete="off" name="date" label="Data*" variant="underlined" ></v-date-input>

              <v-select v-model="modelAccountOrigin"  prepend-icon="mdi-bank-transfer-out" :rules="selectRules" item-value="id" item-title="name_identifier" color="primary" label="Conta origem*" :items="accounts" variant="underlined">      
                 <template v-slot:selection="{item}">
                    <v-avatar style="width: 30px; height: 30px; margin-right: 12px;"> 
                      <v-img  :src="item.raw.url_image" :alt="item.raw.name_identifier"></v-img>
                    </v-avatar>
                    <span >{{ item.raw.name_identifier }}</span>
                  </template>

                  <template v-slot:item="{props, item}">
                    <v-list-item  v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar>
                          <v-img :src="item.raw.url_image" :alt="item.raw.name_identifier"></v-img>
                        </v-avatar>
                      </template>
                    </v-list-item>
                  </template>
              </v-select>

              <v-select v-model="modelAccountDestination" prepend-icon="mdi-bank-transfer-in" :rules="selectRules" item-value="id" item-title="name_identifier"  color="primary" label="Conta destino*" :items="accounts" variant="underlined">
                 <template v-slot:selection="{item}">
                    <v-avatar style="width: 30px; height: 30px; margin-right: 12px;"> 
                      <v-img  :src="item.raw.url_image" :alt="item.raw.name_identifier"></v-img>
                    </v-avatar>
                    <span >{{ item.raw.name_identifier }}</span>
                  </template>

                  <template v-slot:item="{props, item}">
                    <v-list-item  v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar>
                          <v-img :src="item.raw.url_image" :alt="item.raw.name_identifier"></v-img>
                        </v-avatar>
                      </template>
                    </v-list-item>
                  </template>
              </v-select>

              <v-text-field v-model="props.draft.observation" prepend-icon="mdi-note-text" :counter="100" maxlength="100" autocomplete="off" label="Observação" variant="underlined"></v-text-field >

            </form>

            <small class="text-caption text-medium-emphasis"
              >* Indica campos obrigatórios</small
            >
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Cancelar"
              variant="plain"
              @click="resetForm"
            ></v-btn>

            <v-btn
              color="primary"
              text="Lançar"
              variant="tonal"
              :loading="isPending"
              @click="handleEditTransfer"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
  </div>
</template>


<style scoped>

.icon-add-logo:hover {
  background-color: rgba(128, 128, 128, 0.267);
  border-radius: 60%;
}

::v-deep(.v-field__field) {
  align-items: center;
}

::v-deep(.v-card-title) {
  align-items: center;
}


</style>
