import React, { useState, useEffect } from "react";
import {Box, Button, Card, CardContent, CardMedia, IconButton, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import "../CSS/home.css";
import MovieIcon from "@mui/icons-material/Movie";

export default function Carosello({ films, title, link }){

    //abbiamo bisogno di uno stato che tenga conto dell'indice
    const [indice, setIndice] = useState(0);

    // numero di immagini visibili a schermo
    const [immvisibili, setImmvisibili] = useState(window.innerWidth <= 1500 ? 4 : 5);

    useEffect(() => {
        const handleResize = () => {
            setImmvisibili(window.innerWidth <= 1500 ? 4 : 5);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navigate = useNavigate();
    //ora inseriamo le funzioni per poter cambiare immagine

    const successiva = () => setIndice(i => Math.min(i + 1, films.length - immvisibili));

    const precedente = () => setIndice(i => Math.max(i - 1, 0));

    return(
        <Box>
            <Typography component="p" variant="strong" sx={{ fontSize:"50px", color:"#cad2c5" }}>
                {title}
                {link &&
                    <Button component={Link} to={link} sx={{ color:"#cad2c5"}}>
                        <InfoOutlineIcon /> sfoglia tutti
                    </Button>
                }
            </Typography>

            <Box className="box-carosello">
                {films.slice(indice, indice + immvisibili).map((film, index) =>
                    <Card sx={{ borderRadius: "50px", backgroundColor:"#a4c3b2ff"}} key={index}>
                        <CardContent>
                            <Box className="box_testo">
                                <MovieIcon sx={{marginRight: 2, fontSize:"20px"}} />
                                <Link className="link_card" to={`/film/${film.title.replaceAll(" ", "-")}/${film._id}`}>
                                    <strong>{film.title}</strong>
                                </Link>
                                <Link className="link_card" to={`/films/${film.release_year}`}>
                                    <strong>({film.release_year})</strong>
                                </Link>
                            </Box>
                            
                            <CardMedia component="img" image={film.poster_path} className="carosello-image"
                                       onClick={() => navigate(`/film/${film.title.replaceAll(" ", "-")}/${film._id}`)}                        />
                        </CardContent>
                    </Card>
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton onClick={precedente} variant="text" sx={{ ml: 1, color: "#a4c3b2ff", backgroundColor: "none" }} disabled={indice === 0 }>
                    <ArrowCircleLeftIcon sx={{fontSize:"xxx-large", }} />
                </IconButton>
                <IconButton onClick={successiva} variant="text" sx={{ ml: 1, color: "#a4c3b2ff", backgroundColor: "none"}} disabled={indice >= films.length - immvisibili }>
                    <ArrowCircleRightIcon sx={{fontSize:"xxx-large"}} />
                </IconButton>
            </Box>

        </Box>
    );
}