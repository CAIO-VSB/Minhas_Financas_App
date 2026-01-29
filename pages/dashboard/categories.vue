<script setup lang="ts">

  definePageMeta({
    title: "Categorias",
    layout: "layout-dashboard",
    middleware: "auth"
  })

  import { useHttpCategories } from '~/composables/useVerbsHttp/useHttpCategories'

  const { getCategories } = useHttpCategories()

  const options = [
    { title: 'Editar', icon: 'mdi-pencil', value: true },
    { title: 'Inativar', icon: 'mdi-block-helper', value: false },
  ]

  const items = [
    {
      title: 'Despesas',
      value: 12,
      icon: "mdi-arrow-down-thin"
    },
    {
      title: 'Receitas',
      value: 9,
      icon: "mdi-arrow-up-thin"
    },

  ]

  const modalAddCategorie = ref(false)

  const { isPending, data, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })


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
            :value="item"
            color="primary"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <template v-slot:append>
              <v-chip>
                {{ item.value }}
              </v-chip>
            </template>

            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </div>

    <div class="card-list">
          
      <v-list  lines="two" item-props>

        <v-list-subheader>Categorias</v-list-subheader>
        
        <v-divider></v-divider>

        <v-list-item
          v-for="(categorie, index) in data || []"
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
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, i) in options"
                  :key="i"
                  :value="i"
                  :title="item.title"
                  :prepend-icon="item.icon"
                  
                >
                </v-list-item>
              </v-list>
            </v-menu>
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

  </div>
</template>


<style scoped>

.container {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  justify-content: center;
  max-width: 100%;
  height: 100%;
}

.filter-card {
  width: 20%;
  position: sticky;
  top: 0;
}

.card-list {
  width: 65%;
  overflow-y: auto;
  margin-bottom: 68px;
  border-radius: 5px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.fab-wrapper {
  position: fixed;
  bottom: 25px;
  right: 22px;
  z-index: 9999;
}

.title-card {
  font-family: "Poppins", sans-serif;
} 

.sub-title-card {
  font-family: "Poppins", sans-serif;
}

::v-deep(.v-list-item-title) {
  font-family: "Poppins", sans-serif;
}

::v-deep(.v-list-item-subtitle) {
  font-family: "Poppins", sans-serif;
}

::v-deep(.v-list-subheader__text ) {
  font-size: 1.2rem;
}

::-webkit-scrollbar-track {
  background-color: #F4F4F4;
}

::-webkit-scrollbar {
  width: 4px;
  border-radius: 15px;
  background: #F4F4F4;
}

::-webkit-scrollbar-thumb {
  background: #dad7d7;
}

.text-disabled {
  text-decoration: line-through;
}

@media (max-width: 980px) {

  .container {
    flex-direction: column;
  }

  .filter-card {
    width: 100%;
    padding: 0 8px 0 8px;
    position: sticky;
    top: 0;
  }

  .card-list {
    max-width: 100%;
    width: 100%;
    padding: 0 8px 0 8px;
    margin-bottom: -15px;
  }

}



</style>

