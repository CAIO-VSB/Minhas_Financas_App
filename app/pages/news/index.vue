<script setup lang="ts">

    definePageMeta({
        title: "Novidades",
        layout: "layout-dashboard",
    })

</script>

<template>
  <div class="updates-wrapper">
    <v-card
      class="updates-card overflow-hidden"
      rounded="xl"
      elevation="4"
      max-width="560"
      width="100%"
    >
      <v-card-item class="pa-5 pb-3">
        <template #prepend>
          <v-avatar
            color="primary"
            variant="tonal"
            rounded="lg"
            size="46"
          >
            <v-icon
              icon="mdi-rocket-launch-outline"
              color="primary"
            />
          </v-avatar>
        </template>

        <v-card-title class="text-h6 font-weight-bold text-blue-grey-darken-4">
          Novidades
        </v-card-title>

        <v-card-subtitle class="mt-1">
          Fique por dentro do que está mudando
        </v-card-subtitle>
      </v-card-item>

      <v-divider />

      <v-empty-state
        icon="mdi-clock-outline"
        color="primary"
        class="pa-8"
        title="Nada por aqui ainda, mas logo tem novidade"
        text="É aqui que você vai acompanhar tudo que a gente for lançando — novos gráficos, ajustes e melhorias no Velto."
      >
        <template #actions>
          <v-chip
            class="mt-2"
            color="primary"
            variant="tonal"
            prepend-icon="mdi-clock-outline"
          >
            Em breve, novidades por aqui
          </v-chip>
        </template>
      </v-empty-state>
    </v-card>
  </div>
</template>

<style scoped>
.updates-wrapper {
  width: 100%;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
}

.updates-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.16);
}

::v-deep(.v-empty-state__icon-avatar) {
  margin-bottom: 4px;
}

::v-deep(.v-empty-state__title) {
  color: rgb(var(--v-theme-blue-grey-darken-4));
  font-size: 1.25rem;
  font-weight: 700;
}

::v-deep(.v-empty-state__text) {
  max-width: 440px;
  margin-top: 10px;
  font-size: 0.95rem;
  line-height: 1.6;
}

::v-deep(.v-empty-state__media) {
  margin-bottom: 4px;
}
</style>