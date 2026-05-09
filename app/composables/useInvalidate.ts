export function useInvalidate() {
     
    const queryClient = useQueryClient()

    const invalidate = (key: string | string[]) => {
        queryClient.invalidateQueries({
            queryKey: Array.isArray(key) ? key : [key],
            exact: false
        })
    }

    return {
        invalidate
    }
}