import React, { useState } from "react";
import {Box, Button, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

function Carosello({ films, title, link }){


        //abbiamo bisogno di uno stato che tenga conto dell'indice
        const [indice, setIndice] = useState(0);
        //numero di immagini visibili a schermo
        const immvisibili = 3;

        const navigate = useNavigate();

        //ora inseriamo le funzioni per poter cambiare immagine
        const successiva = () => setIndice((i)=>(i + 1) % films.length);

        const precedente = () => setIndice((i)=>(i - 1 + films.length) % films.length);


          return(
        //creiamo il contenitore e le card
    <>
        <Typography component="p">
            <strong>
                {title}
            </strong>
            <Button component={Link} to={link}>
                <InfoOutlineIcon /> più dettagli
            </Button>
        </Typography>

        <Box sx={{textAlign: "center", maxWidth: "100%", display: "flex", overflow: "hidden", gap: 1, justifyContent: "center", marginLeft: "20px"}}>
            {films.slice(indice, indice + immvisibili).map((film, index) => (
            <Card key={index}>
                <CardContent>
                    <Button component={Link} to={`/film/${film.title.replaceAll(" ", "-")}/${film._id}`}>
                        <p>
                            <strong>{film.title}</strong>
                        </p>
                    </Button>
                    <Button component={Link} to={`/films/${film.release_year}`}>
                        <p>
                            <strong>({film.release_year})</strong>
                        </p>
                    </Button>

                    <CardMedia key={index} component="img" image={film.poster_path}
                        onClick={() => navigate(`/film/${film.title.replaceAll(" ", "-")}/${film._id}`)}
                        sx={{
                            width: 400,
                            height: 500,
                            objectFit: "cover",
                            borderRadius: 5
                        }}
                    />
                    {film.release_date ? <Typography component="p"><strong>In uscita il {film.release_date}</strong></Typography> : null }
                </CardContent>
            </Card>
        ))}

        </Box>
        <Box sx={{mt:2, textAlign: "center"}}>
            <Button onClick={precedente} variant="outlined" disabled={indice === 0}>
                <ArrowBackIosIcon />
            </Button>
            <Button  
            onClick={successiva}
            variant="outlined"
            sx={{ ml: 1 }}
            disabled={indice >= films.length - immvisibili }
        >
                <ArrowForwardIosIcon />
            </Button>
        </Box>
    </>
    );
}
export default Carosello;