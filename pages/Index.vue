<script setup lang="ts">

  const result = ref("")
  const loading = ref(false)

  const { start, finish } = useLoadingIndicator()


  async function api() {

    try {

    loading.value = true
    start()

    await new Promise((resolve) => setTimeout(resolve, 5000))  

    const { data } = await useFetch('/api/teste')

    result.value = data.value?.hello ?? " "

    } catch (err) {

      console.log("Error")

    } finally {

      loading.value = false
      finish()
      
    }

  }


</script>

<template>
  <NuxtLoadingIndicator :is="loading" color="#0096FF" :height="5"/>
  <div class="flex items-center justify-center flex-col gap-3 !mt-[200px]">
    <h1>Página inicial</h1>
     <v-btn
        :disabled="loading"
        :loading="loading"
        class="text-none mb-4"
        color="indigo-darken-3"
        size="x-large"
        variant="flat"
        block
        @click="api"
      >
        Buscar na API
      </v-btn>

  </div>
  
  <div class="flex items-center justify-center mt-4 bg-amber-300  text-amber-950">{{ result }}</div>
</template>