    export type TSelectCategorie = {
        name: string,
        avatar: string,
        type_categorie: string
    }

    export function useSelectedCategorie() {

        const selectedCategorie = useState<TSelectCategorie | null>("account:selectBank:bank", () => null)
        const dialogEditCategorie = useState("account:selectBank:dialogOpen", () => false)
    
        const selectCategorie = (data: TSelectCategorie) => {
            selectedCategorie.value = data
            dialogEditCategorie.value = false
        } 
        
        selectedCategorie.value = null


        return {
            selectCategorie,
            dialogEditCategorie,
            selectedCategorie

        }
    }
