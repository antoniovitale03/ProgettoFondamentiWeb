import Header from "./Header";
import Footer from "./Footer";
import "../CSS/UserPanel.css";
import {Route, Routes} from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import {Container, Box} from "@mui/material";
//pannello per utenti non loggati
function DefaultPanel(){
    return(
        <div className="mainLayout">
            <Header />
            <Container className="content-page">
                <Box>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact/>} />
                    </Routes>
                </Box>
            </Container>
            <Footer />
        </div>
    )
}

export default DefaultPanel;