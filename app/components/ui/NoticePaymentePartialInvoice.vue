<script setup lang="ts">
  const modelValue = defineModel<boolean>()

  const props = defineProps<{
    invoiceValue: number
  }>()

    const emit = defineEmits<{
        showModalPayment: []
    }>()

  function handleConfirm() {
    modelValue.value = false
    emit("showModalPayment")
  }

</script>

<template>
  <v-dialog v-model="modelValue" max-width="500">
    <v-card class="pa-4 text-center">
      
      <div>
        <v-icon icon="mdi-invoice-text-arrow-right" size="100" color="warning" class="mb-3"></v-icon>
      </div>
      
      <h3 class="mb-4">Pagamento parcial</h3>

      <p class="mb-2">
        Caso não seja possível realizar o pagamento do valor total da sua fatura, é possível realizar o pagamento parcial de fatura.
      </p>

      <p class="mb-4">
        Quando isso ocorre, sua fatura no Velto será fechada (não se pode mais adicionar transações), e uma despesa com o valor restante será adicionada à fatura seguinte.
      </p>

      <v-btn color="primary" block @click="handleConfirm">
        Prosseguir
      </v-btn>

    </v-card>
  </v-dialog>
</template>