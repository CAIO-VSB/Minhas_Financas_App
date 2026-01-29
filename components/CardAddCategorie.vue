<script lang="ts" setup>

//Importações composables
  import { useSelectedIcon } from "~/composables/useCategorie/useSelectedIcon"
  import { useValidateFields } from "~/composables/useValidateFields"
  import { useHttpCategories } from "~/composables/useVerbsHttp/useHttpCategories"
  import type { TCategorie } from "~/types/categorie/TCategorie"

  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { nameRules, validateSchemaCategorie } = useValidateFields() 
  const { currentIcon } = useSelectedIcon()
  const { postCategorie } = useHttpCategories()  

  const items = ref([
  'Despesa',
  'Receita',
  ])

  const selectRules = ref([
    (val: string) => !!val || "Campo tipo é obrigatório",
  ])

  const errorMessage = ref("")
  const errorActive = ref(false)
  const modalAddIconCategorie = ref(false)
  const form = ref()
  const modelValue = defineModel<boolean>()
  const categorieForm = ref<TCategorie>({
    name_identifier: "",
    type_categorie: "",
    url_icon: "",
    active: true
  })

  watch(currentIcon, (newValue) => {
    categorieForm.value.url_icon = newValue
    modalAddIconCategorie.value = false
  })

  const  { mutate, isPending  } = useMutation({

    mutationFn: (payload: TCategorie) => postCategorie(payload),

    onSuccess: () => {
      notifySuccess("Sucesso", "Categoria criada com sucesso", 6000)
      modelValue.value = false
    },

    onError: (error) => {
      errorMessage.value = `Erro no servidor. Tente novamente mais tarde ou contate o surpote técnico. Erro detalhado: ${error.message}`
      errorActive.value = true 
    },

  })

  async function handleAddAccount() {

  try {
    const formValid = await form.value.validate()
    const resultSchema = validateSchemaCategorie(categorieForm.value)

    console.log("Objeto a ser envidado" + JSON.stringify(categorieForm.value))
    
    if (formValid) {
      if (resultSchema.success) {  
        mutate(categorieForm.value)
      }
    }
  } catch (err) {
    console.log("Erro ao criar conta" + err)
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
        <v-card prepend-icon="mdi-plus-box" title="Nova Categoria">
          <v-divider></v-divider>
          <v-card-text>
            <form>
              <v-text-field
                label="Nome da categoria *"
                variant="underlined"
                color="primary"
                v-model="categorieForm.name_identifier"
                :rules="nameRules"
                hint="Adicione um ícone clicando no botão ao lado"
                persistent-hint
              >

               <template v-slot:append>
                <v-icon @click="modalAddIconCategorie = true" class="cursor-pointer" :icon=" categorieForm.url_icon || 'mdi-plus'" size="large"></v-icon>
                <v-tooltip
                activator="parent"
                location="top"
                >Escolha um ícone de identificação
                </v-tooltip>

                </template>
              </v-text-field>

              <v-select :rules="selectRules" v-model="categorieForm.type_categorie" color="primary" persistent-hint hint="Selecione o tipo de categoria" label="Tipo *" :items="items" variant="underlined">
              </v-select>

              <v-switch
                v-model="categorieForm.active"
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
              :loading="isPending"
              @click="handleAddAccount"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
    <BaseModal :model-value="errorActive" title="Error" :text="errorMessage" />
    <CardAddIconCategorie v-model="modalAddIconCategorie" />
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
