<script setup lang="ts">
  defineProps<{
    title: string
    subtitle?: string
    maxWidth?: string
  }>()
</script>

<template>
  <v-card rounded="xl" elevation="4" >
    <v-card-item class="pa-5 pb-2">
      <v-card-title class="text-h6 font-weight-bold text-blue-grey-darken-4">
        {{ title }}
      </v-card-title>
      <v-card-subtitle v-if="subtitle" class="mt-1">
        {{ subtitle }}
      </v-card-subtitle>
      <template #append>
        <slot name="header-append" />
      </template>
    </v-card-item>

    <v-divider />

    <slot />
  </v-card>
</template>