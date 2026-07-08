<script setup lang="ts">

    const propsCards = defineProps<{
        subtitle: string,
        loading: boolean,
        value: number | null
        color?: string,
        variant?: string,
        icon?: string,
        size?: string,
        textToolTip?: string,
        iconToolTip?: string,
        sizeIconToolTip?: string
    }>()
    
</script>

<template>

    <v-card :loading="propsCards.loading">
        <div class="d-flex align-center ga-2 pl-2 mb-2">
            <div class="pa-2 rounded-lg ">
                <v-avatar 
                :color="propsCards.color"
                variant="tonal" 
                :icon="propsCards.icon"
                :size="propsCards.size"
                rounded="lg"
                ></v-avatar>
            </div>
            <span class="font-weight-semibold card-value" >{{ formatCurrency(propsCards.value) }}</span>
        </div>
        
        <template #subtitle>
            <p class="card-label">{{ propsCards.subtitle }}</p>
        </template>

        <template #append>
            <v-tooltip :text="propsCards.textToolTip">
                <template v-slot:activator="{ props }">
                    <v-icon class="icon-help" v-bind="props" :size="propsCards.sizeIconToolTip" :icon="propsCards.iconToolTip"></v-icon>
                </template>
            </v-tooltip>
        </template>
    </v-card>

</template>

<style scoped>

.card-label {
    font-size: var(--text-base);
}

.card-value {
    font-size: var(--text-md);
    font-weight: 500;
}

.icon-help:hover {
    transform: scale(1.3);
    cursor: pointer;
}

</style>