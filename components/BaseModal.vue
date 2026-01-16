<script lang="ts" setup>

  const props = defineProps<{
    text: string | undefined,
    title: string,
  }>()

  const modelValue = defineModel<boolean>()

</script>

<template>
  <div class="text-center pa-4">
    <v-dialog
      :model-value="modelValue"
      width="auto"
      transition="dialog-top-transition"
    >
      <v-card
        max-width="400"
        prepend-icon="mdi mdi-bell-alert"
        :text="props.text"
        :title="props.title"
      >
      
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="modelValue = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>