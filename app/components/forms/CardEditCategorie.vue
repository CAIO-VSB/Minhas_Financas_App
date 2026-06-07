<script lang="ts" setup>

  import { useSelectedIcon } from "~/composables/useCategorie/useSelectedIcon"
  import { useValidateFields } from "~/composables/useValidateFields"
  import { useHttpCategories } from "~/composables/useHttp/useHttpCategories"
  import type { TCategorie } from "~~/types/categorie/TCategorie"
  import { useSelectedCategorie } from "~/composables/useCategorie/useSelectedCategorie"
  import CardAddIconCategorie from "~/components/forms/CardAddIconCategorie.vue"
  import { useValidateSchemas } from "~/composables/useValidateSchema"
  import { useInvalidate } from "~/composables/useInvalidate"

  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { nameRules } = useValidateFields() 
  const { validateSchemaCategorie  } = useValidateSchemas()
  const { selectedIcon } = useSelectedIcon()
  const { selectedCategorie  } = useSelectedCategorie()
  const {  patchCategorieById } = useHttpCategories()  
  const { invalidate } = useInvalidate()

  const items = ref([
    'Despesa',
    'Receita',
  ])

  const props = defineProps<{
    draft: TCategorie | null
  }>()

  const selectRules = ref([
    (val: string) => !!val || "Campo tipo é obrigatório",
  ])

  const modalAddIconCategorie = ref(false)
  const form = ref()
  const modelValue = defineModel<boolean>()

  watch(selectedIcon, (newIcon) => {
    if (props.draft !== null && newIcon !== null) {
      props.draft.url_icon = newIcon.icon
      modalAddIconCategorie.value = false
    }
  })

  watch(selectedCategorie, (newcategoire) => {
    if (props.draft !== null && newcategoire !== null ) {
      props.draft.name_identifier = newcategoire?.name
      props.draft.type_categorie = newcategoire.type_categorie
    }
  })

  const  { mutate, isPending  } = useMutation({

    mutationFn: (payload: TCategorie) => patchCategorieById(payload.id!, payload),

    onSuccess: () => {
      invalidate(QUERY_KEYS.categories.all)
      notifySuccess("Sucesso", "Categoria editada com sucesso", 6000)
      modelValue.value = false
    },

    onError: (error) => {
      notifyError("😥", "Ops! Algo deu errado ao editar a categoria. Tente novamente ou entre em contato com o suporte. Detalhes: " + error.message)
    },

  })

  async function handleAddAccount() {

    if(!props.draft) {
      notifyError("Atenção", "O objeto passado é inválido. Tente novamente.")
      return
    }

    try {
      const formValid = await form.value.validate()
      const resultSchema = validateSchemaCategorie(props.draft)

      console.log("Objeto a ser envidado" + JSON.stringify(props.draft))
      
      if (formValid) {
        if (resultSchema.success) {  
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
    <v-form
    @submit.prevent
    ref="form"
    v-if="props.draft"
    >
      <v-dialog persistent v-model="modelValue" max-width="600">
        <v-card prepend-icon="mdi-pencil-circle" title="Editar categoria">
          <v-divider></v-divider>
          <v-card-text>
            <form>
              <v-text-field
                label="Nome da categoria *"
                variant="underlined"
                color="primary"
                v-model="props.draft.name_identifier"
                :rules="nameRules"
                hint="Adicione uma identificação clicando no ícone ao lado"
                persistent-hint
                :counter="45" 
                maxlength="45"
                prepend-icon="mdi-rename"
              >

               <template v-slot:append>
                <v-icon @click="modalAddIconCategorie = true" class="cursor-pointer" :icon=" props.draft.url_icon || 'mdi-plus'" size="large"></v-icon>
                <v-tooltip
                activator="parent"
                location="top"
                >Escolha um ícone de identificação
                </v-tooltip>

                </template>
              </v-text-field>

              <v-select prepend-icon="mdi-tag" :rules="selectRules" v-model="props.draft.type_categorie" color="primary" persistent-hint hint="Selecione o tipo de categoria" label="Tipo *" :items="items" variant="underlined">
              </v-select>

              <v-switch
                v-model="props.draft.active"
                color="success"
                label="Ativo"
                true-icon="mdi-check"
                false-icon="mdi-close"
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
