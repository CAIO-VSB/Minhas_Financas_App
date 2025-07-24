<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <v-text-field
    label="Senha"
    :type="show ? 'text' : 'password'"
    :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
    @click:append-inner="show = !show"
    variant="outlined"
    hide-details
  />
</template>
