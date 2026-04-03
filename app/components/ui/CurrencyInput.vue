<script setup lang="ts">
    import { useCurrencyInput } from 'vue-currency-input'

    const props = defineProps({ modelValue: Number })

    const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
        currency: "BRL",
        precision: 2,
    })

    watch(() => props.modelValue, (value) => {setValue(value || null)})

</script>

<template>
    <v-text-field 
    label="Limite"
    v-model="formattedValue"
    variant="underlined"
    ref="inputRef"
    >
    </v-text-field>
</template>