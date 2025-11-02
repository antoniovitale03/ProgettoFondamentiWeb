import React, { useState, useEffect } from "react";
import {Box, Button, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import "../CSS/home.css";

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
    <Box sx={{ minWidth: "90vw" }}>
        <Typography component="p" variant="strong" sx={{ fontSize:"50px", color:"#cad2c5" }}>
                {title}
            {link &&
                <Button component={Link} to={link} sx={{ color:"#cad2c5"}}>
                    <InfoOutlineIcon /> sfoglia tutti
                </Button>
            }
        </Typography>

        <Box className="box-carosello">
            {films.slice(indice, indice + immvisibili).map((film, index) => (
                <Card style={{ justifyContent:"center", borderRadius: "50px",
                    alignItems:"center", overflow:"hidden"}} key={index} sx={{backgroundColor:"#a4c3b2ff"}}>
                    <CardContent className="riquadro">
                        <Button sx={{color:"#344e41", fontSize:"20px", fontWeight:"bold", textOverflow: "ellipsis" }} component={Link} to={`/film/${film.title.replaceAll(" ", "-")}/${film._id}`}>
                            <strong>{film.title}</strong>
                        </Button>
                        <Button component={Link} to={`/films/${film.release_year}`} sx={{color:"#344e41", fontSize:"20px"}} >
                                <strong>({film.release_year})</strong>
                        </Button>
                        <CardMedia component="img" image={film.poster_path} className="carosello-image"
                            onClick={() => navigate(`/film/${film.title.replaceAll(" ", "-")}/${film._id}`)}                        />
                </CardContent>
            </Card>
        ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button onClick={precedente} variant="text" sx={{ ml: 1, color: "#a4c3b2ff", backgroundColor: "none" }} disabled={indice === 0 }>
                <ArrowCircleLeftIcon sx={{fontSize:"xxx-large", }} />
            </Button>
            <Button onClick={successiva} variant="text" sx={{ ml: 1, color: "#a4c3b2ff", backgroundColor: "none"}} disabled={indice >= films.length - immvisibili }>
                <ArrowCircleRightIcon sx={{fontSize:"xxx-large"}} />
            </Button>
        </Box>

    </Box>
    );
}