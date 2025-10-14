import React, { useState } from "react";
import {Box, Button, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

function Carosello({ films, title, link }){

        //abbiamo bisogno di uno stato che tenga conto dell'indice
        const [indice, setIndice] = useState(0);
        //numero di immagini visibili a schermo
        const immvisibili = 5;

        const navigate = useNavigate();

        //ora inseriamo le funzioni per poter cambiare immagine
        const successiva = () => setIndice(i => (i + 1) % films.length);

        const precedente = () => setIndice(i => (i - 1 + films.length) % films.length);

          return(
    <Box className="carosello">
        <Typography component="p">
            <strong style={{fontSize:"50px", color:"#cad2c5"}}>
                {title}
            </strong>
            {link && <Button component={Link} to={link} sx={{ color:"#cad2c5"}}>
                <InfoOutlineIcon /> sfoglia tutti
            </Button>
            }
        </Typography>

        <Box sx={{textAlign: "center", display: "flex", overflow: "hidden", gap: 2, justifyContent: "center", whiteSpace: "nowrap",
            textOverflow:"ellipsis", alignContent:"center", marginTop:"2"
        }}>
            {films.slice(indice, indice + immvisibili).map((film, index) => (
                <Card style={{ justifyContent:"center", borderRadius: "50px",
                    alignItems:"center", overflow:"hidden"}} key={index} sx={{backgroundColor:"#a4c3b2ff"}}>
                    <CardContent className="riquadro">
                        <Button sx={{color:"#344e41", fontSize:"20px", fontWeight:"bold" }} component={Link} to={`/film/${film.title.replaceAll(" ", "-")}/${film._id}`}>
                            <strong>{film.title}</strong>
                        </Button>
                        <Button component={Link} to={`/films/${film.release_year}`} sx={{color:"#344e41", fontSize:"20px"}} >
                                <strong>({film.release_year})</strong>
                        </Button>

                        <CardMedia component="img" image={film.poster_path} className="box"
                            onClick={() => navigate(`/film/${film.title.replaceAll(" ", "-")}/${film._id}`)}                        />
                </CardContent>
            </Card>
        ))}
        </Box>

        <Button onClick={precedente} variant="text" sx={{ ml: 1, color: "#a4c3b2ff", backgroundColor:" #52796f", backgroundColor: "none"}} disabled={indice >= films.length - immvisibili }>
            <ArrowCircleLeftIcon sx={{fontSize:"xxx-large", }} />
        </Button>
        <Button onClick={successiva} variant="text" sx={{ ml: 1, color: "#a4c3b2ff", backgroundColor:" #52796f", backgroundColor: "none"}} disabled={indice >= films.length - immvisibili }>
            <ArrowCircleRightIcon sx={{fontSize:"xxx-large"}} />
        </Button>
    </Box>
    );
}
export default Carosello;