import React, { CSSProperties } from "react";

import { createMuiTheme } from '@material-ui/core/styles';


import {
    Paper, InputBase, IconButton, Select,
    MenuItem, FormControl, InputLabel, Typography,
    TextField, FormControlLabel, Switch,
    Divider
} from '@material-ui/core';
import { ArrowForward as SubmitIcon, Inbox } from "@material-ui/icons";
import TracieAdmin from "../utils/tc";
import { TracieQueryInterval } from "../../modules/tracie-admin/src/TracieAdmin";

import { cloneDeep } from "lodash";
import cls from "./styles.module.scss";
import ViewSavedPresetMenu from "./ViewPresetMenu";
import SavedPreset, { SavedPresetProps } from "../utils/savedPreset";
import ViewGraph from "./ViewGraph";

export default class HomePage extends React.Component {

    state: {
        data?: any,
        keyword?: string,
        interval: TracieQueryInterval,
        start?: Date,
        end?: Date,
        period: "custom" | "all" | "180" | "90" | "30",
        intervalValue?: number,
        valueIncreasing: boolean
    } = { interval: "day", period: "all", valueIncreasing: false };

    data?: any;

    private handleSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        // @ts-ignore
        const value = ev.currentTarget.keyword.value;

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
                    this.data = transformData(rs);
                    this.setGraphData();
                })
        }
    }

    private setGraphData = () => {

        if (this && this.data) {
            let data = this.state.valueIncreasing ?
                transformDataValueIncreasing(this.data) : this.data;
            this.setState({ data })
        }
    }

    private handleChange = (ev: any) => {

        const target = ev.target as HTMLInputElement;

        // @ts-ignore
        if (target.value !== this.state[target.name]) {

            this.setState({
                [target.name]: target.type === "checkbox" ? target.checked : target.value
            }, () => {
                if (target.name === "valueIncreasing") {
                    this.setGraphData();
                } else {
                    this.fetchData()
                }
            })
        }
    }

    private handleValueChange = (ev: any) => {

        const target = ev.target as HTMLInputElement;

        // @ts-ignore
        if (target.value !== this.state[target.name]) {

            this.setState({
                [target.name]: target.type === "checkbox" ? target.checked : target.value
            })
        }
    }

    private savePreset = () => {
        let { data, ...rest } = this.state;
        SavedPreset.save(rest);
    }

    private setPreset = (item: SavedPresetProps) => {
        this.setState({ ...item.state }, () => {
            this.fetchData();
        });
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

                    <Divider orientation="vertical" />

                    <FormControlLabel
                        control={<Switch
                            checked={this.state.valueIncreasing}
                            name="valueIncreasing"
                            color="primary"
                            onChange={this.handleChange}
                            inputProps={{ 'aria-label': 'Switch show value increasing' }}
                        />}
                        label="Show value increasing"
                    />

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
                <div className={cls.flexRow}>
                    <Paper onSubmit={this.handleSubmit} style={classes.form} component="form">
                        <InputBase
                            name="keyword"
                            onChange={this.handleValueChange}
                            value={this.state.keyword}
                            style={classes.input}
                            placeholder="Enter event name"
                            inputProps={{ 'aria-label': 'enter event name' }}
                        />
                        <IconButton type="submit" style={classes.iconButton} aria-label="search">
                            <SubmitIcon />
                        </IconButton>
                    </Paper>
                    <ViewSavedPresetMenu
                        handleSave={this.savePreset}
                        handleSelect={this.setPreset}
                    />
                </div>
            </div>
            {
                data ?
                    <ViewGraph
                        name={this.state.keyword}
                        data={this.state.data}
                    />
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
        maxWidth: 280,
        display: 'flex',
        flexDirection: 'row'
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
    return Object.keys(input).map((k, x) => {
        return {
            x: new Date(k),
            y: input[k]
        }
    })
}

function transformDataValueIncreasing(input: any) {
    let cloned = cloneDeep(input);
    let total = 0;
    Object.keys(cloned).forEach(k => {
        cloned[k].y = total += cloned[k].y;
    })

    return cloned;
}