    export type TSelectColor = {
        color: string,
        name_color: string
    }

    export function useSelectedColor() {

        const selectedColor = useState<TSelectColor | null>("account:selectColor:selected", () => null)
        const dialogColorPicker = useState("account:dialogColorPicker", () => false)

        const selectColor = (data: TSelectColor) => {
            selectedColor.value = data
            dialogColorPicker.value = false
        }

        const resetColor = () => {
            selectedColor.value = null
        }

        return {
            selectedColor,
            resetColor,
            selectColor,
            dialogColorPicker
        }
    }