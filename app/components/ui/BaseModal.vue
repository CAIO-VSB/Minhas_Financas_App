<script lang="ts" setup>

  const props = defineProps<{
    title: string,
    persistentModal?: boolean
  }>()

  const emits = defineEmits<{
    closeModal: []
  }>()

  const modelValue = defineModel<boolean>()

  function closeModal() {
    modelValue.value = false
    emits("closeModal")
  }

</script>

<template>
  <div class="text-center pa-4">
    <v-dialog
      :model-value="modelValue"
      width="auto"
      transition="dialog-top-transition"
      :persistent="props.persistentModal"
    >
      <v-card
        max-width="600"
        prepend-icon="mdi mdi-bell-alert"
        :title="props.title"
      >
        <slot></slot>
        <template v-slot:actions>
           <v-spacer></v-spacer>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="closeModal"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>