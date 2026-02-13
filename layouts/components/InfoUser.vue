<script setup lang="ts">

    import { authClient } from "@/lib/auth-client"
    import defaultUser from "@/assets/default-user.webp"

    const { data: session } = await authClient.getSession()

    import { ref } from 'vue'
    import { useAuthStore } from "~/store/modules/auth-store"

    const menu = ref(false)

    const authClientStore = useAuthStore()

    function handleSignout() {
        authClientStore.logout()
    }


</script>

<template>
    <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      location="bottom"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          append-icon="mdi-menu-down"
          class="text-none rounded-xl"
          variant="outlined"
          color="primary"
          prepend-icon="mdi-account-settings"
        >
          Minha conta
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-list>
          <v-list-item
            :prepend-avatar="session?.user.image || defaultUser"
            subtitle="Conta pessoal"
            :title="session?.user.name"
          >
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <div class="new-account-button">
            <v-btn
            color="primary"
            class="text-none rounded-xl button-singup"
            >
            Criar nova conta
            </v-btn>
        </div>

        <v-divider></v-divider>

        <v-divider :thickness="1"></v-divider>

        <v-card-actions style="background-color: #f2f2f2;">
          <div class="main-logged-as">
            <span class="title-logged-as">Logado como:</span>
            <span class="subtitle-logged-as">{{ session?.user.email }}</span>
          </div>
          <v-spacer></v-spacer>

          <v-tooltip
            location="bottom"
            >
            <template v-slot:activator="{ props }">
                <v-btn
                icon
                v-bind="props"
                >
                <v-icon >
                    mdi-cog
                </v-icon>
                </v-btn>
            </template>
            <span>Configurações</span>
          </v-tooltip>

          <v-tooltip
            location="bottom"
            >
            <template v-slot:activator="{ props }">
                <v-btn
                icon
                v-bind="props"
                @click="handleSignout"
                >
                <v-icon color="red">
                    mdi-power
                </v-icon>
                </v-btn>
            </template>
            <span>Sair</span>
          </v-tooltip>

        </v-card-actions>
      </v-card>
    </v-menu>
  </div>

</template>

<style lang="scss" scoped>

.new-account-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
}

.title-logged-as {
    font-size: 0.75rem;
    display: flex;
    flex-direction: column;
}

.subtitle-logged-as {
    font-size: 0.85rem;
}

.button-singup {
  background-color: transparent !important;
  border: 1px solid $color-primary;
  color: $color-primary !important;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
}

.button-singup:hover {
  background-color: $color-primary !important;
  color: white !important;
}


</style>