    const currentColor = useState("account:selectColor:selected", () => "")
    const dialogColorPicker = useState("account:dialogColorPicker", () => false)

    export function useSelectedColor() {

        const selectdColor = (color: string) => {
            currentColor.value = color
            dialogColorPicker.value = false
        }

        return {
            selectdColor,
            currentColor,
            dialogColorPicker
        }
    }