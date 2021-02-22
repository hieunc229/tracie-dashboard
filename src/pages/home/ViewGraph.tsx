import React, { CSSProperties } from "react";

import Chart from "chart.js";
import cls from "./styles.module.scss";

import { Inbox } from "@material-ui/icons";
import { TracieQueryRepresentData } from "../utils/transform";
import { createMuiTheme, Paper, Typography } from "@material-ui/core";

export type Dataset = { x: any, y: number }[];
export type DatasetCollection = { [name: string]: Dataset };

type Props = {
    data?: TracieQueryRepresentData[],
    hint?: any
}

export default class ViewGraph extends React.Component<Props> {

    canvas?: HTMLCanvasElement | null;
    chart?: Chart;

    componentDidMount() {
        this.setData();
    }

    componentDidUpdate() {
        this.setData();
    }

    private setData = () => {

        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }

        if (this.canvas && this.props.data) {
            this.chart = new Chart(this.canvas, getConfig(this.props.data))
        }
    }

    render() {
        const { data } = this.props;
        const width = Math.min(1200, window.innerWidth - 140);
        const height = Math.min(400, window.innerHeight - 260);

        if (!data) {
            return <Paper component="div" className={cls.emptyBox}>
                <Inbox style={{ fontSize: 82 }} />
                <Typography variant="h6" >
                    No events selected
                </Typography>
                <Typography variant="body2" >
                    Enter an event name to display graph
            </Typography>
            </Paper>
        }

        return <Paper style={classes.graph}>
            <div>
                <canvas height={height} width={width} ref={ref => this.canvas = ref} />
            </div>
        </Paper>
    }
}

const theme = createMuiTheme();

const classes: { [name: string]: CSSProperties } = {
    graph: {
        padding: theme.spacing(1),
        paddingTop: theme.spacing(4),
        marginTop: theme.spacing(2)
    }
}

const colors = [
    `#ec407a`,
    `#36a2eb`,
    `#66bb6a`,
    `#4bc0c0`,
    `#303f9f`,
    `#ef5350`,
    `#ab47bc`,
    `#7e57c2`,
    `#42a5f5`,
    `#ffa726`,
    `#333538`,
];

function getDatasets(options: TracieQueryRepresentData[]) {
    return options.map((opt, i) => {
        return {
            label: opt.name,
            borderColor: colors[i],
            backgroundColor: colors[i],
            data: opt.data.map(i => i.y),
            pointRadius: 0,
            fill: false,
            lineTension: 0.1,
        }
    });
}

function getConfig(data: TracieQueryRepresentData[]) {

    let labels = getLabels(data);

    var config: Chart.ChartConfiguration = {
        type: 'line',
        data: {
            labels: labels,
            datasets: getDatasets(data)
        },
        options: {
            animation: {
                duration: 0
            },
            responsive: true,
            scales: {
                xAxes: [{
                    type: "time",
                    distribution: 'series',
                    display: true,
                    scaleLabel: {
                        display: true,
                    },
                    ticks: {
                        maxRotation: 0,
                        maxTicksLimit: 8
                    },
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        maxTicksLimit: 8,
                    },
                    scaleLabel: {
                        display: true,
                    }
                }]
            },
            tooltips: {
                intersect: false,
                mode: 'index',
            }
        }
    };

    return config;
}

function getLabels(data: TracieQueryRepresentData[]): Date[] {

    // Only take labels from the first set
    // since all sets of TracieQueryRepresentData have the same `x` values
    return !data.length ? [] : data[0].data.map(item => new Date(item.x));
}