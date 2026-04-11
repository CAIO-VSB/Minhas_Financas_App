<script lang="ts" setup>

  import { useSelectedIcon } from "~/composables/useCategorie/useSelectedIcon"
  import { useValidateFields } from "~/composables/useValidateFields"
  import { useHttpCategories } from "~/composables/useHttp/useHttpCategories"
  import type { TCategorie } from "~~/types/categorie/TCategorie"
  import CardAddIconCategorie from "~/components/forms/CardAddIconCategorie.vue"
  import { useValidateSchemas } from "~/composables/useValidateSchema"
  import { useInvalidate } from "~/composables/useInvalidate"
  

  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { nameRules } = useValidateFields() 
  const { validateSchemaCategorie } = useValidateSchemas()
  const { selectedIcon } = useSelectedIcon()
  const { postCategorie } = useHttpCategories() 
  const { $authClient } = useNuxtApp()
  const { invalidate } = useInvalidate()
  const { data: session } = await $authClient.getSession()

  const items = ref([
    'Despesa',
    'Receita',
  ])

  const selectRules = ref([
    (val: string) => !!val || "Campo tipo é obrigatório",
  ])

  const modalAddIconCategorie = ref(false)
  const form = ref()
  const modelValue = defineModel<boolean>()
  const categorieForm = ref<TCategorie>({
    name_identifier: "",
    type_categorie: "",
    url_icon: "",
    active: true
  })

  watch(selectedIcon, (newIcon) => {
    if (newIcon !== null) {
      categorieForm.value.url_icon = newIcon.icon
      modalAddIconCategorie.value = false
    }
  })

  function resetForm() {
    categorieForm.value.name_identifier = ""
    categorieForm.value.type_categorie = ""
    categorieForm.value.url_icon = ""
    modelValue.value = false
  }

  const  { mutate, isPending  } = useMutation({

    mutationFn: (payload: TCategorie) => postCategorie(payload),

    onSuccess: () => {
      invalidate("categories")
      notifySuccess("Sucesso", "Categoria criada com sucesso", 6000)
      modelValue.value = false
      resetForm()
    },

    onError: (error) => {
      notifyError("😢", "Ops! Algo deu errado ao salvar a categoria. Tente novamente ou entre em contato com o suporte. Detalhes: " + error.message)
    },

  })

  async function handleAddAccount() {

    try {
      const formValid = await form.value.validate()
      const resultSchema = validateSchemaCategorie(categorieForm.value)

      console.log("Objeto a ser envidado" + JSON.stringify(categorieForm.value))
      
      if (formValid) {

        if (categorieForm.value.url_icon === ""){
          return notifyInfo("Atenção", "Escolha um ícone que represente esta categoria", 7000)
        }

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
    <CardAddIconCategorie v-model="modalAddIconCategorie" />
  </div>
</template>


<style scoped>

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
