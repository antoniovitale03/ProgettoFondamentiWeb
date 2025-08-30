import Header from "./Header";
import Footer from "./Footer";
import {Route, Routes} from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import {Container, Box} from "@mui/material";
//pannello per utenti non loggati
function DefaultPanel(){
    return(
        <Box style={{ display: 'flex', flexDirection: 'column', minHeight:'100%' }}>
            <Header />
            <Container style={{ flexGrow:1 }}>
                <Box>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact/>} />
                    </Routes>
                </Box>
            </Container>
            <Footer />
        </Box>
    )
}

export default DefaultPanel;