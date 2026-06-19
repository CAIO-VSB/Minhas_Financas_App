<script lang="ts" setup>

  import logo from "@/assets/logo.jpg"
  import InfoUser from './components/myAccount.vue'
  import ButtonActions from './components/buttonActions.vue'

  const drawer = ref(true)
  const rail = ref(false)
  const openedGroups = ref(['Cadastros'])
  const routes = useRoute()


  const nav = [
    { title: 'Visão geral', icon: 'mdi-home-analytics', value: 'Visão geral', to: '/home' },
    { title: 'Transações', icon: 'mdi-swap-horizontal-bold', value: 'transacoes', to: '/transactions' },
    { title: 'Cartões de crédito', icon: 'mdi-credit-card-multiple-outline', value: 'cartoes', to: '/credit-card' },
    { title: 'Economia', icon: 'mdi-piggy-bank-outline', value: 'economia', to: undefined },
  ]

</script>

<template>
    <v-layout >
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        @click="rail = false"
        :width="380"
        border="end"
        color="surface"
        class="elavation-2"
      >
        <v-list >
          <v-list-item
          >
            <template #prepend>
               <v-avatar :image="logo"></v-avatar>
            </template>
            
            <template #title>
              <span class="text-primary text-subtitle-1 font-weight-bold">Minhas finanças</span>
            </template>

            <template v-slot:append>
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="rail = !rail"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider ></v-divider>

        <ButtonActions class="my-3" :rail="rail"/>

        <v-list  density="comfortable" class="px-2 mt-2" nav v-model:opened="openedGroups">
            <v-list-item
            v-for="item in nav"
              :prepend-icon="item.icon"
              :title="item.title"
              :value="item.value"
              :to="item.to"
              rounded="lg"
              color="primary"
              class="mb-1 text-body-2"
            >
              <template #title>
                <span class="text-body-1">{{ item.title }}</span>
              </template>

              <v-tooltip
              activator="parent"
              location="start"
              >{{ item.title }}</v-tooltip>
            </v-list-item>

            <v-list-item
              v-if="rail"
              prepend-icon="mdi-database-plus"
              rounded="lg"
              color="primary"
              class="cursor-pointer"
            >
              <v-tooltip activator="parent" location="end">Cadastros</v-tooltip>
            </v-list-item>
            

            <v-list-group v-else value="Cadastros" >

            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-database-plus" rounded="lg" color="primary">
                <template #title><span class="text-body-1">Cadastros</span></template>
              </v-list-item>
            </template>
                        
            <v-list-item
            prepend-icon="mdi-folder-outline"
            title="Categorias"
            value="categoria"
            to="/categories"
            rounded="lg"
            color="primary"
            class="mb-1"
            >
              <template #title>
                <span class="text-body-1">Categorias</span>
              </template>
          </v-list-item>

            <v-list-item
            prepend-icon="mdi-bank-outline"
            title="Contas bancárias"
            value="contas"
            to="/accounts"
            rounded="lg"
            color="primary"
            class="mb-1"
            >

            <template #title>
              <span class="text-body-1">Contas bancárias</span>
            </template>
          </v-list-item>

            </v-list-group>
              <v-list-item
                prepend-icon="mdi-file-chart-outline"
                title="Relatórios"
                value="relatorios"
                rounded="lg"
                color="primary"
                class="mb-1"
            >
              <template #title>
                <span class="text-body-1">Relatórios</span>
              </template>
                <v-tooltip
                activator="parent"
                location="start"
                >Relatórios</v-tooltip>   
            </v-list-item>

            <v-divider></v-divider>

        </v-list>

        <template v-slot:append>
          <div class="mb-4">
            <v-list density="compact" nav >
                <v-list-item
                prepend-icon="mdi-tag-outline"
                >
                <template #title>
                  <p class="text-caption text-medium-emphasis">Versão 1.0</p>
                </template>
            </v-list-item>
            </v-list>
          </div>
        </template>
      </v-navigation-drawer>

      <v-app-bar color="surface">

        <template #title>
          <span>{{ routes.meta.title }}</span>
        </template>

        <template #prepend>
          <v-btn
            icon="mdi-menu"
            variant="text"
            @click.stop="drawer = !drawer"
          ></v-btn>
        </template>
        
        <template #append>
          <div class="mr-4">
              <infoUser />
            </div>
        </template>
      </v-app-bar>

      <v-main style="overflow-y: auto;" class="bg-backgroundPrimary">
        <div class="dashboard-content ">
          <slot></slot>
        </div>
      </v-main>
    </v-layout>
</template>

<style scoped>

.dashboard-content::-webkit-scrollbar {
  width: 5px;
  background: #F4F4F4;
}

.dashboard-content::-webkit-scrollbar-thumb {
  background: #dad7d7;
}

</style>