
type TimeInterval = "week" | "month" | "day" | "hour" | "minute";

export type GetTimeWindowParams = { start: Date, end: Date, interval: TimeInterval, intervalValue?: number };

export 
function getTimeWindow(options: GetTimeWindowParams) {

    let { start, end, interval, intervalValue } = options;

    switch (interval) {
        case "month":
        case "week":
        case "day":
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            break;
        case "hour":
            start.setMinutes(0,0,0);
            end.setMinutes(0,0,0);
            break;
        case "minute":
            start.setSeconds(0,0);
            end.setSeconds(0,0);
            break;
    }

    let startTime = new Date(start);
    let data: any[] = [];
    let last = new Date(start);
    let endMs = end.getTime() + 1;

    while (last.getTime() < endMs) {
        last = increase({
            date: last,
            interval,
            intervalValue
        });
        data.push({ start: startTime, end: last })
        startTime = last;
    }

    return data;
}

function increase(opts: { date: Date, interval: TimeInterval, intervalValue?: number }) {

    let cloned = new Date(opts.date);
    let { intervalValue = 1 } = opts;

    switch (opts.interval) {
        case "day":
            cloned.setDate(cloned.getDate() + intervalValue);
            break;
        case "hour":
            cloned.setHours(cloned.getHours() + intervalValue);
            break;
        case "minute":
            cloned.setMinutes(cloned.getMinutes() + intervalValue);
            break;
        case "month":
            cloned.setMonth(cloned.getMonth() + intervalValue);
            break;
        case "week":
            cloned.setDate(cloned.getDate() + (7 * intervalValue));
            break;
    }

    return cloned;
}