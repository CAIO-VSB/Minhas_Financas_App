import type { TAccount } from "~/types/account/TAccount.types"
const { notifyError, notifyInfo, notifySuccess } = useNotify()


 export const fetchAccounts = async () => {
    return await $fetch<TAccount[]>("/api/account", {
        method: "GET"
    })
 }


export const useAccountsAPI = () => {

    const queryClient = useQueryClient()

    const addAccount = () => {
        return useMutation({
            mutationFn: async (data: TAccount) => {
                return await $fetch("/api/account", {
                    method: "POST",
                    body: data
                })
            },
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['accounts']})
                notifySuccess("Sucesso", "Conta criada com sucesso", 6000)
            },
            onError: (error) => {
                console.log("Erro ao adicionar conta", error)
                notifyError("Erro", "Erro ao salvar conta", 7000)
            }
        })
    }


    const getAccounts = (initialData?: TAccount[]) => {
        return useQuery({
            queryKey: ['accounts'],
            queryFn: fetchAccounts,
            initialData,
            staleTime: 1000 * 60 * 5
        })
    }

    return {
        getAccounts,
        addAccount
    }
}