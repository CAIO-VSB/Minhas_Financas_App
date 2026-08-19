<script lang="ts" setup>

    const props = defineProps<{
        size: string,
        icon: string,
        color: string,
        disabled?: boolean

    }>()

    const modelValue = defineModel<boolean>()

</script>

<template>

    <div>
        <v-fab
            :disabled="props.disabled"
            :color="props.color"
            :icon="props.icon"
            :size="props.size"
          />
    </div>

</template>

