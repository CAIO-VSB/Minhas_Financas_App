<script lang="ts" setup>

  //Importações composables
  import { useValidateFields } from "~/composables/useValidateFields"

  //Importações components
  import DialogAddFinancialInstitution from "~/components/forms/DialogAddFinancialInstitution.vue"
  import DialogAddColor from "~/components/forms/DialogAddColor.vue"
  import type { TAccount } from "~~/types/account/TAccount.types"
  import { useSelectedBank } from "~/composables/useAccount/useSelectedBank"
  import { useSelectedColor } from "~/composables/useAccount/useSelectedColor"
  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
  import { useValidateSchemas } from "~/composables/useValidateSchema"
  import { useInvalidate } from "~/composables/useInvalidate"
  import CurrencyInput from "~/components/ui/CurrencyInput.vue"

  const { patchAccount } = useHttpAccounts()

  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { nameRules} = useValidateFields()
  const { validateSchemaAccount  } = useValidateSchemas()
  const { dialogAddInstitution, selectedBank } = useSelectedBank()
  const { dialogColorPicker, selectedColor } = useSelectedColor()
  const { invalidate } = useInvalidate()

  const modelValue = defineModel<boolean>()
  const form = ref()
  const dialog = ref(false)
  const newInitialBalance = ref()
  const props = defineProps<{
    draft: TAccount | null
  }>()

  const selectRules = ref([
    (val: string) => !!val || "Tipo de conta é obrigatório"
  ])

  const logoRules = ref([
    (val: string) => !!val || "Logo é obrigatório"
  ])

  const colorRules = ref([
    (val: string) => !!val || "Cor de identificação é obrigatório"
  ])

  const items = ref([
    'Corrente',
    'Poupança',
    'NuConta',
    'Conta Salário',
    'Conta de Pagamento',
    'Conta Digital',
    'Conta de Investimentos'
  ])


  const  { mutate, isPending } = useMutation({

    mutationFn: patchAccount,

    onSuccess: () => {
      notifySuccess("Sucesso", "Conta editada com sucesso", 6000)
      invalidate(QUERY_KEYS.accounts.all)
      invalidate(QUERY_KEYS.accounts.getBalanceForAccount)
      modelValue.value = false
    },

    onError: (error) => {
      notifyError("😢", "Ops! Algo deu errado ao editar a conta. Tente novamente ou entre em contato com o suporte. Detalhes: " + error.message)
    },

  })

  watch(selectedBank, (bank) => {
    if (props.draft !== null && bank !== null) {
      props.draft.name_bank = bank.name
      props.draft.url_image = bank.url
    }
  })

  watch (selectedColor, (color) => {
    if (props.draft !== null && color !== null) {
      props.draft.color = color
    }
  })

  watch(() => props.draft, (newValue) => {
    newInitialBalance.value = newValue?.initial_balance
  })

  async function handleEditAccount() {
    
    if (props.draft?.initial_balance != newInitialBalance.value) {
      dialog.value= true
      return
    }

    await submitForm()
   
  }

  function handleConfirmDialog() {
    dialog.value = false
    submitForm()
  }

  async function submitForm() {

    try {

      if(!props.draft) {
        notifyError("Ops!", "Algo não parece certo. Confira os dados e tente novamente.")
        return
      }

      const formValid = await form.value.validate()
      const resultSchema = validateSchemaAccount(props.draft)

      console.log("Valor envidado", toRaw(props.draft))

      if (formValid) {
        if (resultSchema.success) {
          if(props.draft)
          mutate(props.draft)
        }
      }
      
    } catch (err) {
      console.log("Erro ao criar conta" + err)
    } 

  }


</script>

