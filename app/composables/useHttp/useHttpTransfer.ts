import type { TTransferPayload } from "~~/schemas/transfer.schema"
import type { TMovementsWithTransfer } from "~~/types/movements/TMovements"
import type { TTransfer } from "~~/types/transfer/TTransfer"


export function useHttpTransfer() {

    const postTransfer =  async(data: TTransferPayload) => {
        return await $fetch<TTransfer>("/api/transfer", {method: "POST", body: data})
    }

    const getTransfer = async(month: number, year: number) => {
        return await $fetch<TTransfer []>("/api/transfer", {method: "GET", query: {month, year}})
    }

    const patchTransfer = async(data: TTransferPayload) => {
        return await $fetch<TTransfer>("/api/transfer", {method: "PATCH", body: data})
    }

    const getTransferById = async(id: number) => {
        return await $fetch<TTransfer>(`/api/transfer/${id}`, {method: "GET"})
    }

    const patchTransferById = async(id: number, data: TTransferPayload) => {
        return await $fetch<TTransfer>(`/api/transfer/${id}`, {method: "PATCH", body: data})
    }

    const deleteTransferById = async(id: number, data: TTransferPayload) => {
        return await $fetch(`/api/transfer/${id}/delete`, {method: "PATCH", body: data})
    }

    return {
      postTransfer,
      getTransfer,
      patchTransfer,
      getTransferById,
      patchTransferById,
      deleteTransferById
    }
}