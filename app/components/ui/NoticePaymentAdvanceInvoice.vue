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
    <v-card class="pa-4 text-center" rounded="lg">
      
      <div>
        <v-icon icon="mdi-invoice-fast-outline" size="100" color="primary" class="mb-3"></v-icon>
      </div>
      
      <h3 class="mb-4">Pagamento adiantado</h3>

      <p class="mb-2">
        Pague o valor adiantado de uma fatura que ainda está aberta para que o valor da fatura esteja menor quando ela estiver fechada.
      </p>

      <p class="mb-4">
        Pagar um valor adiantado não faz sua fatura fechar, você ainda terá que pagar o que restou da fatura quando chegar o dia de pagamento.
      </p>

      <v-btn rounded="lg" color="primary" block @click="handleConfirm">
        Prosseguir
      </v-btn>

    </v-card>
  </v-dialog>
</template>