<script setup lang="ts">

    import InfoUser from '~/layouts/components/MyAccount.vue'

    const emits = defineEmits(['drawer'])

    const drawer = defineModel<boolean>()
    const showDialog = ref(false)

    const items = [
    { title: 'Novidade na área - v1.3' },
    { title: 'Click Me' },
    { title: 'Click Me' },
    { title: 'Click Me 2' },
  ]

    const routes = useRoute()

    function handleEmitsDrawer() {
        drawer.value = !drawer.value
    }

</script>

<template>
  <v-app-bar
    color="surface"
    flat
    border="b"
    height="68"
  >
    <template #prepend>
      <v-btn
        icon="mdi-menu"
        variant="text"
        color="blue-grey-darken-2"
        rounded="lg"
        class="ml-1"
        @click.stop="handleEmitsDrawer"
      />
    </template>

    <template #title>
      <span class="font-weight-bold text-blue-grey-darken-4 page-title">
        {{ routes.meta.title }}
      </span>
    </template>

    <template #append>
      <div class="d-flex align-center ga-1 mr-2">
        <!-- Notificações -->
        <v-menu
          transition="scale-transition"
          location="bottom end"
          offset="8"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="blue-grey-darken-2"
              rounded="lg"
            >
              <v-badge
                color="error"
                content="3"
                offset-x="3"
                offset-y="3"
              >
                <v-icon
                  icon="mdi-bell-outline"
                  size="23"
                />
              </v-badge>
            </v-btn>
          </template>

          <v-card
            min-width="340"
            max-width="380"
            rounded="xl"
            elevation="4"
            class="overflow-hidden"
          >
            <div class="d-flex align-center justify-space-between pa-4">
              <div>
                <div class="text-subtitle-1 font-weight-bold text-blue-grey-darken-4">
                  Notificações
                </div>

                <div class="text-caption text-medium-emphasis">
                  3 novidades para você
                </div>
              </div>

              <v-btn
                icon="mdi-dots-horizontal"
                variant="text"
                size="small"
                rounded="lg"
              />
            </div>

            <v-divider />

            <v-list
              density="comfortable"
              class="pa-2"
            >
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                rounded="lg"
                class="notification-item mb-1"
              >
                <template #prepend>
                  <v-avatar
                    size="38"
                    rounded="lg"
                    color="primary-lighten-5"
                    class="mr-2"
                  >
                    <v-icon
                      icon="mdi-information-outline"
                      color="primary"
                      size="20"
                    />
                  </v-avatar>
                </template>

                <v-list-item-title
                  class="text-body-2 font-weight-medium text-blue-grey-darken-3"
                >
                  {{ item.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-caption mt-1">
                  Confira as novidades do Velto.
                </v-list-item-subtitle>

                <template #append>
                  <v-icon
                    icon="mdi-chevron-right"
                    size="18"
                    class="text-medium-emphasis"
                  />
                </template>
              </v-list-item>
            </v-list>

            <v-divider />

            <div class="pa-3">
              <v-btn
                block
                variant="text"
                color="primary"
                rounded="lg"
                class="text-none font-weight-bold"
              >
                Ver todas as notificações
              </v-btn>
            </div>
          </v-card>
        </v-menu>

        <!-- Minha conta -->
        <InfoUser />
      </div>
    </template>
  </v-app-bar>
</template>

<style scoped>
.page-title {
  font-size: var(--text-md);
}

.notification-item {
  transition: background-color 0.15s ease;
}
</style>