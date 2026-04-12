export function useInvalidate() {
     
    const queryClient = useQueryClient()

    const invalidate = (key: string | string[]) => {
        queryClient.invalidateQueries({queryKey: Array.isArray(key) ? key : [key]})
    }

    return {
        invalidate
    }
}