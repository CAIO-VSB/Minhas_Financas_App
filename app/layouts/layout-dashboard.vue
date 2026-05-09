<script lang="ts" setup>

  type TOptions = {
    prependIcon: string,
    icon: string,
    title: string
  }
 
  import defaultUser from "@/assets/default-user.webp"
  import InfoUser from './components/InfoUser.vue'
  import ButtonActions from './components/buttonActions.vue'
  
  const { $authClient } = useNuxtApp()
 
  const { data: session } = await $authClient.getSession()

  const drawer = ref(true)
  const rail = ref(false)
  const openedGroups = ref(['Groups'])
  const routes = useRoute()

  watch(rail, () => {
    openedGroups.value = []
  })
  

</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        @click="rail = false"
        style="height: 100vh;"
        :width="350"
    
      >
        <v-list >
          <v-list-item
          >
            <template #prepend>
              <client-only>
               <v-avatar :image="session?.user.image || defaultUser"></v-avatar>
              </client-only>
            </template>
            
            <template #title>
              <client-only>
                {{ session?.user.name }}
              </client-only>
            </template>

            <template #subtitle>
              <client-only>
                {{ session?.user.email }}
              </client-only>
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

        <ButtonActions style="margin-top: 10px; margin-bottom: 10px;"  :rail="rail"/>

        <v-list density="compact" nav v-model:opened="openedGroups">
            <v-list-item
                prepend-icon="mdi-home-analytics"
                title="Visão geral"
                value="Visão geral"
                to="/home"
            >
                <v-tooltip
                activator="parent"
                location="start"
                >Visão geral</v-tooltip>
            </v-list-item>


            <v-list-item
                prepend-icon="mdi-swap-horizontal-bold"
                title="Transações"
                value="transacoes"
                to="/transactions"
            >
                <v-tooltip
                activator="parent"
                location="start"
                >Transações</v-tooltip>   
            </v-list-item>


            <v-list-item
                prepend-icon="mdi-credit-card-multiple-outline"
                title="Cartões de crédito"
                value="cartoes"
                to="/credit-card"
            >
                <v-tooltip
                activator="parent"
                location="start"
                >Cartões de crédito</v-tooltip>   
            </v-list-item>

            <v-list-item
            prepend-icon="mdi-piggy-bank-outline"
            title="Economia"
            value="economia"
            >
              <v-tooltip
                activator="parent"
                location="start"
              >Economia</v-tooltip>   
          </v-list-item>

            <v-list-group value="Cadastros" >
              <template v-slot:activator="{ props }">
                  <v-list-item
                  v-bind="props"
                  title="Cadastros"
                  prepend-icon="mdi-database-plus"
                  >
                  <v-tooltip
                  activator="parent"
                  location="start"
                  >Cadastros</v-tooltip>
                  </v-list-item>
              </template>

            <v-list-item
            prepend-icon="mdi-folder-outline"
            title="Categorias"
            value="categoria"
            to="/categories"
            ></v-list-item>

            <v-list-item
            prepend-icon="mdi-bank-outline"
            title="Contas bancárias"
            value="contas"
            to="/accounts"
            ></v-list-item>

            </v-list-group>
              <v-list-item
                prepend-icon="mdi-file-chart-outline"
                title="Relatórios"
                value="relatorios"
            >
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
                style="color: #777;"
                >
                <template #title>
                  <p style="font-size: 0.60rem; color: #777;">Versão 1.0</p>
                </template>
            </v-list-item>
            </v-list>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main style="height: 100vh; background-color: #f2f2f2;">
        <div class=" title-router flex align-center">
          <v-btn
            icon="mdi-menu"
            variant="text"
            @click.stop="drawer = !drawer"
          ></v-btn>
          <p class="text-title">{{ routes.meta.title }}</p>
          <div class="info-user">
            <infoUser />
          </div>
        </div>
        <slot></slot>
      </v-main>

    </v-layout>
  </v-card>
</template>

<style scoped >

::v-deep(.v-list-item--nav .v-list-item-title) {
  font-size: 0.95rem;
}

.title-router {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
}

.text-title {
  white-space: nowrap;
  margin-right: 12px;
}

.info-user {
  width: 100%;
  display: flex;
  align-items: end;
  justify-content: end;
  margin-right: 60px;
}

::-webkit-scrollbar {
  width: 5px;
  background: #F4F4F4;
}

::-webkit-scrollbar-thumb {
  background: #dad7d7;
}

</style>