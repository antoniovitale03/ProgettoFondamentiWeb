import {Box, Button, Menu} from '@mui/material';
export default function DropDownMenu({ buttonContent, menuContent, isMenuOpen, setIsMenuOpen } ) {
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
