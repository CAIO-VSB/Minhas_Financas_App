const currentIcon = ref("")

export function useSelectedIcon() {

    const selectdIcon = (icon: string) => {
        currentIcon.value = icon
    }

    return {
        selectdIcon,
        currentIcon
    }
}