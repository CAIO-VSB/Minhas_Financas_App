<script setup lang="ts">

    definePageMeta({
    title: "Contas bancárias",
    layout: "layout-dashboard"
    })

    import CardAddAccount from "~/components/CardAddAccount.vue"

    const modal = ref(false)


    function teste() {
        modal.value = true
    }

</script>


<template>

    <div class="!mt-15">
        <v-card
        class="mx-auto"
        width="750"
        >
            <template v-slot:title>
                <span class="font-weight-black">Contas</span>
            </template>
            <template v-slot:subtitle>
                <span class="font-weight-black">Lista de contas ativas</span>
            </template>
            <v-divider></v-divider>
            <v-list >
                <v-list-item
                
                title="Conta nubank"
                subtitle="conta corrente"
                >
                
                <template #append>
                    <v-btn icon="mdi-pencil" variant="elevated" ></v-btn>
                    <v-tooltip
                    activator="parent"
                    location="end"
                    >
                    Editar conta
                    </v-tooltip>
                </template>
                </v-list-item>
            </v-list>

            <div>
                <Teleport v-if="modal" to="body">
                    <CardAddAccount v-model="modal"/>
                </Teleport>
            </div>
        </v-card>

        <div class="fab-wrapper">
            <v-tooltip text="Nova conta" location="left">
                <template #activator="{ props }">
                <v-fab
                    v-bind="props"
                    color="blue"
                    icon="mdi-plus"
                    size="60"
                    @click="teste"
                />
                </template>
            </v-tooltip>
        </div>

    </div>


</template>


<style lang="scss" scoped>

.fab-wrapper {
  position: fixed;
  bottom: 25px;
  right: 24px;
  z-index: 9999;
}

</style>

