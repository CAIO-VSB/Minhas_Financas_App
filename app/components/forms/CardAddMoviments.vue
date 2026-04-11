<script lang="ts" setup>


  import CurrencyInput from "~/components/ui/CurrencyInput.vue"

  import { useHttpCategories } from '~/composables/useHttp/useHttpCategories'
  import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"

  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { getCategories } = useHttpCategories()
  const { getAccountsOnlyActive } = useHttpAccounts()

  const { isPending, data:categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { data:accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccountsOnlyActive,
  })

  const trip = ref({
    name: '',
    location: null,
    start: null,
    end: null,
  })

  const form = ref()
  const modelValue = defineModel<boolean>()
  const money = ref(null)
  const menuCategorias = ref(false)
  const modelCategorias = ref<number | null>(null)
  const searchCategorias = ref("")
  const searchAccounts = ref("")
  const modelAccounts = ref<number | null>(null)
  const menuAccounts = ref(false)

  
  const fav = ref(true)
  const menu = ref(false)
  const message = ref(false)
  const hints = ref(true)

  const accountForm = ref<TAccount>({
    name_identifier: "",
    type_account: "",
    name_bank: "",
    color: "",
    url_image: "",
    active: true
  })

  watch(modelCategorias, (val) => {
    if (!val) searchCategorias.value = ""
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
      <v-dialog v-model="modelValue" max-width="600">
        <v-card prepend-icon="mdi-bank-plus" title="Nova receita">
          <v-divider></v-divider>
          <v-card-text>

            <CurrencyInput text-color="green" autocomplete="off" color="green" label="Valor*" />

            <v-date-input  autocomplete="off" name="date" prepend-icon="" label="Data*" variant="underlined"></v-date-input>

            <v-text-field autocomplete="name" name="name" label="Descrição*" variant="underlined"></v-text-field>

            <v-select
              autocomplete="off"
              :loading="isPending"
              v-model="modelCategorias"
              v-model:menu="menuCategorias"
              :items="filterCategorias"
              item-title="name_identifier"
              item-value="id"
              clearable
              variant="underlined"
              label="Categoria*"
              persistent-hint
              :rules="logoCreditCardRules"
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
                      clearable
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
                  :rules="accountDebitRules"
                  item-title="name_identifier"
                  item-value="id"
                  clearable
                  variant="underlined"
                  label="Conta*"
                  hint="O valor será creditado nesta conta"
                  persistent-hint
                  autocomplete="off"
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
                        hide-details="auto"
                      >                 
                    </v-text-field>
                    </div>
                  </template>
                </v-select>

                <div style="margin-top: 14px;">
                    <div>
                      <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                        location="end"
                      >
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="primary"
                            v-bind="props"
                            class="text-none rounded-xl"
                            append-icon="mdi-arrow-right-thin"
                          >
                            Mais detalhes
                          </v-btn>
                        </template>

                        <v-card min-width="300">
            
                          <v-list>
                            <v-list-item>
                              <v-text-field variant="underlined" label="Observação"></v-text-field>
                            </v-list-item>

                            <v-list-item>
                              <v-file-input variant="underlined" label="Anexar comprovante"></v-file-input>
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-menu>
                    </div>
                </div>

              <v-switch
                v-model="accountForm.active"
                color="success"
                label="Receita já recebida"
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
              text="Lançar"
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
