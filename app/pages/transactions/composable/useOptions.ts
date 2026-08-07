import type { TOptionConfig } from "../types/TOptionConfig"
import type { TTypeTransaction } from "~~/types/movements/TMovements"

type TOptions = {
    [action: string]: Partial<Record<TTypeTransaction, TOptionConfig>>
}

const useOptions:TOptions = {
    efetivar: {
        receita: {
            modal: "settle",
            colorButton: "green",
            textButton: "Receber",
            title: "Deseja efetivar esta receita?",
            text: "Ao efetivar essa receita será adicionado o valor na Conta."
        },

        despesa: {
            modal: "settle",
            colorButton: "red",
            textButton: "Pagar",
            title: "Deseja efetivar esta despesa?",
            text: "Ao efetivar essa despesa será descontado o valor na Conta."
        }
    },

    delete: {
        receita: {
            modal: "deleteMovement",
            colorButton: "green",
            textButton: "Deletar",
            title: "Deseja deletar esta receita?",
            text: "Essa ação não poderá ser desfeita."
        },

        despesa: {
            modal: "deleteMovement",
            colorButton: "red",
            textButton: "Deletar",
            title: "Deseja deletar esta despesa?",
            text: "Essa ação não poderá ser desfeita."
        },

        transferencia_entrada: {
            modal: "deleteTransfer",
            colorButton: "blue",
            textButton: "Deletar",
            title: "Deletar transferência",
            text: "Essa ação não poderá ser desfeita."
        },

        transferencia_saida: {
            modal: "deleteTransfer",
            colorButton: "blue",
            textButton: "Deletar",
            title: "Deletar transferência",
            text: "Essa ação não poderá ser desfeita."
        }
    }

} 


export default useOptions