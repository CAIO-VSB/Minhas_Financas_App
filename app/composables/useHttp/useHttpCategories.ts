import type { TCategorie } from "~~/types/categorie/TCategorie"


export function useHttpCategories() {

    const getAllCategories = async () => {
        return await $fetch<TCategorie []>("/api/categories", {method: "GET"})
    }

    const getCategoriesOnlyActive = async () => {
        return await $fetch<TCategorie []>("/api/categories", {method: "GET", query: {active: true}})
    }

    const postCategorie = async (data: TCategorie) => {
        return $fetch<TCategorie>("/api/categories", {method: "POST", body: data})
    }

    const patchCategorieById = async (id: number, data: TCategorie) => {
        return $fetch<TCategorie>(`/api/categories/${id}`, {method: "PATCH", body: data})
    }

    return {
        postCategorie,
        getAllCategories,
        patchCategorieById,
        getCategoriesOnlyActive
    }
}