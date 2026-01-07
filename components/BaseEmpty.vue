<script setup lang="ts">

    const props = defineProps<{
        headline: string,
        title: string,
        text: string
    }>()

    const modelValue = defineModel<boolean>()

</script>


<template>
  <v-empty-state v-model="modelValue" icon="$warning">
    <template v-slot:media>
      <v-icon color="surface-variant"></v-icon>
    </template>

    <template v-slot:headline>
      <div class="text-h4">
        {{ props.headline }}
      </div>
    </template>

    <template v-slot:title>
      <div class="text-h6">
        {{ props.title }}
      </div>
    </template>

    <template v-slot:text>
      <div class="text-large-emphasis text-caption">
        {{ props.text }}
      </div>
    </template>
  </v-empty-state>
</template>