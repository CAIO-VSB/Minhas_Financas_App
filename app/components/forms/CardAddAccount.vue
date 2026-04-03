<script lang="ts" setup>

  //Importações composables
  import { useValidateFields } from "~/composables/useValidateFields"
  import { useValidateSchemas } from "~/composables/useValidateSchema"

  //Importações components
  import type { TAccount } from "~~/types/account/TAccount.types"
  import { useSelectedBank } from "~/composables/useAccount/useSelectedBank"
  import { useSelectedColor } from "~/composables/useAccount/useSelectedColor"
  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
  import { useInvalidate } from "~/composables/useInvalidate"
  import DialogAddColor from "~/components/forms/DialogAddColor.vue"
  import BaseModal from "~/components/ui/BaseModal.vue"
  import DialogAddFinancialInstitution from "~/components/forms/DialogAddFinancialInstitution.vue"
  

  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { nameRules, } = useValidateFields()
  const { dialogAddInstitution, selectedBank } = useSelectedBank()
  const { dialogColorPicker, selectedColor } = useSelectedColor()
  const { validateSchemaAccount } = useValidateSchemas()
  const { postAccount } = useHttpAccounts()
  const { invalidate } = useInvalidate()
  

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

  const form = ref()

  const modelValue = defineModel<boolean>()

  const accountForm = ref<TAccount>({
    name_identifier: "",
    type_account: "",
    name_bank: "",
    color: "",
    url_image: "",
    active: true
  })


  watch(selectedBank, (bank) => {
    if (bank !== null) {
      accountForm.value.name_bank  = bank.name
      accountForm.value.url_image = bank.url
      console.log("Cor chegando" + JSON.stringify(bank))
    } else {
      accountForm.value.url_image = ""
      accountForm.value.name_bank = ""
    }
  })

  watch (selectedColor, (color) => {
    if (color !== null) {
      accountForm.value.color = color
      console.log("Cor chegando" + JSON.stringify(color))
    }
  })

  function resetForm() {
    accountForm.value.name_identifier = ""
    accountForm.value.url_image = ""
    accountForm.value.type_account = ""
    accountForm.value.url_image = ""
    accountForm.value.color = ""
    modelValue.value = false
  }

  const  { mutate, isPending  } = useMutation({
    
    mutationFn: postAccount,

    onSuccess: () => {
      invalidate("accounts")
      notifySuccess("Sucesso", "Conta criada com sucesso", 6000)
      resetForm()
      modelValue.value = false
    },

    onError: (error) => {
      notifyError("😢", "Ops! Algo deu errado ao salvar a conta. Tente novamente ou entre em contato com o suporte. Detalhes: " + error.message)
    },

  })

  async function handleAddAccount() {
    
    try {
      const formValid = await form.value.validate()
      const resultSchema = validateSchemaAccount(accountForm.value)

      console.log("Objeto a ser envidado" + JSON.stringify(accountForm.value))
      
      if (formValid) {
        if (resultSchema.success) {  
          mutate(accountForm.value)
        }
      }
    } catch (err) {
      notifyInfo("Error", "Erro ao criar conta bancária" + err)
    } 
  }


</script>

<template>
  <div class="text-center">
    <v-form
    @submit.prevent
    ref="form"
    >
      <v-dialog  v-model="modelValue" max-width="600">
        <v-card prepend-icon="mdi-plus-box" title="Nova Conta">
          <v-divider></v-divider>
          <v-card-text>
              <v-text-field
                label="Nome da conta *"
                variant="underlined"
                color="primary"
                name="name"
                autocomplete="name"
                v-model="accountForm.name_identifier"
                :rules="nameRules"
              >
              </v-text-field>

              <v-select :rules="selectRules" v-model="accountForm.type_account" color="primary" persistent-hint hint="Dúvidas sobre qual conta escolher? Clique no ícone de ajuda." label="Tipo *" :items="items" variant="underlined">
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

              <v-text-field  :rules="logoRules" persistent-hint hint="Logo de identifiação *"   color="primary"  v-model="accountForm.name_bank" readonly variant="underlined">
                <template v-slot:append>
                    <v-icon @click="dialogAddInstitution = true" class="cursor-pointer icon-add-logo"  icon="mdi-plus" size="large"></v-icon>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    > Adicionar logo
                    </v-tooltip>
                  </template>
                  <template  #prepend-inner>
                    <v-avatar style="margin-right: 30px;" :image="accountForm.url_image" ></v-avatar>
                  </template>
              </v-text-field>

              <v-text-field :rules="colorRules" persistent-hint hint="Cor de identifiação" color="primary" v-model="accountForm.color" readonly variant="underlined">
                <template v-slot:append>
                    <v-icon @click="dialogColorPicker = true" class="cursor-pointer icon-add-logo"  icon="mdi-eyedropper-variant" size="large"></v-icon>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    > Adicionar cor
                    </v-tooltip>
                  </template>
                   <template #append-inner>
                    <v-icon @click="dialogColorPicker = true" class="cursor-pointer icon-add-logo"  icon="mdi-help-circle" size="large"></v-icon>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    > Dúvidas sobre como escolher a cor? Basta selecionar a cor desejada e clicar fora da janela para finalizar a escolha.
                    </v-tooltip>
                  </template>
                  <template  #prepend-inner>
                    <v-avatar  :color="accountForm.color" style="margin-right: 30px;" ></v-avatar>
                  </template>
              </v-text-field>

              <v-switch
                v-model="accountForm.active"
                color="success"
                label="Ativo"
                hide-details
              ></v-switch>

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
              @click="resetForm"
            ></v-btn>

            <v-btn
              color="primary"
              text="Salvar"
              variant="tonal"
              :loading="isPending"
              @click="handleAddAccount"
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
