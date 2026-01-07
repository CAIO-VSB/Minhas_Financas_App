
    const currentBank = ref("")
    const currentAvatar = ref("")
    const currentUrl = ref("")
    const dialogAddInstitution = ref(false)
    
    export function useSelectedBank() {
    
        const selectdBank = (banco: string, avatar: string, url: string) => {
            currentAvatar.value = avatar
            currentBank.value = banco
            currentUrl.value = url


            dialogAddInstitution.value = false
        } 

        console.log(currentUrl.value)

        currentAvatar.value = ""

        currentBank.value = ""

        currentUrl.value = ""

        return {
            selectdBank,
            currentAvatar,
            currentBank,
            currentUrl,
            dialogAddInstitution
        }
    }