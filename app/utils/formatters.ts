    import type { TTransfer } from '~~/types/transfer/TTransfer'
    import type { TMovements } from '~~/types/movements/TMovements'

    export function parseTransferToEdit(transfer: TTransfer):TTransfer {

        return {
            ...transfer,
            value_transfer: Number(transfer.value_transfer ?? 0),
            date_transfer:  transfer.date_transfer ? new Date(transfer.date_transfer) : null
        }

    }

    export function parseMovementToEdit(movements: TMovements):TMovements {

        return {
            ...movements,
            value_transaction: Number(movements.value_transaction ?? 0),
            date_transaction:  new Date(movements.date_transaction ?? "")
        }

    }

