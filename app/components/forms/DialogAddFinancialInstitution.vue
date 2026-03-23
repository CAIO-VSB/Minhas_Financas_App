<script lang="ts" setup>

  import { useSelectedBank, type TSelectBank } from "~/composables/useAccount/useSelectedBank"
  import banks from "~~/shared/banks/catalog"

  const { selectBank } = useSelectedBank()

  const dialogFilter = ref(false)
  const valueEntered = ref("")
  const radios = ref("")
  const currentRadio = ref("")
  const loading = ref(false)

  function selectdItem(data: TSelectBank) {
    selectBank(data)
  }

  watch(radios, (newValue: string) => {
    currentRadio.value = newValue
    dialogFilter.value = false
  })

  watch(valueEntered, () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 2000);
  })

  const finalData = computed(() => {
    return banks.filter(item => {
      const onlyText = item.text.toLowerCase().includes(valueEntered.value.toLowerCase())
      const onlyRadio = item.type.toLowerCase().includes(currentRadio.value.toLowerCase())
      return onlyText && onlyRadio
    })
  })

  const modelValue = defineModel<boolean>()


</script>

<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="modelValue"
      max-width="600"
      min-height="600"
      persistent
    >

      <v-card
        class="mx-auto"
        width="360"
      >
        <v-toolbar>
          <v-toolbar-title class="title-card">Selecione uma instituição financeira</v-toolbar-title>
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
            <template #append-inner>
                <v-btn
                text="Fechar"
                icon="mdi-filter"
                variant="text"
                @click="dialogFilter = true"
                >
                </v-btn>
            </template>
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
            @click="selectdItem({name: item.text, url: item.url, avatar: item.avatar})"
          >

          <template v-slot:prepend>
            <v-avatar :image="item.avatar" size="54"></v-avatar>
          </template>

          <v-list-item-title class="item-text">{{ item.text }}</v-list-item-title>
          
          </v-list-item>

        </v-list>
    </v-card>

  </v-dialog>

  <v-dialog
      v-model="dialogFilter"
      max-width="250"
    >
      <v-card title="Filtro">

        <v-radio-group v-model="radios">
          <v-radio label="Instituições Financeiras" value="instituicoes" ></v-radio>
          <v-radio label="Bandeiras Cartão" value="bandeiras"></v-radio>
          <v-radio label="Ícones Genéricos" value="generics"></v-radio>
        </v-radio-group>

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
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  color: #AFB1AC;
}

.title-card {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
}

::v-deep(.v-selection-control .v-label ) {
  font-family: "Poppins", sans-serif;
  font-size: 0.85rem;
}

::v-deep(.v-card-item .v-card-title ) {
  font-family: "Poppins", sans-serif;
  font-size: 1.3rem;
}
</style> 