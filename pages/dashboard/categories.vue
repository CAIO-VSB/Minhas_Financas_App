<script setup lang="ts">
import type { TCategorie } from '~/server/types/TCategories.type';

    definePageMeta({
      title: "Categorias",
      layout: "layout-dashboard",
    })

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

    const getAccounts = async () => {
      return await $fetch<TCategorie []>("/api/categories", {method: "GET"})
    }

    const { isPending, data, error } = useQuery({
      queryKey: ['accounts'],
      queryFn: getAccounts,
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
                  @click="activeFilterAccounts = item.value"
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
            @click="handleOpenModalAddAccount"
            />
          </template>
        </v-tooltip>
    </div>
    </div>

  </div>
</template>


<style scoped>

.container {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  justify-content: center;
  max-width: 100%;
  background-color: red;
}

.filter-card {
  width: 20%;
  position: sticky;
  top: 0;
}

.card-list {
  width: 65%;
  overflow-y: auto;
  height: auto;
}

.fab-wrapper {
  position: fixed;
  bottom: 25px;
  right: 24px;
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
  width: 5px;
  background: #F4F4F4;
}

::-webkit-scrollbar-thumb {
  background: #dad7d7;
}

.text-disabled {
  text-decoration: line-through;
}

@media (max-width: 680px) {
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .filter-card {
    width: 100%;
    padding: 0 10px 0 10px;
    margin-top: 5px;
  }

  .card-list {
    width: 100%;
    padding: 0 10px 0 10px;
  }
}

@media (max-width: 780px) {
  .container {
    display: flex;
    flex-direction: column;
    max-width: 100%;
  }

  .filter-card {
    width: 100%;
    padding: 0 10px 0 10px;
    margin-top: 5px;
  }

  .card-list {
    width: 100%;
    padding: 0 10px 0 10px;
  }
}

@media (max-width: 1200px) {
  .container {
    display: flex;
    flex-direction: column;
    max-width: 100%;
  }

  .filter-card {
    width: 100%;
    padding: 0 10px 0 10px;
    margin-top: 5px;
  }

  .card-list {
    width: 100%;
    padding: 0 10px 0 10px;
  }
}


</style>

