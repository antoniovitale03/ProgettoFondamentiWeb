import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle"
function Profile(){
    const {user} = useAuth();
    useDocumentTitle("Profilo")
    return (
        <div>
            {user && <p>Benvenuto nel profilo, {user.username}!</p>}
        </div>


    )
}

export default Profile;