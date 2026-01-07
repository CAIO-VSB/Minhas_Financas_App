<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'

// mutation = ação que altera o servidor
const {
  isPending,
  isError,
  error,
  isSuccess,
  mutateAsync
} = useMutation({
  mutationFn: (newTodo: { title: string }) => {
    return $fetch('/api/teste', {
      method: 'POST',
      body: newTodo
    })
  }
})

// evento do botão
async function addTodo() {
  try {
    const data = await mutateAsync({ title: 'Do Laundry' })
    console.log(data) // aqui você tem a resposta
  } catch (err) {
    console.error(err)
  }
}

</script>

<template>
  <div style="padding: 20px">
    <p v-if="isPending">Criando todo...</p>
    <p v-else-if="isError">Erro: {{ error?.message }}</p>
    <p v-else-if="isSuccess">Todo criado com sucesso!</p>
    <p>Todo criado {{ data }}</p>

    <button @click="addTodo">
      Criar Todo
    </button>
  </div>
</template>
