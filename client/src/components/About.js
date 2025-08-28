import useDocumentTitle from "./useDocumentTitle";
import {Typography} from "@mui/material";
function About(){
    useDocumentTitle("About")
    return (
        <Typography variant="p">Qui diciamo chi siamo e parliamo del progetto, a cosa serve, a chi è rivolto, ecc... </Typography>
    )
}
export default About;