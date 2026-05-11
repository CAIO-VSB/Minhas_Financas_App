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
    const { patchMovements } = useHttpMovements()
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

    const props = defineProps<{
        draft: TMovements | null
    }>()


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

    watch(menuCategorias, (val) => {
        if (!val) searchCategorias.value = ""
    })

    //Watch reponsável por mostrar a categoria e conta atual
    watch(() => props.draft, (newDraft) => {
        if (newDraft) {
            modelCategorias.value = newDraft.categorie_id ?? null
            modelAccounts.value = newDraft.accounts_id ?? null
        }
    }, {immediate: true})

    //Watch responsável por atualizar a categoria escolhida pelo usário no ato da edição
    watch(modelCategorias, (val) => {
        if (props.draft) props.draft.categorie_id = val
    })

    //Watch responsável por atualizar a conta escolhida pelo usário no ato da edição
    watch(modelAccounts, (val) => {
        if (props.draft) props.draft.accounts_id = val
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
        modelValue.value = false
    }

    const  { mutate, isPending  } = useMutation({
        
        mutationFn: patchMovements,

        onSuccess: () => {
        invalidate(QUERY_KEYS.accounts.all)
        invalidate(QUERY_KEYS.movements.all)
        invalidate(QUERY_KEYS.movements.only_revenues)
        notifySuccess("Sucesso", "Receita editada com sucesso", 6000)
        resetForm()
        modelValue.value = false
        },

        onError: (error) => {
        notifyError("😢", "Ops! Algo deu errado ao editar a receita. Tente novamente ou entre em contato com o suporte. Detalhes: " + error.message)
        },

    })

  async function handleAddMovimentRevenue() {
    
    try {

        if(!props.draft) {
            notifyError("Ops!", "Algo não parece certo. Confira os dados e tente novamente.")
            return
        } 

        const formValid = await form.value.validate()
        const resultSchema = validateSchemaMovements(props.draft)
      
        console.log("Valor sendo enviado" + JSON.stringify(props.draft))
      
        if (formValid) {
            if (resultSchema.success) {  
                mutate(props.draft)
            }
        }

    } catch (err) {

      notifyInfo("Error", "Erro ao editar receita" + err)
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
      <v-dialog v-model="modelValue" max-width="600">
        <v-card prepend-icon="mdi-bank-plus" title="Editar receita">
          <v-divider></v-divider>
          <v-card-text>

            <CurrencyInput input-color="#2E7D32" base-color="#2E7D32" color="#2E7D32" :rules="currencyRules"  text-color="green" autocomplete="off" label="Valor*" v-model="props.draft.value_transaction" />

            <v-date-input :rules="dateRules" autocomplete="off" name="date" prepend-icon="" label="Data*" variant="underlined" v-model="props.draft.date_transaction"></v-date-input>

            <v-text-field :rules="nameRules" :counter="45" maxlength="45"  autocomplete="name" name="name" label="Descrição*" variant="underlined" v-model="props.draft.description_transaction"></v-text-field>

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

                <v-text-field v-model="props.draft.observation" :counter="100" maxlength="100" autocomplete="off" label="Observação" variant="underlined"></v-text-field >

              <v-switch
                v-model="props.draft.status_transaction"
                color="success"
                label="Receita recebida"
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
              text="Editar"
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
