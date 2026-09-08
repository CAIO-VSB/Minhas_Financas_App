
export function calcutePercentage(amountUsed: number, total: number): number {
    if (!total || total <= 0) return 0
    return (amountUsed / total) *100
}