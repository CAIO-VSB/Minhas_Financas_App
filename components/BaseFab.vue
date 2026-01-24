<script lang="ts" setup>

    const props = defineProps<{
        size: string,
        icon: string,
        color: string

    }>()

    const modelValue = defineModel<boolean>()

</script>

<template>

    <div>
        <v-fab
            :color="props.color"
            :icon="props.icon"
            :size="props.size"
          />
    </div>

</template>

