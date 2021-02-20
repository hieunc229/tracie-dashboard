import { cloneDeep } from "lodash";
import { TracieQueryResults } from "../../modules/tracie-admin/src/TracieAdmin";

export type TracieQueryRepresentData = {
    name: string,
    data: { x: Date, y: number }[]
}

export function transformData(input: TracieQueryResults): TracieQueryRepresentData[] {
    return input.map(item => {
        return {
            name: item.name,
            data: Object.keys(item.result).map((k, x) => {
                return {
                    x: new Date(k),
                    y: item.result[k]
                }
            })
        }
    })
}

export function transformDataValueIncreasing(input: TracieQueryRepresentData[]) {
    let cloned = cloneDeep(input);
    let total = 0;
    cloned.forEach(set => {
        total = 0;
        set.data.forEach(item => {
            item.y = total += item.y;
        })
    })

    return cloned;
}