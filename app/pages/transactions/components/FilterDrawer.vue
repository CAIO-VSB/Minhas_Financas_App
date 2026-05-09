<script setup lang="ts">
    const modelValue = defineModel<boolean>()
</script>

<template>

    <v-navigation-drawer
        v-model="modelValue"
        location="right"
        temporary
        width="470"
        >

        <v-list >
            <v-list-item
            >
            <template #title>
            <span style="font-weight: 600; font-size: 1.2rem;">Filtro de transações</span>
            </template>
            </v-list-item>
            </v-list>

            <v-divider ></v-divider>

            <div class="filter-main">

            <div class="d-flex justify-center">
                <v-date-input
                v-model="model"
                label="Selecione o período"
                multiple="range"
                autocomplete="off"
                prepend-icon=""
                variant="underlined"
                clearable
                ></v-date-input>
            </div>

            <div>
                <v-select
                autocomplete="off"
                :loading="isPending"
                v-model="modelCategorias"
                v-model:menu="menuCategorias"
                :items="filterCategorias"
                item-title="name_identifier"
                item-value="id"
                variant="underlined"
                label="Categoria"
                persistent-hint
                :rules="selectRules"
                >                
                    <template v-slot:selection="{item}">
                    <v-avatar style="width: 30px; height: 30px; margin-right: 12px;"> 
                        <v-avatar :icon="item.raw.url_icon"></v-avatar>
                    </v-avatar>
                    <span>{{ item.raw.name_identifier }}</span>
                    </template>

                    <template v-slot:item="{props, item}">
                    <v-list-item v-bind="props">
                        <template v-slot:prepend>
                        <v-avatar :icon="item.raw.url_icon"></v-avatar>
                        </template>
                    </v-list-item>
                    </template>

                    <template v-slot:prepend-item>
                    <div class="pa-2 border-b">
                        <v-text-field
                        v-model="searchCategorias"
                        :error="!!searchCategorias && !filterCategorias?.length"
                        density="compact"
                        placeholder="Buscar..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        @click.stop
                        @keydown.stop
                        @mousedown.stop
                        hide-details="auto"
                        >                 
                    </v-text-field>
                    </div>
                    </template>
                </v-select>
            </div>

            <div>
                <v-select
                v-model="modelAccounts"
                v-model:menu="menuAccounts"
                :items="filterAccounts"
                :rules="selectRules"
                item-title="name_identifier"
                item-value="id"
                variant="underlined"
                label="Conta"
                persistent-hint
                autocomplete="off"
                >

                    <template v-slot:selection="{item}">
                    <v-avatar style="width: 30px; height: 30px; margin-right: 12px;"> 
                        <v-img  :src="item.raw.url_image" :alt="item.raw.name_identifier"></v-img>
                    </v-avatar>
                    <span >{{ item.raw.name_identifier }}</span>
                    </template>

                    <template v-slot:item="{props, item}">
                    <v-list-item  v-bind="props">
                        <template v-slot:prepend>
                        <v-avatar>
                            <v-img :src="item.raw.url_image" :alt="item.raw.name_identifier"></v-img>
                        </v-avatar>
                        </template>
                    </v-list-item>
                    </template>

                    <template v-slot:prepend-item>
                    <div class="pa-2 border-b">
                        <v-text-field
                        v-model="searchAccounts"
                        :error="!!searchAccounts && !filterAccounts?.length"
                        density="compact"
                        placeholder="Buscar..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        @click.stop
                        @keydown.stop
                        @mousedown.stop
                        hide-details="auto"
                        >                 
                    </v-text-field>
                    </div>
                    </template>
                </v-select>
            </div>

            <div>
                <v-select
                variant="underlined"
                clearable
                label="Situação"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                ></v-select>
            </div>

            <v-divider style="margin-top: 5px;"></v-divider>
            
            <v-card-actions style="display: flex; justify-content: space-between; margin-top: 13px;">
            
                <v-btn
                text="Cancelar"
                variant="elevated"
                @click="resetForm"
                ></v-btn>

                <v-btn
                color="primary"
                text="Aplicar filtros"
                variant="elevated"
                :loading="isPending"
                @click="handleAddAccount"
                ></v-btn>
            </v-card-actions>

            </div>
    </v-navigation-drawer>

</template>

<style scoped>

.filter-main {
  padding: 10px;
}

</style>