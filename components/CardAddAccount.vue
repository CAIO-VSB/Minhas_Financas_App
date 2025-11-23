<script lang="ts" setup>

  const modelValue = defineModel<boolean>()

  const items = ref([
    'Corrente',
    'Poupanca',
  ])

  const ex11 = ref(false)
</script>

<template>
  <div class="text-center">
    <v-dialog v-model="modelValue" max-width="600">
      <v-card title="Nova conta">
        <v-card-text>

          <form>
            <v-text-field
              label="Nome da conta *"
              variant="underlined"
            ></v-text-field>

            <v-select label="Tipo *" :items="items" variant="underlined"></v-select>

            <v-text-field label="E-mail" variant="underlined"></v-text-field>

            <v-select label="Select *" variant="underlined"></v-select>

            <v-switch
              v-model="ex11"
              color="success"
              label="Ativo"
              value="success"
              hide-details
            ></v-switch>

          </form>

          <small class="text-caption text-medium-emphasis"
            >*Indica campos obrigatórios</small
          >
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Fechar"
            variant="plain"
            @click="modelValue = false"
          ></v-btn>

          <v-btn
            color="primary"
            text="Salvar"
            variant="tonal"
            @click="modelValue = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
