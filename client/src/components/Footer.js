import {NavLink} from "react-router-dom";
import "../CSS/footer.css";
function Footer() {
    return (
        <footer className="navigation-bar">
            <div>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/about">Chi siamo</NavLink>
                        </li>
                        <li>
                            <a href="https://github.com/antoniovitale03/ProgettoFondamentiWeb">GitHub</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    )
}

export default Footer;