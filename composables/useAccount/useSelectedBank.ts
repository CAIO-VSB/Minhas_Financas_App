    const currentBank = useState("account:selectBank:bank", () => "")
    const currentAvatar = useState("account:selectAvatar:avatar", () => "")
    const currentUrl = useState("account:selectUrl:url", () => "")
    const dialogAddInstitution = useState("account:dialogAdd:dialogOpen", () => false)
    
    export function useSelectedBank() {
    
        const selectdBank = (banco: string, avatar: string, url: string) => {
            currentAvatar.value = avatar
            currentBank.value = banco
            currentUrl.value = url

            dialogAddInstitution.value = false
        } 

        return {
            selectdBank,
            currentAvatar,
            currentBank,
            currentUrl,
            dialogAddInstitution
        }
    }
