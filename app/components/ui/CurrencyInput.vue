<script setup lang="ts">
    import { useCurrencyInput } from 'vue-currency-input'

    const props = defineProps<{ modelValue: number | null, label: string, baseColor: string, color: string, inputColor?: string }>()

    const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
        currency: "BRL",
        precision: 2,
    })

    watch(() => props.modelValue, (value) => {setValue(value || null)})

</script>

<template>
    <v-text-field 
    :color="props.color"
    :base-color="props.baseColor"
    :label="props.label"
    v-model="formattedValue"
    variant="underlined"
    ref="inputRef"
    :style="{'--input-color': props.inputColor}"
    >
    </v-text-field>
</template>

<style scoped>

:deep(.v-field__input) {
    color: var(--input-color) !important;
}

</style>