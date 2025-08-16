import {useAuth} from "../context/authContext"
function Profile(){
    const {user} = useAuth();
    return (
        <div>
            {user && <p>Benvenuto nel profilo, {user.username}!</p>}
        </div>


    )
}

export default Profile;