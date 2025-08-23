import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle"
import {Box, Container, Typography} from "@mui/material";

function Profile(){
    const {user} = useAuth();
    useDocumentTitle("Profilo")
    return (
        <Container>
            <Box>
                {user && <Typography variant="p">Benvenuto nel profilo, {user.username}!</Typography>}
            </Box>
        </Container>
    )
}

export default Profile;