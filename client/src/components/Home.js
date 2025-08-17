import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle";
function Home(){
    useDocumentTitle("Home")
    const {user} = useAuth();
    return (
        <div>
            {user && <p>Benvenuto nella home, {user.username}!</p>}
        </div>

    )
}

export default Home;