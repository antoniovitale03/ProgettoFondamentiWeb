import Header from "./Header";
import Footer from "./Footer";
import "../CSS/UserPanel.css";
import {Route, Routes} from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import About from "./About";
import Contact from "./Contact";
//pannello per utenti non loggati
function DefaultPanel(){
    return(
        <div className="mainLayout">
            <Header />
            <div className="content-page">
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact/>} />
                </Routes>
            </div>
            <Footer />
        </div>
    )
}

export default DefaultPanel;