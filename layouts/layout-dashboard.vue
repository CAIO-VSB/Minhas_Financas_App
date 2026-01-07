<script lang="ts" setup>

  import { ref } from 'vue'
  import { authClient } from "@/lib/auth-client"

  const { data: session } = await authClient.getSession()

  const drawer = ref(true)
  const rail = ref(true)
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
        <v-list>
          <v-list-item
            :title="session?.user.name"
            :subtitle="session?.user.email"
          >
            <template v-slot:append>
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="rail = !rail"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav v-model:opened="openedGroups">
            <v-list-item
                prepend-icon="mdi-home-analytics"
                title="Visão geral"
                value="Visão geral"
                to="/dashboard/home"
            >
                <v-tooltip
                activator="parent"
                location="start"
                >Visão geral</v-tooltip>
            </v-list-item>

            <v-list-group value="Movimentacoes">
            <template v-slot:activator="{ props }">
                <v-list-item
                v-bind="props"
                title="Movimentações e caixa"
                prepend-icon="mdi-swap-horizontal-bold"
                >
                <v-tooltip
                activator="parent"
                location="start"
                >Movimentações e caixa</v-tooltip>
                </v-list-item>
            </template>

            <v-list-item
            prepend-icon="mdi-view-list"
            title="Lançamentos"
            value="lancamentos"
            ></v-list-item>

            <v-list-item
            prepend-icon="mdi-finance"
            title="Fluxo"
            value="fluxo"
            ></v-list-item>

            <v-list-item
            prepend-icon="mdi-format-list-checks"
            title="A pagar e receber"
            value="a pagar e receber"
            ></v-list-item>

            <v-list-item
            prepend-icon="mdi-clipboard-check"
            title="Pagas e recebidas"
            value="pagas e recebidas"
            ></v-list-item>

            </v-list-group>

            <v-list-item
                prepend-icon="mdi-credit-card-multiple-outline"
                title="Cartões de crédito"
                value="cartoes"
                to="/dashboard/cartoes"
            >
                <v-tooltip
                activator="parent"
                location="start"
                >Cartões de crédito</v-tooltip>   
            </v-list-item>

            <v-list-group value="Metas">
            <template v-slot:activator="{ props }">
                <v-list-item
                v-bind="props"
                title="Metas"
                prepend-icon="mdi-target"
                >
                <v-tooltip
                activator="parent"
                location="start"
                >Metas</v-tooltip>
                </v-list-item>
            </template>

            <v-list-item
            prepend-icon="mdi-chart-pie"
            title="Orçamento"
            value="orçamento"
            ></v-list-item>

            <v-list-item
            prepend-icon="mdi-piggy-bank-outline"
            title="Economia"
            value="economia"
            ></v-list-item>

            </v-list-group>

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
            ></v-list-item>

            <v-list-item
            prepend-icon="mdi-bank-outline"
            title="Contas bancárias"
            value="contas"
            to="/dashboard/accounts"
            ></v-list-item>

            <v-list-item
            prepend-icon="mdi-tag-multiple"
            title="Tags"
            value="tags"
            ></v-list-item>

            </v-list-group>

            <v-divider></v-divider>

            <v-list-item
            prepend-icon="mdi-account"
            title="Minha conta"
            value="Minha conta"
            >
            <v-tooltip
            activator="parent"
            location="start"
            >Minha conta</v-tooltip>
            </v-list-item>

        </v-list>

        <template v-slot:append>
          <div class="mb-4">
            <v-list density="compact" nav >
                <v-list-item
                prepend-icon="mdi-power"
                title="Sair"
                value="sair"
                :active="true"
                color="red"
                >
                <v-tooltip
                activator="parent"
                location="start"
                >Sair</v-tooltip>
            </v-list-item>
            </v-list>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main style="height: 100vh; background-color: #f2f2f2;">
        <div class="flex align-center justify-center!p-3">
          <v-btn
            icon="mdi-menu"
            variant="text"
            @click.stop="drawer = !drawer"
          ></v-btn>
          <p class="title-router">{{ routes.meta.title }}</p>
        </div>
        <slot></slot>
      </v-main>

    </v-layout>
  </v-card>
</template>

<style scoped lang="scss">

::v-deep(.v-list-item--nav .v-list-item-title) {
  font-size: 1rem;
}

.title-router {
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
}

</style>