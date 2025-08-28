import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle"
import {Typography} from "@mui/material";

function Profile(){
    const {user} = useAuth();
    useDocumentTitle("Profilo")
    return (
        <div>
            {user && <Typography variant="p">Benvenuto nel profilo, {user.username}!</Typography>}
        </div>
    )
}

export default Profile;