import {Box, Button} from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/material/styles';
import {useState} from "react";

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

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null); // Stato per l'anteprima dell'immagine

    // Funzione che si attiva quando l'utente seleziona un file
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
        }
    }

    const handleUpload = () => {
        // Usiamo FormData per inviare file
        const formData = new FormData();
        formData.append('avatar', selectedFile); // 'avatar' è la chiave che il backend si aspetterà
    }
    return(
        <Box>
            <p>Il tuo attuale avatar</p>
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
                    accept="image/png, image/jpeg, image/gif"
                />
            </Button>
        </Box>
    )
}
export default ModifyAvatar;