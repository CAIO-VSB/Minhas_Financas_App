<script lang="ts" setup>

  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
  import banks from "~~/shared/banks/catalog"
  import type { TCreditCard } from "~~/types/credit_card/TCredit-card"
  import CurrencyInput from "~/components/ui/CurrencyInput.vue"
  import { useHttpCreditsCards } from "~/composables/useHttp/useHttpCreditCard"
  import { useValidateSchemas } from "~/composables/useValidateSchema"
  import { useValidateFields } from "~/composables/useValidateFields"


  const { getAccounts } = useHttpAccounts()
  const { patchCreditCard } = useHttpCreditsCards()
  const { validateShemaCrediCard } = useValidateSchemas()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { nameRules } = useValidateFields()

  const form = ref()
  const searchAccounts = ref("")
  const searchLogos = ref("")
  const modelAccounts = ref<number | null>(null)
  const menuAccounts = ref(false)
  const modelLogos = ref<string | null>("")
  const menuLogos = ref(false)
  const modelValue = defineModel<boolean>()
  const queryClient = useQueryClient()

  const props = defineProps<{
    draft: TCreditCard | null
  }>()

  const { data, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })

  const fourDigitsRules = ref([
    (val: string) => !!val || "Campo obrigatório",
    (val: string) => val.length <= 4 || "O valor deve conter no máximo 4 caracteres",
    (val: string) => /^[0-9]+$/.test(val) || "Informe apenas números"
  ])

  const dueDayRules = ref([
    (val: number) => !!val || "Campo obrigatório"
  ])

  const closingDayRules = ref([
    (val: number) => !!val || "Campo obrigatório"
  ])

  const accountDebitRules = ref([
    (val: string) => !!val || "Campo obrigatório"
  ])

  const logoCreditCardRules = ref([
    (val: string) => !!val || "Campo obrigatório"
  ])

  /**
   * Observa a mudança do menu, e com base no status, ele limpa o campo de pesquisa
   * @param menuAccounts
   */
  watch(menuAccounts, (val) => {
    if (!val) searchAccounts.value = ""
  })

  watch(menuLogos, (val) => {
    if (!val) searchLogos.value = ""
  })

  watch(() => props.draft, (val) => {
    if (val) {
      modelAccounts.value = val.accounts_id ?? null
      modelLogos.value = val.url_logo ?? ""
    }
  }, {immediate: true})

  /**
   * Responsavel por filtrar as contas com base no valor digitado pelo usuario
   * @returns Retorna os dados já filtrados
   */
  const filterAccounts = computed(() => {
    return data.value?.filter(item => item.name_identifier.toLowerCase().includes(searchAccounts.value?.toLowerCase() ?? ''))
  })

  const filterLogos = computed(() => {
    return banks.filter(item => item.text.toLowerCase().includes(searchLogos.value.toLowerCase()))
  })

  const  { mutate, isPending  } = useMutation({
    
    mutationFn: patchCreditCard,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
      notifySuccess("Sucesso", "Cartão de crédito editado com sucesso", 6000)
      modelValue.value = false
    },

    onError: (error) => {
      notifyError("Ops!", `Erro ao editar ${error.message}`)
    },

  })

  async function handleEditCreditCard() {

    try {

      if (!props.draft) {
        notifyError("Ops!", "Algo não parece certo. Confira os dados e tente novamente.")
        return
      }


      const formValid = await form.value.validate()
      const resultSchema = validateShemaCrediCard(props.draft)

      console.log("Obejto a ser enviado no componente" + JSON.stringify(props.draft))

      if (formValid) {
        if (!props.draft.four_digits || props.draft.four_digits.length < 4) {
          notifyInfo("Atenção", "Digite os 4 últimos dígitos do cartão.", 5000)
        }
        if (resultSchema.success) {  
          mutate(props.draft)
        }
      }

    } catch (error) {
      notifyInfo("Erro", "Erro ao criar cartão de crédito " + error)
    }
  
}

  
</script>

