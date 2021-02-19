import React, { CSSProperties } from "react";
import { createMuiTheme, Paper } from "@material-ui/core";
import Chart from "chart.js";


type Props = {
    data: any[],
    hint?: any,
    name?: string
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

        if (this.canvas) {

            let labels = this.props.data.map(k => k.x);
            let data = this.props.data.map(k => k.y)
            this.chart = new Chart(this.canvas, getConfig({ data, labels, name: this.props.name }))
        }
    }

    render() {
        const width = Math.min(1200, window.innerWidth - 140);
        const height = Math.min(400, window.innerHeight - 260);

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

function getConfig(opts: { labels?: (string | number)[], data: number[], name?: string }) {
    let { labels, data, name } = opts;
    var config: Chart.ChartConfiguration = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: name || 'Volume',
                borderColor: "#303f9f",
                backgroundColor: "#303f9f",
                data,
                pointRadius: 0,
                fill: false,
                lineTension: 0.1,
            }]
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