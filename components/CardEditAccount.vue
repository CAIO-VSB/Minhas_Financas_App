<script lang="ts" setup>

  //Importações composables
  import { useValidateFields } from "~/composables/useValidateFields"

  //Importações components
  import DialogAddFinancialInstitution from "~/components/DialogAddFinancialInstitution.vue"
  import type { TAccount } from "~/types/account/TAccount.types"
  import { useAccountStore } from "~/store/modules/account-store"
  import { useEditItem } from "~/composables/useAccount/useEditItem"
  import { useSelectedBank } from "~/composables/useAccount/useSelectedBank"
  import { useSelectedColor } from "~/composables/useAccount/useSelectedColor"

  //Importaões logo

  const modelValue = defineModel<boolean>()

  const { nameRules, validateSchemaAccount } = useValidateFields()
  const { newAvatar, newColor, newName, newType, newUrl  } = useEditItem()
  const { dialogAddInstitution } = useSelectedBank()
  const { dialogColorPicker } = useSelectedColor()
  const accountStore = useAccountStore()

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

  const loadingSubmit = ref(false)
  const form = ref()
  const accountForm = ref<TAccount>({
    name: newName.value,
    type: newType.value,
    name_bank: newAvatar.value,
    color: newColor.value,
    urlImage: newUrl.value,
    active: true
  })


  async function handleAddAccount() {
    
    try {

      loadingSubmit.value = true

      const formValid = await form.value.validate()
      const resultSchema = validateSchemaAccount(accountForm.value)

      if (formValid) {
        if (resultSchema.success) {
          const response = await accountStore.addAccount(accountForm.value)

          if (response?.success) {
            modelValue.value = false
          }
          
        }
      }

    } catch (err) {
      console.log("Erro ao criar conta" + err)
    } finally {
      loadingSubmit.value = false
    }

  }


</script>

<template>
  <div class="text-center">
    <v-form
    @submit.prevent
    ref="form"
    >
      <v-dialog persistent v-model="modelValue" max-width="600">
        <v-card prepend-icon="mdi-plus-box" title="Editar conta">
          <v-divider></v-divider>
          <v-card-text>
            <form>
              <v-text-field
                label="Nome da conta *"
                variant="underlined"
                color="primary"
                v-model="accountForm.name"
                :rules="nameRules"
              >
              </v-text-field>

              <v-select :rules="selectRules" v-model="accountForm.type" color="primary" persistent-hint hint="Dúvidas sobre qual conta escolher? Clique no ícone de ajuda." label="Tipo *" :items="items" variant="underlined">
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
                    <v-avatar :image="accountForm.urlImage"></v-avatar>
                  </template>

                  <DialogAddFinancialInstitution v-model="dialogAddInstitution" />
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
                  <template  #prepend-inner>
                    <v-avatar style="margin-right: 30px;" :color="accountForm.color"  ></v-avatar>
                  </template>

                  <DialogAddColor v-model="dialogColorPicker" />
              </v-text-field>

              <v-switch
                v-model="accountForm.active"
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
              text="Salvar"
              variant="tonal"
              :loading="loadingSubmit"
              @click="handleAddAccount"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>

  </div>
</template>


<style lang="scss" scoped>


.icon-add-logo:hover {
  background-color: rgba(128, 128, 128, 0.267);
  border-radius: 60%;
}

::v-deep(.v-field__field) {
  align-items: center;
  font-family: "Poppins", sans-serif;
}

::v-deep(.v-card-title) {
  align-items: center;
  font-family: "Poppins", sans-serif;
}


</style>
