import { format } from "date-fns"
import { datetime } from "rrule"

export function dateToDateOnly(date: Date): string {
    return format(date, "yyyy-MM-dd")
}

export function dateOnlyToRRuleDate(value: string): Date {
    const [year, month, day] = value.split("-").map(Number)

    return datetime(year, month, day, 0, 0, 0)
}

export function rruleDateToDateOnly(date: Date): string {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    const day = String(date.getUTCDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}