    export type TSelectBank = {
        name: string,
        url: string,
        avatar: string
    }

    export function useSelectedBank() {

        const selectedBank = useState<TSelectBank | null>("account:selectBank:bank", () => null)
        const dialogAddInstitution = useState("account:selectBank:dialogOpen", () => false)
    
        const selectBank = (data: TSelectBank) => {
            selectedBank.value = data
            dialogAddInstitution.value = false
        } 
        

        const resetBank = () => {
            selectedBank.value = null
        }

        return {
            selectedBank,
            resetBank,
            selectBank,
            dialogAddInstitution
        }
    }
