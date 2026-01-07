<script setup lang="ts">
    
    import { useSelectedColor } from '~/composables/useAccount/useSelectedColor';


    const modelValue = defineModel<boolean>()

    const { selectdColor } = useSelectedColor()
    
    function selectdItem(color: string) {
        selectdColor(color)
    }

</script>

<template>
    <div>
        <v-dialog max-width="300" v-model="modelValue">
            <v-color-picker @update:model-value="selectdItem" hide-inputs show-swatches></v-color-picker>
        </v-dialog>
    </div>
</template>