<script lang="ts" setup>
  import colors from '~/public/colors/catalog';

  const modelValue = defineModel<boolean>()

  const valueEntered = ref("")
  const currentRadio = ref("")
  const loading = ref(false)


  watch(valueEntered, () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 2000);
  })

  const finalData = computed(() => {
    return colors.filter(item => {
      const onlyText = item.name.toLowerCase().includes(valueEntered.value.toLowerCase())
      const onlyRadio = item.name.toLowerCase().includes(currentRadio.value.toLowerCase())
      return onlyText && onlyRadio
    })
  })

</script>

<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="modelValue"
      persistent
    >

      <v-card
        class="mx-auto"
        width="350"
      >
        <v-toolbar>
          <v-toolbar-title class="title-card">Selecione uma cor de identificação</v-toolbar-title>
        </v-toolbar>

        <div>
            <v-text-field
                color="blue"
                :loading="loading"
                label="Buscar…"
                class="!p-4"
                prepend-inner-icon="mdi-magnify"
                v-model="valueEntered"
            >
            </v-text-field>
        </div>

        <v-divider></v-divider>

        <v-list
          lines="two"
          item-props
          activatable
          >

          <v-list-item
            v-for="(item, i) in finalData"
            :key="i"
            rounded="xl"
          >

          <template v-slot:prepend>
            <v-avatar :color="item.cor" size="45"></v-avatar>
          </template>

          <v-list-item-title class="item-text">{{ item.name }}</v-list-item-title>
          
          </v-list-item>

        </v-list>
    </v-card>

  </v-dialog>


  </div>

</template>

<style scoped>

.container-icons {
  padding: 5px;
  height: 100vh;
}

.item-text {
  font-size: 0.90rem;
  color: #AFB1AC;
}

.title-card {
  font-weight: 500;
  font-size: 1rem;
}

::v-deep(.v-selection-control .v-label ) {
  font-size: 0.85rem;
}

::v-deep(.v-card-item .v-card-title ) {
  font-size: 1.3rem;
}


</style> 