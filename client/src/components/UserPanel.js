import {Routes, Route } from 'react-router-dom';
import Profile from "./Profile"
import Home from "./Home";
import About from "./About";
import Header from "./Header";
import Footer from "./Footer";
import "../CSS/UserPanel.css"
//la componente principale che gestisce tutti i percorsi
function UserPanel() {
  return (
      <div className="mainLayout">
          <Header />
          <div className="content-page">
              <Routes>
                  <Route path="/" element={<Home/>} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="about" element={<About />} />
              </Routes>
          </div>
          <Footer />
      </div>

  );
}

export default UserPanel;
