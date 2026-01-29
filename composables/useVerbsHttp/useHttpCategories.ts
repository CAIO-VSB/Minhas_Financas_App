import type { TCategorieApi } from "~/server/types/TCategories.api.type"
import type { TCategorie } from "~/types/categorie/TCategorie"


export function useHttpCategories() {

    const getCategories = async () => {
        return await $fetch<TCategorieApi []>("/api/categories", {method: "GET"})
    }

    const postCategorie = async (data: TCategorie) => {
        return $fetch<TCategorie>("/api/categories", {method: "POST", body: data})
    }


    return {
        postCategorie,
        getCategories
    }
}