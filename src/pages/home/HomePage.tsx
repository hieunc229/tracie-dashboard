import React from "react";

import cls from "./styles.module.scss";

import ViewGraph from "./ViewGraph";
import TracieAdmin from "../utils/tc";
import ChipInput from "material-ui-chip-input";
import ViewSavedPresetMenu from "./ViewPresetMenu";
import SavedPreset, { SavedPresetProps } from "../utils/savedPreset";

import { withSnackbar } from 'notistack';
import { ArrowForward } from "@material-ui/icons";
import { TracieQueryInterval } from "../../modules/tracie-admin/src/TracieAdmin";


import {
    IconButton, Select,
    MenuItem, FormControl, InputLabel,
    TextField, FormControlLabel, Switch,
    Divider
} from '@material-ui/core';

import { TracieQueryRepresentData, transformDataValueIncreasing, transformData } from "../utils/transform";
import { randomData } from "../../demo/generator";

type State = {
    data?: any,
    keyword?: string[],
    interval: TracieQueryInterval,
    start?: Date,
    end?: Date,
    period: "custom" | "all" | "180" | "90" | "30" | "7",
    intervalValue?: number,
    valueIncreasing: boolean
};

class HomePage extends React.Component {

    state: State = { interval: "day", period: "30", valueIncreasing: false };
    data?: TracieQueryRepresentData[];

    private handleSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        this.fetchData();
    }

    private clearData = () => {
        this.data = undefined;
        this.setState({ data: undefined });
    }
    private fetchData = async () => {
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

            try {
                const keywords = this.state.keyword;
                let options = {
                    $interval: this.state.interval,
                    $start: start,
                    $end: end,
                    $intervalValue: this.state.intervalValue
                };
                let rs = process.env.REACT_APP_USE_SAMPLE_DATA === "true" ? randomData(keywords, options) : await TracieAdmin.query(keywords, options);
                this.data = transformData(rs as any);
                this.setGraphData();
            } catch (err) {
                console.log(err);
                let errMessage = err.toString();
                if (errMessage.indexOf(`Failed to fetch`)) {
                    errMessage = `Unable to reach server`;
                }
                // @ts-ignore
                this.props.enqueueSnackbar(errMessage, { variant: "error" });
            }
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
        const { interval, period, intervalValue } = this.state;

        return <>
            <div className={cls.bar}>
                <div className={cls.barGroup}>
                    <FormControl>
                        <InputLabel id="period-label">Period</InputLabel>
                        <Select
                            labelId="period-label"
                            name="period"
                            value={period}
                            onChange={this.handleChange}
                        >
                            <MenuItem value="all">All time</MenuItem>
                            <MenuItem value="7">Last 7 days</MenuItem>
                            <MenuItem value="30">Last 30 days</MenuItem>
                            <MenuItem value="90">Last 90 days</MenuItem>
                            <MenuItem value="180">Last 180 days</MenuItem>
                            <MenuItem value="custom">Custom</MenuItem>
                        </Select>
                    </FormControl>
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
                </div>

                <div className={cls.flexRow}>
                    <form onSubmit={this.handleSubmit} className={cls.form}>
                        <ChipInput

                            placeholder="Enter event name"
                            defaultValue={this.state.keyword}
                            onChange={chips => this.handleValueChange({ target: { value: chips, name: "keyword" } })}
                        />
                        <IconButton type="submit" className={cls.iconButton} aria-label="search">
                            <ArrowForward />
                        </IconButton>
                    </form>
                    <ViewSavedPresetMenu
                        handleClear={this.clearData}
                        handleSave={this.savePreset}
                        handleSelect={this.setPreset}
                    />
                </div>
            </div>
            <ViewGraph data={this.state.data} />
        </>
    }
}

// @ts-ignore
export default withSnackbar(HomePage);