<script setup>

  definePageMeta({
    layout: "layout-dashboard"
  })

  import { ref } from 'vue'
  import { useAuthStore } from '~/store/modules/auth-store'

  const authStore = useAuthStore()

  const drawer = ref(true)
  const rail = ref(true)

</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
        style="height: 100vh; background-color: blue;"
      >
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
            :title="authStore.user?.name || 'Melhorar futuramente'"
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

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-home-analytics"
            title="Visão geral"
            value="Visão geral"
          ></v-list-item>

          <v-list-group value="movimentações">
            <template v-slot:activator="{ props }">
              <v-list-item
              v-bind="props"
              title="Movimentações e caixa"
              prepend-icon="mdi-swap-horizontal-bold"
              >
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
            value="cartões"
          ></v-list-item>

          <v-list-group value="Metas">
            <template v-slot:activator="{ props }">
              <v-list-item
              v-bind="props"
              title="Metas"
              prepend-icon="mdi-target"
              >
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

          <v-list-group value="Cadastros">
            <template v-slot:activator="{ props }">
              <v-list-item
              v-bind="props"
              title="Cadastros"
              prepend-icon="mdi-database-plus"
              >
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
          ></v-list-item>

          
          <v-divider></v-divider>

          <v-list-item
            prepend-icon="mdi-power"
            title="Sair"
            value="sair"
          ></v-list-item>

        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 100vh; background-color: red;"></v-main>
    </v-layout>
  </v-card>
</template>

<style scoped lang="scss"></style>