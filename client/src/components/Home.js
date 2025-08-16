import {useAuth} from "../context/authContext"
function Home(){
    const {user} = useAuth();
    return (
        <div>
            {user && <p>Benvenuto nella home, {user.username}!</p>}
        </div>

    )
}

export default Home;