<script setup lang="ts">
    import { useCurrencyInput } from 'vue-currency-input'

    const props = defineProps({ modelValue: Number })

    const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
        currency: "BRL",
        precision: 2,
    })

    watch(() => props.modelValue, (value) => {setValue(value || null)})

    const rules = computed(() =>[
        () => !!numberValue.value || "Campo obrigatório",
        () => (numberValue.value!) >= 0 || "O valor não pode ser menor que zero"
    ])
    
</script>

<template>
    <v-text-field 
    label="Limite"
    v-model="formattedValue"
    variant="underlined"
    ref="inputRef"
    :rules="rules"
    >
    </v-text-field>
</template>