import useDocumentTitle from "./useDocumentTitle";
import {Box, Button, FormControl, Input, InputLabel, MenuItem, Rating, Select, Stack, TextField, Typography} from "@mui/material";
import '../CSS/Form.css';
import {useState} from "react";
import {useNotification} from "../context/notificationContext";
import {NavLink} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import api from "../api";

function Log(){
    useDocumentTitle("Log")

    const [title, setTitle] = useState("");
    const [release_year, setReleaseYear] = useState("");
    const [review, setReview] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
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
            await api.post('http://localhost:5001/api/films/reviews/add-review', {
                title, release_year, review, reviewRating
            })
            showNotification(`"La recensione di ${title}" è stata salvata correttamente!`)
            navigate("/");
        }catch(error){
            showNotification(error.response.data, "error")
            setTitle("");
            setReleaseYear("");
        }
    }
    return(
       <Box className="page-container">
           <Box className="form-container">
               <form onSubmit={handleLog}>
                   <Typography component="h2">Aggiungi una recensione</Typography>
                   <Stack spacing={5}>

                       <FormControl>
                           <InputLabel htmlFor="title">Cerca un film...</InputLabel>
                           <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                       </FormControl>


                       <FormControl>
                           <InputLabel>Anno di uscita</InputLabel>
                           <Select name="Anno di uscita" value={release_year} label="Anno di uscita" onChange={(e) => setReleaseYear(e.target.value)} variant="standard">
                               {years.map((year) => (
                                   <MenuItem key={year} value={year}>
                                       {year}
                                   </MenuItem>
                               ))}
                           </Select>
                       </FormControl>

                       <FormControl>
                           <TextField id="outlined-multiline-flexible" multiline rows={5} label="Scrivi la recensione" value={review} onChange={(e) => setReview(e.target.value)} />
                       </FormControl>

                       <FormControl>
                           <Typography component="p">Inserisci il rating</Typography>
                           <Rating name="review-rating" value={reviewRating} onChange={(event,rating) => setReviewRating(rating)} precision={0.5} />
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