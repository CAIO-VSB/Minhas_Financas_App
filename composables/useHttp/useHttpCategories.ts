import type { TCategorie } from "~/types/categorie/TCategorie"


export function useHttpCategories() {

    const getCategories = async () => {
        return await $fetch<TCategorie []>("/api/categories", {method: "GET"})
    }

    const postCategorie = async (data: TCategorie) => {
        return $fetch<TCategorie>("/api/categories", {method: "POST", body: data})
    }

    const patchCategorie = async (data: TCategorie) => {
        return $fetch<TCategorie>("/api/categories", {method: "PATCH", body: data})
    }


    return {
        postCategorie,
        getCategories,
        patchCategorie
    }
}