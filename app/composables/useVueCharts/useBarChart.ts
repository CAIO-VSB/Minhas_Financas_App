import type  { EChartsOption as ECOption  } from "echarts"
import { useChartTheme } from "./useChartTheme"

export type BarDatum = {
    name: string,
    value: number,
    color?: string
}

export function useBarChart(data: MaybeRefOrGetter<BarDatum[]>) {
    const {colors, textStyle } = useChartTheme()

    const option = computed<ECOption>(() => {
        const items = toValue(data)

        return {
            tooltip: {trigger: 'axis'},
            grid: {left: 0, right: 50, top: 30 },
            xAxis: {
                type: 'category',
                data: items.map(i => i.name)
            },
            yAxis: {type: 'value'},
            series: [
                {
                    type: 'bar',
                    barMaxWidth: 48,
                    itemStyle: { borderRadius: [6, 6, 0, 0]},
                    data: items.map((item, i) => ({
                        value: item.value,
                        itemStyle: { color: item.color }
                    }))
                }
            ]
        }
    })

    return {option}
}