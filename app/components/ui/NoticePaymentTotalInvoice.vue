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
        <v-icon icon="mdi-invoice-check" size="100" color="success" class="mb-3"></v-icon>
      </div>
      
      <h3 class="mb-4">Pagamento total</h3>

      <p class="mb-2">
        Trata-se do pagamento completo da sua fatura, recomendamos que você utilize essa funcionalidade após o dia de fechamento.
      </p>

      <p class="mb-4">
        Se sua fatura fechou com o valor de <strong>{{ formatCurrency(invoiceValue) }}</strong>, aqui você pagará esse valor todo de uma só vez.
      </p>

      <v-btn color="primary" block @click="handleConfirm">
        Prosseguir
      </v-btn>

    </v-card>
  </v-dialog>
</template>