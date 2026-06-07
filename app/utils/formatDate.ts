
export function formatDate(value: Date | string | null | undefined) {

    if (!value) {
        return ""
    }

    return new Date(value).toLocaleDateString("pt-BR")

}