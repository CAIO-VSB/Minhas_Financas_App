<script lang="ts" setup>


  import CurrencyInput from "~/components/ui/CurrencyInput.vue"

  import { useHttpCategories } from '~/composables/useHttp/useHttpCategories'
  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
  import { useHttpMoviments } from "~/composables/useHttp/useHttpMoviments"

  import { useValidateSchemas } from "~/composables/useValidateSchema"
  import { useValidateFields } from "~/composables/useValidateFields"
  import { useInvalidate } from "~/composables/useInvalidate"

  import CardAddCategorie from '~/components/forms/CardAddCategorie.vue'
  import CardAddAccount from "~/components/forms/CardAddAccount.vue"

  import type { TMoviments } from "~~/types/moviments/TMoviments"

  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { getCategoriesOnlyActive } = useHttpCategories()
  const { getAccountsOnlyActive } = useHttpAccounts()
  const { validateSchemaMoviments } = useValidateSchemas()
  const { postMoviments } = useHttpMoviments()
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

  const movimentsForm = ref<TMoviments>({
    type_transaction: "Receita",
    value_transaction: null,
    date_transaction: null,
    description_transaction: "",
    categorie_id: null,
    accounts_id: null,
    status_transaction: "recebido"
  })

  watch(menuCategorias, (val) => {
    if (!val) searchCategorias.value = ""
  })

  watch(modelAccounts, (val) => {
    if (!val) searchAccounts.value = ""
    movimentsForm.value.accounts_id = val
  })

  watch(modelCategorias, (val) => {
    if (!val) searchAccounts.value = ""
    movimentsForm.value.categorie_id = val
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
    movimentsForm.value.accounts_id = null
    movimentsForm.value.categorie_id = null
    movimentsForm.value.date_transaction = null
    movimentsForm.value.description_transaction = ""
    movimentsForm.value.observation = ""
    movimentsForm.value.value_transaction = null
    movimentsForm.value.url_recibo = ""
    
    modelValue.value = false
  }

  function handleOpenModalAddCategorie() {
    modalAddCategorie.value = true
  }

  function handleOpenModalAddAccount() {
    modalAddAccount.value = true
  }

  const  { mutate, isPending  } = useMutation({
    
    mutationFn: postMoviments,

    onSuccess: () => {
      invalidate(QUERY_KEYS.accounts.all)
      notifySuccess("Sucesso", "Receita lançada com sucesso", 6000)
      resetForm()
      modelValue.value = false
    },

    onError: (error) => {
      notifyError("😢", "Ops! Algo deu errado ao salvar a receita. Tente novamente ou entre em contato com o suporte. Detalhes: " + error.message)
    },

  })

  async function handleAddMovimentRevenue() {
    
    try {

      const formValid = await form.value.validate()
      const resultSchema = validateSchemaMoviments(movimentsForm.value)
      
      console.log("Objeto a ser envidado" + JSON.stringify(movimentsForm.value))
      
      if (formValid) {
        if (resultSchema.success) {  
          mutate(movimentsForm.value)
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
        <v-card prepend-icon="mdi-bank-plus" title="Nova receita">
          <v-divider></v-divider>
          <v-card-text>

            <CurrencyInput input-color="#2E7D32" base-color="#2E7D32" color="#2E7D32" :rules="currencyRules"  text-color="green" autocomplete="off" label="Valor*" v-model="movimentsForm.value_transaction" />

            <v-date-input :rules="dateRules" autocomplete="off" name="date" prepend-icon="" label="Data*" variant="underlined" v-model="movimentsForm.date_transaction"></v-date-input>

            <v-text-field :rules="nameRules" :counter="45" maxlength="45"  autocomplete="name" name="name" label="Descrição*" variant="underlined" v-model="movimentsForm.description_transaction"></v-text-field>

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
                  hint="O valor será creditado nesta conta"
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

                <v-text-field v-model="movimentsForm.observation" :counter="100" maxlength="100" autocomplete="off" label="Observação" variant="underlined"></v-text-field >

                <v-file-input prepend-icon=""  prepend-inner-icon="mdi-paperclip" clearable label="Anexar comprovante" variant="underlined"></v-file-input>

              <v-switch
                v-model="movimentsForm.status_transaction"
                color="success"
                label="Receita já recebida"
                hide-details
                false-value="pendente"
                true-value="recebido"
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
              @click="handleAddMovimentRevenue"
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
  transform: scale(1.1); /* Efeito de zoom */
  transition: 0.3s; /* Transição suave */
}


</style>
