
export function calcuteLimitedUsed(amountUsed: number, totalLimit: number): number {
    if (!totalLimit || totalLimit <= 0) return 0
    return (amountUsed / totalLimit) *100
}