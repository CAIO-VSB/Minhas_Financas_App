<script setup lang="ts">
    import { useCurrencyInput } from "vue-currency-input"

    const props = defineProps<{
        label?: string
    }>()

    const model = defineModel<number | null>()

    const { inputRef, formattedValue } = useCurrencyInput({
      currency: "BRL",
      locale: "pt-BR"
    })
    
</script>

<template>
    <v-text-field
        ref="inputRef"
        :label="label"
        variant="underlined"
        :model-value="model"
    />
</template>