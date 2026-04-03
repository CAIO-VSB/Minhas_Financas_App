export function useInvalidate() {
     
    const queryClient = useQueryClient()

    const invalidate = (key: string) => {
        queryClient.invalidateQueries({queryKey: [key]})
    }

    return {
        invalidate
    }
}