
export function formatCurrency(value: number | null) {

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value ?? 0)

}