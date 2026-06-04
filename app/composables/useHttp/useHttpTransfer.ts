import type { TTransfer } from "~~/types/transfer/TTransfer"


export function useHttpTransfer() {

    const postTransfer =  async(data: TTransfer) => {
        return await $fetch<TTransfer>("/api/transfer", {method: "POST", body: data})
    }

    const getTransfer = async(month: number, year: number) => {
        return await $fetch<TTransfer []>("/api/transfer", {method: "GET", query: {month, year}})
    }

    return {
      postTransfer,
      getTransfer
    }
}