<script lang="ts" setup>


  import CurrencyInput from "~/components/ui/CurrencyInput.vue"

  import { useHttpCategories } from '~/composables/useHttp/useHttpCategories'
  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
  import { useHttpMovements } from "~/composables/useHttp/useHttpMovements"

  import { useValidateSchemas } from "~/composables/useValidateSchema"
  import { useValidateFields } from "~/composables/useValidateFields"
  import { useInvalidate } from "~/composables/useInvalidate"

  import CardAddCategorie from '~/components/forms/CardAddCategorie.vue'
  import CardAddAccount from "~/components/forms/CardAddAccount.vue"

  import type { TMovements } from "~~/types/movements/TMovements"

  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { getCategoriesOnlyActive } = useHttpCategories()
  const { getAccountsOnlyActive } = useHttpAccounts()
  const { validateSchemaMovements } = useValidateSchemas()
  const { postMovements } = useHttpMovements()
  const { invalidate } = useInvalidate()
  const { nameRules, selectRules, dateRules, currencyRules } = useValidateFields()

  const { data:categories } = useQuery({
    queryKey: QUERY_KEYS.categories.active,
    queryFn: getCategoriesOnlyActive,
  })

  const { data:accounts } = useQuery({
    queryKey: QUERY_KEYS.accounts.active,
    queryFn: getAccountsOnlyActive,
  })

  const form = ref()
  const modelValue = defineModel<boolean>()
  const menuCategorias = ref(false)
  const modelCategorias = ref<number | null>(null)
  const searchCategorias = ref("")
  const searchAccounts = ref("")
  const modelAccounts = ref<number | null>(null)
  const menuAccounts = ref(false)
  const modalAddCategorie = ref(false)
  const modalAddAccount = ref(false)

  const movementsForm = ref<TMovements>({
    type_transaction: "Despesa",
    value_transaction: null,
    date_transaction: null,
    description_transaction: "",
    categorie_id: null,
    accounts_id: null,
    status_transaction: "pago"
  })

  watch(menuCategorias, (val) => {
    if (!val) searchCategorias.value = ""
  })

  watch(modelAccounts, (val) => {
    if (!val) searchAccounts.value = ""
    movementsForm.value.accounts_id = val
  })

  watch(modelCategorias, (val) => {
    if (!val) searchAccounts.value = ""
    movementsForm.value.categorie_id = val
  })

  watch(menuAccounts, (val) => {
    if (!val) searchAccounts.value = ""
  })

  const filterCategorias = computed(() => {
    return categories.value?.filter(item => item.name_identifier.toLowerCase().includes(searchCategorias.value.toLowerCase()))
  })

  const filterAccounts = computed(() => {
    return accounts.value?.filter(item => item.name_identifier.toLowerCase().includes(searchAccounts.value?.toLowerCase() ?? ''))
  })

  function resetForm() {
    modelAccounts.value = null
    modelCategorias.value = null
    movementsForm.value.accounts_id = null
    movementsForm.value.categorie_id = null
    movementsForm.value.date_transaction = null
    movementsForm.value.description_transaction = ""
    movementsForm.value.observation = ""
    movementsForm.value.value_transaction = null
    movementsForm.value.url_recibo = ""
    movementsForm.value.status_transaction = 'pago'
    
    modelValue.value = false
  }

  function handleOpenModalAddCategorie() {
    modalAddCategorie.value = true
  }

  function handleOpenModalAddAccount() {
    modalAddAccount.value = true
  }


  const  { mutate, isPending  } = useMutation({
    
    mutationFn: postMovements,

    onSuccess: () => {
      invalidate(QUERY_KEYS.accounts.all)
      invalidate(QUERY_KEYS.movements.all)
      invalidate(QUERY_KEYS.movements.only_expenses)

      notifySuccess("Sucesso", "Despesa lançada com sucesso", 6000)
      resetForm()
      modelValue.value = false
    },

    onError: (error) => {
      notifyError("😢", "Ops! Algo deu errado ao salvar a desepesa. Tente novamente ou entre em contato com o suporte. Detalhes: " + error.message)
    },

  })

  async function handleAddMovimentExpenses() {
    
    try {

      const formValid = await form.value.validate()
      const resultSchema = validateSchemaMovements(movementsForm.value)
      
      console.log("Objeto a ser envidado" + JSON.stringify(movementsForm.value))
      
      if (formValid) {
        if (resultSchema.success) {  
          mutate(movementsForm.value)
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
    validate-on="lazy blur"
    >
      <v-dialog v-model="modelValue" max-width="600">
        <v-card prepend-icon="mdi-bank-plus" title="Nova despesa">
          <v-divider></v-divider>
          <v-card-text>

            <CurrencyInput input-color="#C62828" base-color="#C62828" color="#C62828" :rules="currencyRules"  autocomplete="off" label="Valor*" v-model="movementsForm.value_transaction" />

            <v-date-input :rules="dateRules" autocomplete="off" name="date" prepend-icon="" label="Data*" variant="underlined" v-model="movementsForm.date_transaction"></v-date-input>

            <v-text-field :rules="nameRules" :counter="45" maxlength="45"  autocomplete="name" name="name" label="Descrição*" variant="underlined" v-model="movementsForm.description_transaction"></v-text-field>

            <v-select
              autocomplete="off"
              :loading="isPending"
              v-model="modelCategorias"
              v-model:menu="menuCategorias"
              :items="filterCategorias"
              item-title="name_identifier"
              item-value="id"
              variant="underlined"
              label="Categoria*"
              persistent-hint
              :rules="selectRules"
              >
                <template #append-inner>
                  <v-tooltip
                  activator="parent"
                  location="top"
                  >Nova categoria</v-tooltip>
                  <v-icon @click.stop="handleOpenModalAddCategorie" class="button-hover" icon="mdi-plus-box"></v-icon>
                </template>
                
                <template v-slot:selection="{item}">
                  <v-avatar style="width: 30px; height: 30px; margin-right: 12px;"> 
                    <v-avatar :icon="item.raw.url_icon"></v-avatar>
                  </v-avatar>
                  <span>{{ item.raw.name_identifier }}</span>
                </template>

                <template v-slot:item="{props, item}">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-avatar :icon="item.raw.url_icon"></v-avatar>
                    </template>
                  </v-list-item>
                </template>

                <template v-slot:prepend-item>
                  <div class="pa-2 border-b">
                    <v-text-field
                      v-model="searchCategorias"
                      :error="!!searchCategorias && !filterCategorias?.length"
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

              <v-select
                  v-model="modelAccounts"
                  v-model:menu="menuAccounts"
                  :items="filterAccounts"
                  :rules="selectRules"
                  item-title="name_identifier"
                  item-value="id"
                  variant="underlined"
                  label="Conta*"
                  hint="O valor será debitado desta conta"
                  persistent-hint
                  autocomplete="off"
                >
                  <template #append-inner>
                    <v-tooltip
                    activator="parent"
                    location="top"
                    >Nova conta</v-tooltip>
                    <v-icon @click.stop="handleOpenModalAddAccount"  class="button-hover" icon="mdi-plus-box"></v-icon>
                  </template>

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

                <v-text-field v-model="movementsForm.observation" :counter="100" maxlength="100" autocomplete="off" label="Observação" variant="underlined"></v-text-field >

                <v-file-input prepend-icon=""  prepend-inner-icon="mdi-paperclip" clearable label="Anexar comprovante" variant="underlined"></v-file-input>

              <v-switch
                v-model="movementsForm.status_transaction"
                color="error"
                label="Despesa paga"
                hide-details
                false-value="pendente"
                true-value="pago"
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
              text="Lançar"
              variant="tonal"
              :loading="isPending"
              @click="handleAddMovimentExpenses"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>

    <div style="position: absolute;">
      <CardAddCategorie v-model="modalAddCategorie"/>
      <CardAddAccount v-model="modalAddAccount"/>
    </div>

  </div>
</template>

<style lang="scss" scoped>

.icon-add-logo:hover {
  background-color: rgba(128, 128, 128, 0.562);
  border-radius: 60%;
}

::v-deep(.v-field__field) {
  align-items: center;
}

::v-deep(.v-card-title) {
  align-items: center;
}

.button-hover:hover {
  background-color: rgba(255, 255, 255, 0.418);
  transform: scale(1.1); 
  transition: 0.3s; 
}


</style>
