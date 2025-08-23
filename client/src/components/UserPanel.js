import {Routes, Route } from 'react-router-dom';
import Profile from "./Profile";
import Home from "./Home";
import About from "./About";
import DeleteAccount from "./DeleteAccount";
import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";
import Help from "./Help";
import "../CSS/UserPanel.css";
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
                  <Route path="contact" element={<Contact />} />
                  <Route path="delete-account" element={<DeleteAccount />} />
                  <Route path="help" element={<Help />} />
              </Routes>
          </div>
          <Footer />
      </div>
  );
}

export default UserPanel;
