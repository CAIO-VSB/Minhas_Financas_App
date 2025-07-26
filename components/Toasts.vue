<script lang="ts" setup>

    const props = defineProps<{
        timeout?: number,
        timer?: string,
        color?: string,
        width?: string,
        text?: string,
        modelValue: boolean
    }>()

    const modelValue = defineModel<boolean>()

</script>

<template>

    <div>
    <v-snackbar
      :timeout="props.timeout"
      :timer="props.timer"
      :color="props.color"
      :width="props.width"
      :text="props.text"
      v-model="modelValue"
    ></v-snackbar>
    </div>

</template>

<style scoped>

</style>