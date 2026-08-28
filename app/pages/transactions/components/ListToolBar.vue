<script setup lang="ts">

    type option = {
        title: string,
        color: string,
        value: string,
        route: string
    }

    const route = useRoute()
    const modelValue = defineModel<boolean>()
    const emits = defineEmits<{
        showDrawer: [drawer: boolean]
    }>()

    const itemsRouter = [
        { title: 'Todas as transações', color: "#673AB7", value: "todas",          route: "/transactions" },
        { title: 'Despesas',            color: "#F44336", value: "despesas",       route: "/transactions/expense" },
        { title: 'Receitas',            color: "#4CAF50", value: "receitas",       route: "/transactions/revenue" },
        { title: 'Transferências',      color: "#2196F3", value: "transferencias", route: "/transactions/transfer" },
    ]
        
    const currentItem = computed(() => {
       return itemsRouter.find(item => item.route === route.path)
    })

    const titleButtonOption = computed(() => {
        return currentItem.value?.title ?? "Todas"
    })

    const showDrawer = () => {
        emits("showDrawer", true)
    }

    function getTitleRouter(item: option) {
        navigateTo(item.route)
    }

</script>


<template>
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 w-100">
        <v-menu
            transition="scale-transition"
            offset="8"
        >
            <template #activator="{ props }">
                <v-btn
                    v-bind="props"
                    color="primary"
                    variant="tonal"
                    append-icon="mdi-chevron-down"
                    rounded="lg"
                    class="text-none font-weight-medium"
                >
                    {{ titleButtonOption }}
                </v-btn>
            </template>

            <v-card
                min-width="240"
                rounded="xl"
                elevation="3"
                class="overflow-hidden"
            >
                <v-list
                    density="comfortable"
                    class="pa-2"
                >
                    <v-list-item
                        v-for="(item, index) in itemsRouter"
                        :key="index"
                        :value="index"
                        rounded="lg"
                        @click="getTitleRouter(item)"
                    >
                        <template #prepend>
                            <v-icon
                                icon="mdi-circle-medium"
                                :color="item.color"
                                class="mr-2"
                            />
                        </template>

                        <v-list-item-title class="font-weight-medium">
                            {{ item.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>

        <v-btn
            color="primary"
            prepend-icon="mdi-filter-variant"
            variant="flat"
            rounded="lg"
            class="text-none font-weight-bold"
            @click="showDrawer"
        >
            Filtro
        </v-btn>
    </div>
</template>

<style scoped>
</style>