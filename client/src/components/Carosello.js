import React, { useState } from "react";
import {Box, Button, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

function Carosello({ films, title, link }){

        //abbiamo bisogno di uno stato che tenga conto dell'indice
        const [indice, setIndice] = useState(0);
        //numero di immagini visibili a schermo
        const immvisibili = 5;

        const navigate = useNavigate();

        //ora inseriamo le funzioni per poter cambiare immagine
        const successiva = () => setIndice((i)=>(i + 1) % films.length);

        const precedente = () => setIndice((i)=>(i - 1 + films.length) % films.length);


          return(
        //creiamo il contenitore e le card
    <>
    <Box className="carosello">
        <Typography component="p">
            <strong style={{fontSize:"50px", color:"#cad2c5"}}>
                {title}
            </strong>
            {link !== "" ? <Button sx={{ color:"#cad2c5"}} component={Link} to={link}>
                <InfoOutlineIcon/> sfoglia tutti
            </Button> : null }

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
                    <Button sx={{color:"#344e41", fontSize:"20px"}} component={Link} to={`/films/${film.release_year}`}>
                            <strong>({film.release_year})</strong>
                    </Button>
                    

                    <CardMedia className="box" key={index} component="img" image={film.poster_path}
                        onClick={() => navigate(`/film/${film.title.replaceAll(" ", "-")}/${film._id}`)}
                    />
                    {film.release_date ? <Typography component="p"><strong>In uscita il {film.release_date}</strong></Typography> : null }
                </CardContent>
            </Card>
        ))}

        </Box>
        <Box sx={{mt:2, textAlign: "center"}}>
            <Button onClick={precedente} variant="text" sx={{ ml: 1, color: "#a4c3b2ff", backgroundColor:" #52796f", backgroundColor: "none"}}disabled={indice >= films.length - immvisibili }>
                <ArrowCircleLeftIcon sx={{fontSize:"xxx-large", }} />
            </Button>

            <Button onClick={successiva} variant="text" sx={{ ml: 1, color: "#a4c3b2ff", backgroundColor:" #52796f", backgroundColor: "none"}}disabled={indice >= films.length - immvisibili }>
                <ArrowCircleRightIcon sx={{fontSize:"xxx-large"}} />
            </Button>
        </Box>
        </Box>
    </>
    );
}
export default Carosello;