<template>
    <v-form
    @submit.prevent
    ref="form"
    v-if="props.draft"
    >
    <v-dialog
      v-model="modelValue"
      max-width="600"

    >
      <v-card
        prepend-icon="mdi-plus-circle"
        title="Novo cartão de crédito"
      >
        <v-card-text>
          <v-row dense>

            <v-col
              cols="12"
              md="12"
              sm="12"
            >
              <v-text-field
                label="Nome do cartão de crédito*"
                variant="underlined"
                :rules="nameRules"
                v-model="props.draft.name_identifier"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
            >
              <CurrencyInput v-model="props.draft.limit_card" label="Limite" />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
            >
              <v-text-field
                label="Últimos 4 dígitos*"
                variant="underlined"
                hint="Ajuda a diferenciar este cartão quando você possui vários cadastrados"
                persistent-hint
                isent
                counter
                :rules="fourDigitsRules"
                v-model="props.draft.four_digits"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="6"
              sm="6"
            >
              <v-number-input
                label="Dia do fechamento*"
                variant="underlined"
                maxlength="2"
                :max="31"
                :min="1"
                :rules="dueDayRules"
                isent
                v-model="props.draft.due_day"
              ></v-number-input>
            </v-col>

            <v-col
              cols="12"
              md="6"
              sm="6"
            >
              <v-number-input
                label="Dia do vencimento*"
                variant="underlined"
                isent
                maxlength="2"
                :max="31"
                :min="1"
                :rules="closingDayRules"
                v-model="props.draft.closing_day"
              ></v-number-input>
            </v-col>

            <v-col
              cols="12"
              sm="12"
            >
             <v-select
                v-model="props.draft.accounts_id"
                v-model:menu="menuAccounts"
                :items="filterAccounts"
                :rules="accountDebitRules"
                item-title="name_identifier"
                item-value="id"
                clearable
                variant="underlined"
                label="Conta vinculada*"
                hint="Os débitos do cartão serão debitados desta conta"
                persistent-hint
              >
                <template v-slot:selection="{item}">
                  <v-avatar  style="width: 30px; height: 30px; margin-right: 12px;"> 
                    <v-img  :src="item.raw.url_image" :alt="item.raw.name_identifier"></v-img>
                  </v-avatar>
                  <span>{{ item.raw.name_identifier }}</span>
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
                      clearable
                      @click.stop
                      @keydown.stop
                      @mousedown.stop
                      hide-details
                    >                 
                  </v-text-field>
                  </div>
                </template>

                <template v-slot:append-item>
                  <div class="d-flex align-center pa-2 pl-4 border-t">
                    <span v-if="searchAccounts" class="text-body-2">
                      {{ filterAccounts?.length }} resultado encontrados de {{ data?.length }}
                    </span>
                  </div>
                </template>
              </v-select>
            </v-col>

            <v-col
              cols="12"
              sm="12"
            >
              <v-select
                v-model="props.draft.url_logo"
                v-model:menu="menuLogos"
                :items="filterLogos"
                item-title="text"
                item-value="url"
                clearable
                variant="underlined"
                label="Logo*"
                hint="Logo de identificação"
                persistent-hint
                :rules="logoCreditCardRules"
              >
                <template v-slot:selection="{item}">
                  <v-avatar style="width: 30px; height: 30px; margin-right: 12px;"> 
                    <v-img :src="item.raw.url" :alt="item.raw.text"></v-img>
                  </v-avatar>
                  <span>{{ item.raw.text }}</span>
                </template>

                <template v-slot:item="{props, item}">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-avatar>
                        <v-img :src="item.raw.url" :alt="item.raw.text"></v-img>
                      </v-avatar>
                    </template>
                  </v-list-item>
                </template>

                <template v-slot:prepend-item>
                  <div class="pa-2 border-b">
                    <v-text-field
                      v-model="searchLogos"
                      :error="!!searchLogos && !filterLogos?.length"
                      density="compact"
                      placeholder="Buscar..."
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      clearable
                      @click.stop
                      @keydown.stop
                      @mousedown.stop
                      hide-details
                    >                 
                  </v-text-field>
                  </div>
                </template>

                <template v-slot:append-item>
                  <div class="d-flex align-center pa-2 pl-4 border-t">
                    <span v-if="searchLogos" class="text-body-2">
                      {{ filterLogos?.length }} resultado encontrados de {{ data?.length }}
                    </span>
                  </div>
                </template>
              </v-select>
            </v-col>
          </v-row>
        
          <v-switch
            color="success"
            label="Ativo"
            hide-details
            v-model="props.draft.active"
          ></v-switch>

          <small class="text-caption text-medium-emphasis">* Indica campos obrigatórios</small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Cancelar"
            variant="plain"
            @click="modelValue = false"
          ></v-btn>

          <v-btn
            color="primary"
            text="Editar"
            variant="tonal"
            :loading="isPending"
            @click="handleEditCreditCard"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-form>
</template>
