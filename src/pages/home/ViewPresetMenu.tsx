import React from 'react';

import { MoreVert, Delete, BookmarkOutlined } from "@material-ui/icons"
import SavedPreset, { SavedPresetProps } from '../utils/savedPreset';

import {
    Divider, IconButton,
    ListItemIcon, ListItemSecondaryAction,
    ListItemText, Popover, List, ListItem
} from "@material-ui/core";

type Props = {
    onChange?: (state: any) => void,
    handleSave?: () => void,
    handleSelect?: (item: SavedPresetProps) => void
}

export default function ViewSavedPresetMenu(props: Props) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSave = () => {
        props.handleSave && props.handleSave();
        handleClose();
    }

    const presets = SavedPreset.list();

    return <>
        <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            <MoreVert />
        </IconButton>

        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            elevation={2}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <List>
                {
                    presets.length ?
                        presets.map(preset =>
                            <ViewMenuItem handleClose={handleClose} handleSelect={props.handleSelect} item={preset} />) :
                        <ListItem>
                            <ListItemText primary="No presets" />
                        </ListItem>
                }
                <Divider />
                <ListItem button onClick={handleSave}>
                    <ListItemIcon><BookmarkOutlined /></ListItemIcon>
                    <ListItemText primary="Save preset" />
            </ListItem>
            </List>
        </Popover>
    </>
}


function ViewMenuItem(props: {
    handleClose: Function,
    handleSelect?: (item: SavedPresetProps) => void
    item: SavedPresetProps
}) {
    const { item } = props;

    function handleClick() {
        props.handleClose();
        props.handleSelect && props.handleSelect(item);
    }

    function handleRemove() {
        SavedPreset.remove(item.id);
        props.handleClose();
    }
    let [name, desc] = item.name.split("—");

    return <ListItem button onClick={handleClick}>

        <ListItemText
            primary={name}
            secondary={desc}
        />

        <ListItemSecondaryAction>
            <IconButton onClick={handleRemove}><Delete /></IconButton>
        </ListItemSecondaryAction>

    </ListItem>
}