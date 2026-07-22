import { format } from "date-fns"

export function formatDate(value: Date | null | undefined) {

    if (!value) {
        return ""
    }

    return format(value, "dd/MM/yyyy")

}