
    export function useSelectedColor() {

        const selectedColor = useState<string | null>("account:selectColor:selected", () => null)
        const dialogColorPicker = useState("account:dialogColorPicker", () => false)

        const selectColor = (color: string) => {
            selectedColor.value = color
        }

        const resetColor = () => {
            selectedColor.value = ""
        }

        return {
            selectedColor,
            selectColor,
            resetColor,
            dialogColorPicker
        }
    }