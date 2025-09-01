import * as React from 'react';
import {Button, Menu, MenuItem} from '@mui/material';
import {NavLink} from 'react-router-dom';
import {useAuth} from "../context/authContext";
import {useState} from "react";

function DropDownMenu() {
    const {user, logout} = useAuth();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {user.username}
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
                <MenuItem onClick={handleClose}>
                    <NavLink to="/profile">Il mio profilo</NavLink>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <NavLink to="/lista-film">La mia lista</NavLink>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <NavLink to="/favorites">I miei preferiti</NavLink>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <NavLink to="/recensioni">Le mie recensioni</NavLink>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <NavLink to="/watchlist">Film da guardare</NavLink>
                </MenuItem>

                {/*All'interno della pagina impostazioni possiamo mettere la componente DeleteAccount per eliminare l'account*/}
                <MenuItem onClick={handleClose}>
                    <NavLink to="/settings">Impostazioni</NavLink>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <Button onClick={logout}>Logout</Button>
                </MenuItem>

            </Menu>
        </div>
    );
}

export default DropDownMenu;
