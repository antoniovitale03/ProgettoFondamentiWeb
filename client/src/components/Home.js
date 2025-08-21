import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle";
function Home(){
    useDocumentTitle("Home")
    const {user} = useAuth();
    return (
        <div>
            {user && <p>Benvenuto nella home, {user.username}!</p>}
            {!user && <p>Benvenuto nella home!</p>}
        </div>
    )
}
export default Home;