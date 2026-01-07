
    const newName = ref("")
    const newAvatar = ref("")
    const newUrl = ref("")
    const newType = ref("")
    const newColor = ref("")
    const newActiveStatus = ref(true)
    
    export function useEditItem() {
    
        const selectdItem = (name: string, avatar: string, url: string, color: string, type: string, isActive: boolean) => {
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
            newActiveStatus,
            selectdItem
        }
    }