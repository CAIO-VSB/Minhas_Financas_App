<script lang="ts" setup>

    const props = defineProps<{
        timeout?: number,
        timer?: string,
        color?: string,
        width?: string,
        text?: string,
        icon?: string,
        size?: string,
        colorIcon?: string
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
      v-model="modelValue"
      class="elevation-24"
    >
    <v-icon :color="props.colorIcon" start end :icon="props.icon" :size="props.size"></v-icon>
    {{ props.text }}

    </v-snackbar>
    </div>

</template>

