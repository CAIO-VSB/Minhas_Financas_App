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
    <v-menu
        transition="scale-transition"
        >
        <template v-slot:activator="{ props }">
            <v-btn
            color="primary"
            v-bind="props"
            class="text-none elevation-1"
            variant="tonal"
            append-icon="mdi-arrow-down-drop-circle"
            >
            {{ titleButtonOption }}
            </v-btn>
        </template>

        <v-list>
            <v-list-item
            v-for="(item, i) in itemsRouter"
            :key="i"
            :value="i"
            @click="getTitleRouter(item)"
            >
            <template v-slot:prepend>
                <v-icon :color="item.color">mdi-circle-medium</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>

    <div class="w-100 d-flex justify-sm-end ga-3 pr-4 ">
        <v-btn
        color="primary"
        prepend-icon="mdi-filter-variant"
        class="text-none elevation-1"
        variant="tonal"
        @click="showDrawer"
        >
        Filtro
        </v-btn>
    </div>

</template>


<style scoped>

</style>