<script setup lang="ts">

    import { useHttpCategories } from '~/composables/useHttp/useHttpCategories'
    import { useHttpAccounts } from "~/composables/useHttp/useHttpAccounts"
    import { differenceInDays } from 'date-fns'
    import type { TMovementsByFilter } from '~~/types/movements/TMovementsByFilter'
    
    const emit = defineEmits<{
        applyFilter: [filter: TMovementsByFilter],
        resetFilter: [reset: true]
    }>()

    const props = defineProps<{
        colorButton: string,
        textColor?: string,
        fieldTypeActive: boolean,
        items: string[],
        loadingButton?: boolean
    }>()

    const { getCategoriesOnlyActive } = useHttpCategories()
    const { getAccountsOnlyActive } = useHttpAccounts()
    const { notifyError, notifyInfo, notifySuccess } = useNotify()
    const { nameRules, selectRules, dateRules, currencyRules } = useValidateFields()

    const { data:categories, isPending:categorieIsPending } = useQuery({
      queryKey: QUERY_KEYS.categories.active,
      queryFn: getCategoriesOnlyActive,
    })

    const { data:accounts, isPending:accountsIsPending } = useQuery({
      queryKey: QUERY_KEYS.accounts.active,
      queryFn: getAccountsOnlyActive,
    })

    const modelValue = defineModel<boolean>()
    const menuCategorias = ref(false)
    const modelCategorias = ref<number[]>([])
    const searchCategorias = ref("")
    const searchAccounts = ref("")
    const modelAccounts = ref<number[]>([])
    const menuAccounts = ref(false)
    const startDate = ref<Date | null>(null)
    const endDate = ref<Date | null>(null)

    const filterFrom = ref<TMovementsByFilter>({
        start_day: null,
        end_day: null,
        categorie_id: [],
        accounts_id: [],
        situation: null,
        for_type: []
    })

    watch(modelCategorias, (val) => {
        filterFrom.value.categorie_id = val
    })

    watch(modelAccounts, (val) => {
        filterFrom.value.accounts_id = val
    })

    const filterCategorias = computed(() => {
      return categories.value?.filter(item => item.name_identifier.toLowerCase().includes(searchCategorias.value.toLowerCase()))
    })

    const filterAccounts = computed(() => {
      return accounts.value?.filter(item => item.name_identifier.toLowerCase().includes(searchAccounts.value?.toLowerCase() ?? ''))
    })

    function resetForm() {
        filterFrom.value.for_type = []
        filterFrom.value.situation = null
        modelAccounts.value = [],
        modelCategorias.value = [],
        startDate.value = null
        endDate.value = null

        modelValue.value = false

        emit("resetFilter", true)
    }

    function submitForm() {

        if (!startDate.value || !endDate.value) {
            notifyInfo("Atenção", "Informe o período para consulta", 7000)
            return
        }

        const diff = differenceInDays(endDate.value, startDate.value)

        if (diff > 90) {
            notifyInfo("Atenção", "O período máximo de consulta é 90 dias", 7000)
            return
        }

        if (startDate?.value && endDate?.value) {
            filterFrom.value.start_day = new Date(startDate.value).toISOString().split('T')[0] as string
            filterFrom.value.end_day = new Date(endDate.value).toISOString().split('T')[0] as string
        }

        emit("applyFilter", filterFrom.value)

        modelValue.value = false
    }


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

            <div class="d-flex justify-center filter-data">
                <v-date-input
                v-model="startDate"
                label="De"
                autocomplete="off"
                prepend-icon=""
                variant="underlined"
                clearable
                ></v-date-input>

                <v-date-input
                v-model="endDate"
                label="Até"
                autocomplete="off"
                prepend-icon=""
                variant="underlined"
                clearable
                ></v-date-input>
            </div>

            <div>
                <v-select
                autocomplete="off"
                :loading="categorieIsPending"
                v-model="modelCategorias"
                v-model:menu="menuCategorias"
                :items="filterCategorias"
                item-title="name_identifier"
                item-value="id"
                variant="underlined"
                label="Categoria"
                persistent-hint
                :rules="selectRules"
                clearable
                multiple
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
                :loading="accountsIsPending"
                item-title="name_identifier"
                item-value="id"
                variant="underlined"
                label="Conta"
                persistent-hint
                autocomplete="off"
                clearable
                multiple
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
                :items="props.items"
                v-model="filterFrom.situation"
                ></v-select>
            </div>

            <div>
                <v-select
                :disabled="props.fieldTypeActive"
                clearable
                variant="underlined"
                label="Tipos"
                :items="['Despesas', 'Receitas', 'Tranferências de entrada', 'Transferências de saída', 'Cartão de crédito']"
                multiple
                v-model="filterFrom.for_type"
                ></v-select>
            </div>

            <v-divider style="margin-top: 5px;"></v-divider>
            
            <v-card-actions style="display: flex; justify-content: space-between; margin-top: 13px;">
            
                <v-btn
                text="Limpar e sair"
                variant="tonal"
                @click="resetForm"
                ></v-btn>

                <v-btn
                :color="props.colorButton"
                text="Aplicar filtros"
                variant="tonal"
                @click="submitForm"
                ></v-btn>
            </v-card-actions>

            </div>
    </v-navigation-drawer>

</template>

<style scoped>

.filter-main {
  padding: 10px;
}

.filter-data {
    display: flex;
    gap: 45px;
}

</style>