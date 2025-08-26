import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle";
import {Typography} from "@mui/material";
import {Container, Box} from "@mui/material";
function Home(){
    useDocumentTitle("Home")
    const {user} = useAuth();
    return (
        <Container>
            <Box>
                {user && <Typography variant="h6" >Benvenuto nella home, {user.username}!</Typography>}
                {!user && <p>Benvenuto nella home!</p>}
            </Box>
        </Container>
    )
}
export default Home;