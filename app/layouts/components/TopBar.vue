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
          
    <v-app-bar :elevation="1" color="surface">

        <template #title>
            <span class="font-weight-semibold" style="font-size: var( --text-md);">{{ routes.meta.title }}</span>
        </template>
        

        <template #prepend>
            <v-btn
            icon="mdi-menu"
            variant="text"
            @click.stop="handleEmitsDrawer"
            ></v-btn>
        </template>
        
        <template #append>
            <div class="mr-1">
                <InfoUser />
            </div>
        </template>


        <v-menu
            transition="slide-x-transition"
            >
            <template v-slot:activator="{ props }">

                <v-btn v-bind="props" class="text-none" >
                    <v-badge color="error" content="3">
                        <v-icon size="24">mdi-bell</v-icon>
                    </v-badge>
                </v-btn>
                
            </template>

            <v-list>
                <v-list-item
                v-for="(item, i) in items"
                :key="i"
                :value="i"
                >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

    </v-app-bar>

</template>