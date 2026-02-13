<script setup lang="ts">

  definePageMeta({
    title: "Categorias",
    layout: "layout-dashboard",
    middleware: "session"
  })

  /*
  Tipo das opções disponíveis
  */
  type TOptionAction = {
    title: string,
    icon: string,
    value: "edit" | boolean
  }

  //Imports
  import { useHttpCategories } from '~/composables/useHttp/useHttpCategories'
  import type { TCategorie } from '~/types/categorie/TCategorie'
  
  //Importações composables
  const { getCategories } = useHttpCategories()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const {  patchCategorie } = useHttpCategories() 

  
  const modalEditCategorie = ref(false)
  const modalAddCategorie = ref(false)
  const editDraft = ref<TCategorie | null>(null)
  const filterCategorieActive = ref<boolean | null>(true)
  const selectedTypeCategorie = ref("")

  
  const {isPending, data, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
  
  const  { mutate } = useMutation({

    mutationFn: (payload: TCategorie) => patchCategorie(payload),

    onSuccess: () => {
      notifySuccess("Sucesso", "Categoria editada com sucesso", 6000)
    },

    onError: (error) => {
      notifyInfo("Atenção", `Erro no servidor. Tente novamente mais tarde ou contate o surpote técnico. Erro detalhado: ${error.message}`)
    },

  })

  /**
   * Função que intera no array e retorna o total Receitas
   */
  const totalReceitas = computed(() => {

    return (data.value || [])
    .reduce((acc, item) => {
      return item.type_categorie === "Receita" ? acc + 1 : acc
    }, 0)
  
  })

  /**
   * Função que intera no array e retorna o total de Despesas 
   */
  const totalDespesas = computed(() => {

    return (data.value || [])
    .reduce((acc, item) => {
      return item.type_categorie === "Despesa" ? acc + 1 : acc
    }, 0)
  
  })

  /**
   * Função que intera no array e retorna o total geral
   */
  const totalGeral = computed(() => {

    return (data.value || [])
    .reduce((acc, item) => {
      return item.type_categorie ? acc + 1 : acc
    }, 0)
  
  })


  //Itens fixos das opções do filtro
  const items = [
    {
      title: 'Despesas',
      value: 'despesas',
      icon: "mdi-arrow-down-thin",
      total: totalDespesas
    },
    {
      title: 'Receitas',
      value: 'receitas',
      icon: "mdi-arrow-up-thin",
      total: totalReceitas
    },
    {
      title: 'Geral',
      value: 'geral',
      icon: "mdi-view-dashboard",
      total: totalGeral
    },

  ]


  /**
   * Lida com a abertura do modal de edição das categorias
   * @param categorie - Categoria mandada via formulário
   * Cria uma copia da categoria a ser editada e inicia a abertura do modal
   */
  function handleOpenModalEditCategorie(categorie: TCategorie) {
    modalEditCategorie.value = true

    //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
    editDraft.value = structuredClone(toRaw(categorie))
  }


  /**
   * Função principal por filtrar as categoiras com base nos filtros existentes na tela
   * @param choiceOnlyActive - Parametro para filtar por tipo ativo
   * @param choiceOnlyTypeCategorie - parametro para filtar por tipo de categoria
   */
  function filterCategorie(choiceOnlyActive?: boolean | null, choiceOnlyTypeCategorie?: string) {
    let categorie = data.value ?? []

    //Retorna as categorias com base no seu tipo
    if (choiceOnlyTypeCategorie === "despesas") {
      categorie = categorie.filter(item => item.type_categorie === "Despesa")
    } 
    
    if (choiceOnlyTypeCategorie === "receitas") {
      categorie = categorie.filter(item => item.type_categorie === "Receita")
    } 

    //Retorna somente as categorias com status ativa
    if (choiceOnlyActive === true) {
      categorie = categorie.filter(item => item.active === true)
    } 

    return categorie

  }

  /**
   * @param '' Passa uma variavel como argumento
   * @returns Chama a função de filtrar as categorias 
  */
  const filteredCategories = computed(() => {
    return filterCategorie(filterCategorieActive.value, selectedTypeCategorie.value)
  })


  /**
   * Função responsável apenas por resetar os valores ao fechar o modal
   */
  function handleCloseEditCategorie() {
    editDraft.value = null
    modalEditCategorie.value = false
  }

  /**
   * Gera opções dinâmicas baseadas no estado da categoria (ativa/desativada)
   * @param categorie - Recebe a categoria selecionada para definir as opções dinamicamente
   * @returns Retorna um array de opções com base no tipo passado
   */
  function getOptions(categorie: TCategorie): TOptionAction [] {
    return [
      {title: "Editar", icon: "mdi-pencil", value: "edit"},
      {
        title: categorie.active ? "Inativar" : "Ativar",
        icon: categorie.active ? "mdi-block-helper" : "mdi-check-circle",
        value: categorie.active ? false : true
      }
    ]
  }


  /**
   * Função responsável por chamar a api e setar os valores com base nas opções
   * @param option - Objeto que retorna a escolha do usuário via formulário 
   * @param data - Categoria que será modificada
   * @returns Abre o modal de edições ou seta os valores 
   */
  function handleOptionClick(option: TOptionAction, data: TCategorie) {

    //Abre o modal para edições na categoria selecionada
    if (option.value === "edit") {
      handleOpenModalEditCategorie(data)
      return
    }

    //Usamos structuredClone + toRaw para evitar mutar o objeto reativo do Vue
    const payload = structuredClone(toRaw(data))
    payload.active = option.value
    
    //Passa o valor da cópia do objeto para à API
    mutate(payload)

  }

</script>


<template>
  <div class="container">

    <div class="filter-card">
      
      <v-card
        class="mx-auto"
        >
        <v-list density="compact">
          <v-list-subheader>Filtro</v-list-subheader>

          <v-divider></v-divider>

          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item.value"
            color="black"
            v-model="filterCategorie"
            @click="selectedTypeCategorie = item.value"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <template v-slot:append>
              <v-chip>
                {{ item.total }}
              </v-chip>
            </template>

            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>

      <div style="margin-top: 10px;">
        <v-switch
          v-model="filterCategorieActive"
          label="Exibir apenas categorias ativas"
          hide-details
          inset
          color="success"
        ></v-switch>
      </div>

    </div>

    <div class="card-list">
          
      <v-list lines="two" item-props>

        <v-list-subheader>Categorias</v-list-subheader>
        
        <v-divider></v-divider>

        <v-list-item
          v-for="(categorie, index) in filteredCategories ||  []"
          :key="index"
          :prepend-icon="categorie.url_icon"
        >

          <template #title>
            <p :class="{'text-disabled': !categorie.active}" style="padding-bottom: 12px; ">{{ categorie.name_identifier }}</p>
          </template>

          <template #subtitle>
            <p  style="padding-bottom: 12px;">{{ categorie.type_categorie }}</p>
          </template>

          <v-divider></v-divider>
           
          <template #append>
            <div class="text-center">
              <v-menu location="center">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-dots-vertical"
                    variant="text"
                    :loading="isPending"
                  >
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item
                    v-for="item in getOptions(categorie)"
                    :key="item.title"
                    :prepend-icon="item.icon"
                    @click="handleOptionClick(item, categorie)"
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <div class="fab-wrapper">
        <v-tooltip text="Nova Categoria" location="left">
          <template #activator="{ props }">
            <BaseFab 
            v-bind="props"
            color="blue"
            icon="mdi-plus"
            size="60"
            @click="modalAddCategorie = true"
            />
          </template>
        </v-tooltip>
    </div>

    <v-skeleton-loader 
    v-if="isPending"
    v-for="n in 12" 
    :key="n" 
    type="list-item-avatar"
    class="mb-2"
    />

  </div>

  <CardAddCategorie v-model="modalAddCategorie" />

  <CardEditCategorie 
    :draft="editDraft"
    @Close="handleCloseEditCategorie"
    v-model="modalEditCategorie" 
  />

  </div>
</template>


<style scoped>

.container {
  display: flex;
  gap: 16px;
  margin-top: 10px;
  justify-content: center;
  max-width: 100%;
  height: calc(100vh - 70px);

}

.filter-card {
  width: 20%;
  position: sticky;
  top: 0;
  padding: 0 5px 0 5px;
}

.card-list {
  width: 65%;
  overflow-y: auto;
  height: 100%;
  border-radius: 5px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.fab-wrapper {
  position: fixed;
  bottom: 25px;
  right: 22px;
  z-index: 9999;
}

.text-disabled {
  text-decoration: line-through;
}

@media (max-width: 980px) {

  .container {
    flex-direction: column;
    height: calc(100% + 93px);
  }

  .filter-card {
    width: 100%;
    padding: 0 10px 0 8px;
    position: sticky;
    top: 0;
  }

  .card-list {
    width: 100%;
    padding: 0 8px;
    height: auto;
    flex: 1;
  }

}



</style>

