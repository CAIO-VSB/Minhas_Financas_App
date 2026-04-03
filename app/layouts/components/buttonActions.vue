<script setup lang="ts">

  import { mergeProps } from 'vue'

  const props = defineProps<{
    rail: boolean
  }>()

  const items = [
    { title: 'Receita', icon: "mdi-arrow-up-circle-outline" },
    { title: 'Despesa', icon: "mdi-arrow-down-circle-outline" },
    { title: 'Despesa Cartão', icon: "mdi-credit-card-outline" },
    { title: 'Transferência', icon: "mdi-swap-horizontal" }
  ]
</script>


<template>
  <div class="text-center">
    <v-menu position="center" transition="fab-transition" >
      <template v-slot:activator="{ props: menu }">
        <v-tooltip location="top">
          <template v-slot:activator="{ props: tooltip }">
            <v-scale-transition mode="out-in">
            <v-btn
              v-if="!rail"
              color="primary"
              prepend-icon="mdi-plus"
              variant="elevated"
              rounded="xl"
              class="text-none"
              v-bind="mergeProps(menu, tooltip)"
            >
            Novo
            </v-btn>
            
            <v-btn
              v-else
              color="primary"
              icon="mdi-plus"
              size="44"
              variant="elevated"
              v-bind="mergeProps(menu, tooltip)"
            >
            </v-btn>
            </v-scale-transition>
          </template>
          <span>Novo lançamento</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :value="index"
          :prepend-icon="item.icon"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
