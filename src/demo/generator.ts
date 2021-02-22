import { TracieQueryParams } from "../modules/tracie-admin/src/TracieAdmin";
import { getTimeWindow, GetTimeWindowParams } from "./timeWindow";

export const Colors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

var MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

var COLORS = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
];

var Samples: any = {};

Samples.utils = {
    // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    srand: function (seed: number) {
        this._seed = seed;
    },

    rand: function (min: number, max: number) {
        var seed = this._seed;
        min = min === undefined ? 0 : min;
        max = max === undefined ? 1 : max;
        this._seed = (seed * 9301 + 49297) % 233280;
        return min + (this._seed / 233280) * (max - min);
    },

    numbers: function (config: any) {
        var cfg = config || {};
        var min = cfg.min || 0;
        var max = cfg.max || 1;
        var from = cfg.from || [];
        var count = cfg.count || 8;
        var decimals = cfg.decimals || 8;
        var continuity = cfg.continuity || 1;
        var dfactor = Math.pow(10, decimals) || 0;
        var data = [];
        var i, value;

        for (i = 0; i < count; ++i) {
            value = (from[i] || 0) + this.rand(min, max);
            if (this.rand() <= continuity) {
                data.push(Math.round(dfactor * value) / dfactor);
            } else {
                data.push(null);
            }
        }

        return data;
    },

    labels: function (config: any) {
        var cfg = config || {};
        var min = cfg.min || 0;
        var max = cfg.max || 100;
        var count = cfg.count || 8;
        var step = (max - min) / count;
        var decimals = cfg.decimals || 8;
        var dfactor = Math.pow(10, decimals) || 0;
        var prefix = cfg.prefix || '';
        var values = [];
        var i;

        for (i = min; i < max; i += step) {
            values.push(prefix + Math.round(dfactor * i) / dfactor);
        }

        return values;
    },

    months: function (config: any) {
        var cfg = config || {};
        var count = cfg.count || 12;
        var section = cfg.section;
        var values = [];
        var i, value;

        for (i = 0; i < count; ++i) {
            value = MONTHS[Math.ceil(i) % 12];
            values.push(value.substring(0, section));
        }

        return values;
    },

    color: function (index: number) {
        return COLORS[index % COLORS.length];
    },

    transparentize: function (color: string, opacity: number) {
        var alpha = opacity === undefined ? 0.5 : 1 - opacity;

        // @ts-ignore
        return Color[color].alpha(alpha).rgbString();
    }
};

// DEPRECATED
function randomScalingFactor() {
    return Math.round(Samples.utils.rand(-100, 100));
};

// INITIALIZATION

Samples.utils.srand(Date.now());

const ChartUtils = {
    Colors,
    Samples: {
        randomScalingFactor
    }
}

export default ChartUtils;

function generateRandomData(name: string, options: GetTimeWindowParams) {


    const time = getTimeWindow(options);
    let result: { [name: string]: number } = {};

    time.forEach(v => {
        result[v.start.toJSON()] = Math.round(Samples.utils.rand(100, 5000));
    })

    return {
        name,
        result
    }
}

function randomData(keywords: string[], options: TracieQueryParams) {

    return keywords.map(name => generateRandomData(name, {
        // @ts-ignore
        interval: options.$interval,
        // @ts-ignore
        start: new Date(options.$start),
        // @ts-ignore
        end: new Date(options.$end),
        intervalValue: options.$intervalValue
    }));
}

export {
    randomData
}