<template>

  <div class="text-center">

    <div class="text-center pa-4">
    <v-dialog
      v-model="dialog"
      max-width="400"
      persistent
    >

      <v-card
        style="white-space: pre-line;"
        prepend-icon="mdi-alert"
        text="Você está prestes a alterar o saldo inicial desta conta. Essa ação impacta diretamente todos os cálculos financeiros, incluindo o saldo atual, balanço mensal e relatórios anteriores.

        💡 Dica: Se o seu saldo está incorreto por causa de uma movimentação esquecida, considere lançar uma receita ou despesa de ajuste. Assim você mantém seu histórico financeiro íntegro e organizado."    
        title="Leia com atenção!"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn  @click="dialog = false">
            Cancelar
          </v-btn>

          <v-btn @click="handleConfirmDialog">
            Confirmar
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>

    <v-form
    @submit.prevent
    ref="form"
    v-if="props.draft"
    >
      <v-dialog persistent v-model="modelValue" max-width="600">
        <v-card prepend-icon="mdi mdi-pencil-box" title="Editar conta">
          <v-divider></v-divider>
          <v-card-text>
            <form>

              <CurrencyInput  autocomplete="off" hint="Salo lançado no ato do cadastro" v-model="props.draft.initial_balance" label="Saldo inicial" ></CurrencyInput>

              <v-text-field
                label="Nome da conta *"
                variant="underlined"
                color="primary"
                v-model="props.draft.name_identifier"
                :rules="nameRules"
              >
              </v-text-field>

              <v-select :rules="selectRules" v-model="props.draft.type_account" color="primary" persistent-hint hint="Dúvidas sobre qual conta escolher? Clique no ícone de ajuda." label="Tipo *" :items="items" variant="underlined">
                <template v-slot:append>
                  <nuxt-link target="_blank" to="https://www.serasa.com.br/blog/conta-bancaria/">
                    <v-icon class="cursor-pointer" color="info" icon="mdi-chat-question" size="large"></v-icon>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    >Se não tiver certeza de qual conta escolher, clique no ícone de ajuda — lá você encontrará uma explicação simples e objetiva sobre cada opção disponível.
                    </v-tooltip>
                  </nuxt-link>
                </template>
              </v-select>

              <v-text-field  :rules="logoRules" persistent-hint hint="Logo de identifiação *"   color="primary"  v-model="props.draft.name_bank" readonly variant="underlined">
                <template v-slot:append>
                    <v-icon @click="dialogAddInstitution = true" class="cursor-pointer icon-add-logo"  icon="mdi-plus" size="large"></v-icon>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    > Adicionar logo
                    </v-tooltip>
                  </template>
                  <template  #prepend-inner>
                    <v-avatar style="margin-right: 30px;" :image="props.draft.url_image"></v-avatar>
                  </template>
              </v-text-field>

              <v-text-field  :rules="colorRules" persistent-hint hint="Cor de identifiação" color="primary" v-model="props.draft.color" readonly variant="underlined">
                <template v-slot:append>
                    <v-icon @click="dialogColorPicker = true" class="cursor-pointer icon-add-logo"  icon="mdi-eyedropper-variant" size="large"></v-icon>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    > Adicionar cor
                    </v-tooltip>
                  </template>
                  <template  #prepend-inner>
                    <v-avatar style="margin-right: 30px;" :color="props.draft.color"  ></v-avatar>
                  </template>
                  
              </v-text-field>

              <v-switch
                v-model="props.draft.active"
                color="success"
                label="Ativo"
                hide-details
              ></v-switch>

            </form>

            <small class="text-caption text-medium-emphasis"
              >* Indica campos obrigatórios</small
            >
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Fechar"
              variant="plain"
              @click="modelValue = false"
            ></v-btn>

            <v-btn
              color="primary"
              text="Editar"
              variant="tonal"
              :loading="isPending"
              @click="handleEditAccount"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>

    <DialogAddFinancialInstitution v-model="dialogAddInstitution" />
    <DialogAddColor v-model="dialogColorPicker" />
  </div>
</template>


<style lang="scss" scoped>


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
