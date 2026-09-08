import type { QueryKey } from '@tanstack/vue-query'

export function useInvalidate() {
     
    const queryClient = useQueryClient()

    const invalidate = (key: QueryKey | string) => {
        queryClient.invalidateQueries({
            queryKey: Array.isArray(key) ? key : [key],
            exact: false
        })
    }

    return {
        invalidate
    }
}