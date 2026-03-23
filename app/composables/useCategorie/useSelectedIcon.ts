export type TSelectIcon = {
    icon: string
}

export function useSelectedIcon() {

    const selectedIcon = useState<TSelectIcon | null>("account:selectCategorie:categorie", () => null)

    const selectIcon = (data: TSelectIcon) => {
        selectedIcon.value = data
    }

    return {
        selectIcon,
        selectedIcon
    }
}