import type { TMoviments } from "~~/types/moviments/TMoviments"


export function useHttpMoviments() {

    const postMoviments = async (data: TMoviments) => {
        return $fetch<TMoviments>("/api/moviments", {method: "POST", body: data})
    }

    return {
        postMoviments
    }
}