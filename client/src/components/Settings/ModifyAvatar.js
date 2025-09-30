import {Avatar, Box, Button, Tooltip} from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/material/styles';
import {useState} from "react";
import api from "../../api";
import {useNotification} from "../../context/notificationContext";
import {useAuth} from "../../context/authContext";
import CloseIcon from "@mui/icons-material/Close";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function ModifyAvatar() {

    const {user, setUser, sleep} = useAuth();
    const [file, setFile] = useState(null); //file inserito
    const [preview, setPreview] = useState(null); //preview del file prima del salvataggio

    const [selectAvatarButton, setSelectAvatarButton] = useState(1);
    const [saveAvatarButton, setSaveAvatarButton] = useState(0);

    const {showNotification} = useNotification();

    // Funzione che si attiva quando l'utente seleziona un file
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setFile(file);
            setPreview(URL.createObjectURL(file)); // preview dell’immagine
            setSelectAvatarButton(0);
            setSaveAvatarButton(1);
        }
    }

    // funzione che invia il file al server
    const handleUpload = async () => {
        if (!file) return alert("Seleziona un file prima di salvare!")
        // Usiamo FormData per inviare file
        const formData = new FormData();
        formData.append('avatar', file); // 'avatar' è il nome del campo che il backend si aspetta

        try {
            // Spedisci il pacchetto al server (l'URL è un esempio)
            const response = await api.post('http://localhost:5001/api/user/upload-avatar', formData);
            let avatar_path = await response.data;
            // i dati vengono inviati attraverso il meccanismo multipart/form-data (che il server cioè express
            // gestisce tramite Multer).

            let newUser = {...user, avatar_path: avatar_path};
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));

            setSaveAvatarButton(0);
            setSelectAvatarButton(1);

            showNotification("Upload completato", "success");
            sleep(1500);

        } catch (error) {
            alert('Errore nel caricamento!');
        }
    };


    const handleRemoveAvatar = async () => {
        try{
            await api.post('http://localhost:5001/api/user/remove-avatar');
            let newUser = {...user, avatar_path: null};
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            showNotification("Avatar rimosso con successo!", "success");
            sleep(1500);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }
    return(
        <Box>
            <p>Il tuo attuale avatar</p>
            {
                user.avatar_path ?
                    <img src={`http://localhost:5001/${user.avatar_path}`}
                         style={{ width: 150, height: 150, borderRadius: "50%", marginBottom: 10 }}
                    /> :
                <Avatar sx={{ width: 150, height: 150, borderRadius: "50%", marginBottom: 10 }}/>
            }
            <Tooltip title="Rimuovi avatar">
                <Button onClick={handleRemoveAvatar}>
                    <CloseIcon />
                </Button>
            </Tooltip>

            {selectAvatarButton === 1 &&
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<FileUploadIcon />}
                >
                    Seleziona il tuo nuovo avatar
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                        multiple={false}
                        accept="image/*"
                    />
                </Button>
            }


            {preview && saveAvatarButton === 1 &&
                <Box>
                    <p>L'avatar che hai inserito</p>
                    <img
                        src={preview}
                        alt="Anteprima avatar"
                        style={{ width: 150, height: 150, borderRadius: "50%", marginBottom: 10 }}
                    />
                </Box>
            }

            { saveAvatarButton === 1 && <Button onClick={handleUpload}>Salva il tuo avatar</Button> }


        </Box>
    )
}
export default ModifyAvatar;