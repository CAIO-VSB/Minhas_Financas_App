    
    const currentColor = ref("")
    const dialogColorPicker = ref(false)

    export function useSelectedColor() {

        const selectdColor = (color: string) => {
            currentColor.value = color
            dialogColorPicker.value = false
        }

        currentColor.value = ""

        return {
            selectdColor,
            currentColor,
            dialogColorPicker
        }
    }