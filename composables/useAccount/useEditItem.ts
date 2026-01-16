
    const id_account = ref()
    const newName = ref("")
    const newAvatar = ref("")
    const newUrl = ref("")
    const newType = ref("")
    const newColor = ref("")
    const newActiveStatus = ref(true)
    
    export function useEditItem() {
    
        const selectdItem = (id: number, name: string, avatar: string, url: string, color: string, type: string, isActive: boolean) => {
            id_account.value = id
            newName.value = name
            newAvatar.value = avatar
            newUrl.value = url
            newType.value = type
            newColor.value = color
            newActiveStatus.value = isActive
        } 

        return {
            newAvatar,
            newColor,
            newName,
            newType,
            newUrl,
            id_account,
            newActiveStatus,
            selectdItem
        }
    }