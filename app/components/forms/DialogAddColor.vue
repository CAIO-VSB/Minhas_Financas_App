<script lang="ts" setup>

  import { useSelectedColor } from '~/composables/useAccount/useSelectedColor';


  const modelValue = defineModel<boolean>() 

  const { selectColor } = useSelectedColor()

 
  function selectdItem(color: string) {
    selectColor(color)
  }

</script>

<template>
  <div class="d-flex justify-space-around">
    <v-dialog max-width="300" v-model="modelValue">
      <v-color-picker @update:model-value="selectdItem" hide-inputs show-swatches></v-color-picker>
    </v-dialog>
  </div>

</template>

<style scoped>

</style> 