import useDocumentTitle from "./useDocumentTitle";
import {Container, Box, Typography} from "@mui/material";
function About(){
    useDocumentTitle("Chi siamo")
    return (
        <Container>
            <Box>
                <Typography variant="p">Qui parliamo del progetto, a cosa serve, a chi è rivolto, ecc..</Typography>
            </Box>
        </Container>
    )
}
export default About;