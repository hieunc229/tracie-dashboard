const key = `tracie_presets`;

export type SavedPresetProps = {
    name: string,
    state: any,
    id: number
}
function remove(id: number) {
    let all = list();
    all.splice(id, 1);
    saveList(all);
}

function save(state: any, name?: string) {
    let all = list();

    if (!name) {
        name = `${state.keyword} — ${state.period}, ${state.intervalValue || "every"} ${state.interval} ${state.valueIncreasing ? ", value increase" : ""}`;
    }
    
    all.push({ id: all.length, name, state });
    saveList(all);
}

function saveList(list: SavedPresetProps[]) {
    localStorage.setItem(key, JSON.stringify(list));
}

function list(): SavedPresetProps[] {
    let out = localStorage.getItem(key) || `[]`;
    return JSON.parse(out);
}

const SavedPreset = {
    save, list, remove
}

export default SavedPreset;