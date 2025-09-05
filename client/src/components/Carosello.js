import React, { useState } from "react";
import { Box, Button, CardMedia,  } from "@mui/material";

function Carosello({immagini}){

        //abbiamo bisogno di uno stato che tenga conto dell'indice
        const [indice, setIndice] = useState(0);
        //numero di immagini visibili a schermo
        const immvisibili=3;

        //ora inseriamo le funzioni per poter cambiare immagine
        const successiva = ()=> setIndice((i)=>(i + 1) % immagini.length); 

        const precedente = ()=> setIndice((i)=>(i - 1 + immagini.length) % immagini.length);


          return(
        //creiamo il contenitore e le card
    <>
        <Box sx={{textAlign: "center", maxWidth: "100%", display: "flex", overflow: "hidden", gap: 1, justifyContent: "center", marginLeft: "20px"}}>
        {immagini.slice(indice, indice + immvisibili).map((src, idx) => (
          <CardMedia
            key={idx}
            component="img"
            image={src}
            sx={{
              width: 300,
              height: 200,
              objectFit: "cover",
              borderRadius: 5,
            }}
          />
        ))} 
        </Box>
        <Box sx={{mt:2, textAlign: "center"}}>
            <Button onClick={precedente} variant="outlined" disabled={indice === 0}></Button>
            <Button  
            onClick={successiva}
            variant="outlined"
            sx={{ ml: 1 }}
            disabled={indice >= immagini.length - immvisibili }
        >➡️</Button>
        </Box>
    </>
    );
}
export default Carosello;