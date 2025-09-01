import useDocumentTitle from "./useDocumentTitle";
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    Input,
    InputLabel,
    MenuItem, Rating,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import '../CSS/Form.css';
import {React, useState} from "react";
import {useFilm} from "../context/filmContext"
import {useNotification} from "../context/notificationContext";
import {NavLink} from "react-router-dom";
import {useNavigate} from "react-router-dom";

function Log(){
    useDocumentTitle("Log")

    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const {saveReview} = useFilm()
    const {showNotification} = useNotification();
    const navigate = useNavigate();

    //costruisco l'array per selezionare l'anno di uscita del film
    let currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1870; year--) {
        years.push(year);
    }


    const handleLog = async (event) => {
        event.preventDefault();
        try{
            await saveReview(title, releaseYear, review, rating);
            showNotification(`"La recensione di ${title}" è stata salvata correttamente!`)
            navigate("/")
        }catch(error){
            setError(error.message);
            setTitle("");
            setReleaseYear("");
        }
    }
    return(
       <Box className="page-container">
           <Box className="form-container">
               <form onSubmit={handleLog}>
                   <Typography component="h2">Aggiungi una recensione</Typography>
                   {error && <Typography component="p" className="error-message">{error}</Typography>}
                   <Stack spacing={5}>

                       <FormControl>
                           <InputLabel htmlFor="title">Cerca un film...</InputLabel>
                           <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                       </FormControl>


                       <FormControl>
                           <TextField
                               select
                               fullWidth // Occupa tutta la larghezza del contenitore
                               label="Anno di uscita"
                               value={releaseYear}
                               onChange={(e) => setReleaseYear(e.target.value)}
                               variant="standard" // Per avere solo la linea sotto, come nella tua immagine
                           >
                               {years.map((year) => (
                                   <MenuItem key={year} value={year}>
                                       {year}
                                   </MenuItem>
                               ))}
                           </TextField>
                       </FormControl>

                       <FormControl>
                           <TextField id="outlined-multiline-flexible" multiline rows={5} label="Scrivi la recensione" value={review} onChange={(e) => setReview(e.target.value)} />
                       </FormControl>

                       <FormControl>
                           <Typography component="p">Inserisci il rating</Typography>
                           <Rating name="review-rating" value={rating} onChange={(event,rating) => setRating(rating)} precision={0.5} />
                       </FormControl>
                   </Stack>

                   <Button variant="contained" type="submit">Salva</Button>

               </form>
               <Typography component="p">
                   Visualizza le tue <NavLink to="/recensioni">recensioni</NavLink>
               </Typography>
           </Box>
       </Box>
    )
}

export default Log;