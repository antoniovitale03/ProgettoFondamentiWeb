import useDocumentTitle from "./useDocumentTitle";
import {Container, Box, Typography} from "@mui/material";
function About(){
    useDocumentTitle("About")
    return (
        <Container>
            <Box>
                <Typography variant="p">Qui diciamo chi siamo e parliamo del progetto, a cosa serve, a chi è rivolto, ecc... </Typography>
            </Box>
        </Container>
    )
}
export default About;