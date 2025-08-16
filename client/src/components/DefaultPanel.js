import {Routes, Route } from 'react-router-dom';
import "../CSS/UserPanel.css"
import Home from "./Home";
import Profile from "./Profile";
import About from "./About";
import Footer from "./Footer";
import DefaultHeader from "./DefaultHeader";
//pagina di default per utenti non loggati

function DefaultPanel(){
    return(
        <div className="mainLayout">
            <DefaultHeader />
            <div className="content-page">
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="about" element={<About />} />
                </Routes>
            </div>
            <Footer />
        </div>
    )
}

export default DefaultPanel;