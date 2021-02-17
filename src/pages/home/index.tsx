import React, { CSSProperties } from "react";

import { createMuiTheme } from '@material-ui/core/styles';

import {
    Chart,
    BarSeries,
    ArgumentAxis,
    ValueAxis, Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import { EventTracker } from '@devexpress/dx-react-chart';

import {
    Paper, InputBase, IconButton, Select,
    MenuItem, FormControl, InputLabel, Typography,
    TextField,
    Divider
} from '@material-ui/core';
import { ArrowForward as SubmitIcon, Inbox } from "@material-ui/icons";
import TracieAdmin from "./tc";
import { TracieQueryInterval } from "../../modules/tracie-admin/src/TracieAdmin";

import cls from "./styles.module.scss";

export default class HomePage extends React.Component {

    state: {
        data?: any,
        keyword?: string,
        interval: TracieQueryInterval,
        start?: Date,
        end?: Date,
        period: "custom" | "all" | "180" | "90" | "30",
        intervalValue?: number
    } = { interval: "day", period: "all" };

    handleSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        // @ts-ignore
        const value = ev.currentTarget.input.value;

        this.setState({ keyword: value }, () => {
            this.fetchData();
        });
    }

    private fetchData = () => {
        if (this.state.keyword) {

            let start = this.state.start, end = this.state.end;

            switch (this.state.period) {
                case "custom":
                    break;
                case "all":
                    start = undefined;
                    end = undefined;
                    break;
                default:
                    start = new Date();
                    // @ts-ignore
                    end = new Date().toJSON();
                    start.setDate(start.getDate() - parseInt(this.state.period));
                    // @ts-ignore
                    start = start.toJSON();
            }

            TracieAdmin.query(this.state.keyword, {
                $interval: this.state.interval,
                $start: start,
                $end: end,
                $intervalValue: this.state.intervalValue
            })
                .then(rs => {
                    this.setState({ data: transformData(rs) })
                })
        }
    }

    private handleChange = (ev: any) => {
        // @ts-ignore
        if (ev.target.value !== this.state[ev.target.name]) {
            // @ts-ignore
            this.setState({ [ev.target.name]: ev.target.value }, () => {
                this.fetchData()
            })
        }
    }

    render() {
        const { data, interval, period, intervalValue } = this.state;

        return <>
            <div style={classes.bar}>
                <div style={classes.barGroup}>

                    <FormControl>
                        <InputLabel id="period-label">Period</InputLabel>
                        <Select
                            labelId="period-label"
                            name="period"
                            value={period}
                            onChange={this.handleChange}
                        >
                            <MenuItem value="all">All time</MenuItem>
                            <MenuItem value="30">Last 30 days</MenuItem>
                            <MenuItem value="90">Last 90 days</MenuItem>
                            <MenuItem value="180">Last 180 days</MenuItem>
                            <MenuItem value="custom">Custom</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider orientation="vertical" />

                    <FormControl>
                        <InputLabel id="interval-label">Interval</InputLabel>
                        <Select
                            labelId="interval-label"
                            id="demo-simple-select"
                            name="interval"
                            value={interval}
                            onChange={this.handleChange}
                        >
                            <MenuItem value="month">Every {intervalValue} Month</MenuItem>
                            <MenuItem value="week">Every {intervalValue} Week</MenuItem>
                            <MenuItem value="day">Every {intervalValue} Day</MenuItem>
                            <MenuItem value="hour">Every {intervalValue} Hour</MenuItem>
                            <MenuItem value="minute">Every {intervalValue} Minute</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField name="intervalValue"
                        defaultValue="1"
                        type="number"
                        onChange={this.handleChange}
                        label="Interval value" />

                    {period === "custom" && <>
                        <Divider orientation="vertical" />
                        <TextField
                            name="start"
                            label="Start Date"
                            type={interval === "minute" ? "datetime-local" : "date"}
                            onBlur={this.handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            name="end"
                            label="End Date"
                            type={interval === "minute" ? "datetime-local" : "date"}
                            onBlur={this.handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>}
                </div>


                <Paper onSubmit={this.handleSubmit} style={classes.form} component="form">
                    <InputBase
                        name="input"
                        style={classes.input}
                        placeholder="Enter event name"
                        inputProps={{ 'aria-label': 'enter event name' }}
                    />
                    <IconButton type="submit" style={classes.iconButton} aria-label="search">
                        <SubmitIcon />
                    </IconButton>
                </Paper>
            </div>
            {data ?
                <Paper style={classes.graph}>
                    <Chart data={data}>
                        <ArgumentAxis />
                        <ValueAxis
                            showGrid
                            showTicks
                        />

                        <BarSeries
                            valueField="volumn"
                            argumentField="date"
                        />
                        <EventTracker />
                        <Animation />
                        <Tooltip />
                    </Chart>
                </Paper>
                :
                <div className={cls.emptyBox}>
                    <Inbox style={{ fontSize: 82 }} />
                    <Typography variant="body1" >
                        Enter an event name to display graph
                    </Typography>
                </div>
            }
        </>
    }
}
const theme = createMuiTheme();

const classes: { [name: string]: CSSProperties } = {
    input: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    form: {
        maxWidth: 260
    },
    graph: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(4),
        marginTop: theme.spacing(2)
    },
    barGroup: {
        display: `flex`,
        columnGap: `1.6em`,
    },
    bar: {
        display: `flex`,
        justifyContent: `space-between`
    }
};

function transformData(input: any) {
    return Object.keys(input).map(k => {
        return {
            date: k,
            volumn: input[k]
        }
    })
}