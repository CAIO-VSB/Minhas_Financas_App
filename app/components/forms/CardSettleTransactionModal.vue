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

  import CurrencyInput from "~/components/ui/CurrencyInput.vue"

  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
  import { useValidateFields } from "~/composables/useValidateFields"
  import { useInvalidate } from "~/composables/useInvalidate"
  import { useHttpMovements } from '~/composables/useHttp/useHttpMovements'

  import type { TMovements } from "~~/types/movements/TMovements"

  const modelValue = defineModel<boolean>()

  const { getAccountsOnlyActive } = useHttpAccounts()
  const { selectRules, dateRules, currencyRules } = useValidateFields()
  const { invalidate } = useInvalidate()
  const { patchMovements } = useHttpMovements()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()

  const searchAccounts = ref("")
  const modelAccounts = ref<number | null>(null)
  const menuAccounts = ref(false)
  const buttonSubmitDisabled = ref(false)

  const { data:accounts } = useQuery({
    queryKey: QUERY_KEYS.accounts.active,
    queryFn: getAccountsOnlyActive,
  })

    //Watch reponsável por mostrar a categoria e conta atual
  watch(() => props.draft, (newDraft) => {
    console.log("Valor que chegou", newDraft)
    if (newDraft) {
      modelAccounts.value = newDraft.accounts_id ?? null
    }
  }, {immediate: true})

  //Watch responsável por atualizar a conta escolhida pelo usário no ato da edição
  watch(modelAccounts, (val) => {
    if (props.draft) props.draft.accounts_id = val
  })

  const showButtonSubmit = computed(() => {
    
    if (props.draft?.value_transaction === 0) {
      buttonSubmitDisabled.value = true
    } else {
      buttonSubmitDisabled.value = false
    }

  })

  const filterAccounts = computed(() => {
    return accounts.value?.filter(item => item.name_identifier.toLowerCase().includes(searchAccounts.value?.toLowerCase() ?? ''))
  })

  const  { mutate } = useMutation({

    mutationFn: (payload: TMovements) => patchMovements(payload),

    onSuccess: () => {
      invalidate(QUERY_KEYS.movements.all)
      invalidate(QUERY_KEYS.movements.only_expenses)
      invalidate(QUERY_KEYS.movements.only_revenues)
      invalidate(QUERY_KEYS.movements.current_balance)
      invalidate(QUERY_KEYS.accounts.getBalanceForAccount)
      emit("success")
    },

    onError: (error) => {
      notifyInfo("Atenção", `Erro ao editar transação. Tente novamente mais tarde ou contate o surpote técnico. Erro detalhado: ${error.message}`)
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

    if (props.draft.type_transaction === "Receita") {
      payload.status_transaction = "recebido"
      modelValue.value = false
      notifySuccess("Sucesso", "Receita efetivada com sucesso", 6000)
    }
   
    if (props.draft.type_transaction === "Despesa") {
      payload.status_transaction = "pago"
      modelValue.value = false
      notifySuccess("Sucesso", "Despesa efetivada com sucesso", 6000)
    }

    mutate(payload)
    
  }

</script>


<template >

  <div>
      <v-dialog
        transition="dialog-bottom-transition"
        width="500"
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

            <v-card-text class="text-display-large pa-3">
              <v-form
              ref="form"
              v-if="props.draft"
              >

                <CurrencyInput @keyup="showButtonSubmit"  :rules="currencyRules"  prepend-inner-icon="mdi-calculator" autocomplete="off" label="Valor" v-model="props.draft.value_transaction" />

                <v-date-input :rules="dateRules" prepend-inner-icon="mdi-calendar-range"  autocomplete="off" name="date" prepend-icon="" label="Data" variant="underlined" v-model="props.draft.date_transaction"></v-date-input>

                <v-select
                v-model="modelAccounts"
                v-model:menu="menuAccounts"
                :items="filterAccounts"
                :rules="selectRules"
                item-title="name_identifier"
                item-value="id"
                variant="underlined"
                label="Conta"
                persistent-hint
                autocomplete="off"
                prepend-inner-icon="mdi-bank-circle"
              >

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

                <template v-slot:prepend-item>
                  <div class="pa-2 border-b">
                    <v-text-field
                      v-model="searchAccounts"
                      :error="!!searchAccounts && !filterAccounts?.length"
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

              </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions style="display: flex; justify-content: space-between; margin-top: 13px;">
              <v-btn
                text="Cancelar"
                variant="outlined"
                :color="props.colorBotton"
                class="text-none rounded-xl button-singup"
                @click="isActive.value = false"
              ></v-btn>
              
              <v-btn
                :text="props.titleBotton"
                variant="elevated"
                :color="props.colorBotton"
                class="text-none rounded-xl button-singup"
                :disabled="buttonSubmitDisabled"
                @click="submitForm"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
  </div>

</template>

<style scoped>

</style>