import {Box, Button, Menu} from '@mui/material';
function DropDownMenu({ buttonContent, menuContent, isMenuOpen, setIsMenuOpen } ) {
    return (
        <Box>
            <Button onClick={(event) => setIsMenuOpen(event.currentTarget)}>
                {buttonContent}
            </Button>
            <Menu anchorEl={isMenuOpen} open={isMenuOpen} onClose={ () => setIsMenuOpen(false)}>
                {menuContent}
            </Menu>
        </Box>
    );
}

export default DropDownMenu;
