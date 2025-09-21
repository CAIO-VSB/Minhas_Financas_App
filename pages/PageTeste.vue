<template>
  <v-container>
    <v-text-field
      v-model="password"
      label="Senha"
      type="password"
      outlined
    />

    <v-list lines="one">
  <v-list-item
    v-for="n in 3"
    :key="n"
    :title="'Item ' + n"
    subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
  ></v-list-item>
</v-list>
    
    <v-list dense > 
      <v-list-item >
        <v-icon :color="hasUppercase ? 'green' : 'red'">
          {{ hasUppercase ? 'mdi-check' : 'mdi-close' }}
        </v-icon>
        <v-list-item-title>Contém pelo menos uma letra maiúscula</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-icon :color="hasLowercase ? 'green' : 'red'">
          {{ hasLowercase ? 'mdi-check' : 'mdi-close' }}
        </v-icon>
        <v-list-item-title>Contém pelo menos uma letra minúscula</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-icon :color="hasNumber ? 'green' : 'red'">
          {{ hasNumber ? 'mdi-check' : 'mdi-close' }}
        </v-icon>
        <v-list-item-title>Contém pelo menos um número</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-icon :color="hasSpecial ? 'green' : 'red'">
          {{ hasSpecial ? 'mdi-check' : 'mdi-close' }}
        </v-icon>
        <v-list-item-title>Contém pelo menos um caractere especial</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-icon :color="hasMinLength ? 'green' : 'red'">
          {{ hasMinLength ? 'mdi-check' : 'mdi-close' }}
        </v-icon>
        <v-list-item-title>Mínimo de 8 caracteres</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const password = ref('')
const isVisible = ref(false)

const hasUppercase = computed(() => /[A-Z]/.test(password.value))
const hasLowercase = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /[0-9]/.test(password.value))
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(password.value))
const hasMinLength = computed(() => password.value.length >= 8)

</script>
