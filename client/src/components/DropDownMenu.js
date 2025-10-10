import * as React from 'react';
import {Button, Menu, MenuItem} from '@mui/material';
import {NavLink} from 'react-router-dom';
import {useAuth} from "../context/authContext";
import {useEffect, useState} from "react";
import { useLocation } from 'react-router-dom';
function DropDownMenu({ buttonContent, menuContent } ) {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const location = useLocation(); //Questo oggetto contiene informazioni sulla rotta corrente, incluso l'URL

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    //effetto che chiude il menu a tendina ogni volta che l'url cambia
    useEffect(() => {
        handleClose();
    }, [location]);

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {buttonContent}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                {menuContent}
            </Menu>
        </div>
    );
}

export default DropDownMenu;
