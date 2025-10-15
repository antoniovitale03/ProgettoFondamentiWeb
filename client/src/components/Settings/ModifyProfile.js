import {Box, Button, FormControl, Input, InputLabel, Stack, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import "../../CSS/Form.css"
import api from "../../api";
import {useNotification} from "../../context/notificationContext";
import {useAuth} from "../../context/authContext";
function ModifyProfile(){

    const {showNotification} = useNotification();
    const {user, setUser} = useAuth();
    //dati profilo
    const [profileData, setProfileData] = useState({
        username: "",
        name: "",
        surname: "",
        email: "",
        biography: "",
        country: ""
    });


    //creo un effetto che carica i dati del profilo al caricamento della pagina
    useEffect(() => {
        async function fetchProfileData(){
            try{
                const response = await api.get("http://localhost:5001/api/user/get-profile-data");
                let profileData = response.data;
                setProfileData(profileData);
            }catch(error){
                showNotification(error.response.data, "error");
            }

        }
        fetchProfileData();
    }, [showNotification])

    // funzione per gestire le modifiche in ogni campo di input
    const handleInputChange = (event) => {
        const { name, value } = event.target; // Prendiamo il campo name e value dell'elemento input
        setProfileData(prevState => ({
            ...prevState, //copia i dati del profilo prima della modifica di un campo
            [name]: value  // Aggiorna solo il campo modificato
        }));
    };

    const handleSubmit = async (event) => {
        try{
            event.preventDefault();
            await api.post("http://localhost:5001/api/user/update-profile", profileData);
            let newUser = {...user,
                username: profileData.username,
                name: profileData.name,
                surname: profileData.surname,
                email: profileData.email,
                biography: profileData.biography,
                country: profileData.country,
            };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            showNotification("Profilo modificato con successo!", "success");
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    return(
        <Box className="page-container">
            <Box className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1 style={{ textAlign:"left" }}>Modifica il tuo profilo</h1>
                    <Stack spacing={4}>
                        <FormControl>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" name="username" type="text" value={profileData.username} onChange={handleInputChange}/>
                        </FormControl>

                        <FormControl>
                            <InputLabel>Nome</InputLabel>
                            <Input id="nome" type="text" name="name" value={profileData.name} onChange={handleInputChange}/>
                        </FormControl>

                        <FormControl>
                            <InputLabel>Cognome</InputLabel>
                            <Input id="surname" type="text" name="surname" value={profileData.surname} onChange={handleInputChange}/>
                        </FormControl>

                        <FormControl>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input type="email" id="email" name="email" value={profileData.email} onChange={handleInputChange}/>
                        </FormControl>

                        <FormControl>
                            <TextField id="outlined-multiline-flexible" multiline rows={5} label="Biografia" name="biography" value={profileData.biography} onChange={handleInputChange}/>
                        </FormControl>

                        <FormControl>
                            <InputLabel htmlFor="country">Paese d'origine</InputLabel>
                            <Input type="country" id="country" name="country" value={profileData.country} onChange={handleInputChange}/>
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary">Salva le modifiche</Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    )
}
export default ModifyProfile;