import {Box, Card, CardMedia} from '@mui/material';
import "../CSS/Contatti.css"
import useDocumentTitle from "./hooks/useDocumentTitle";

export default function Contact () {
    useDocumentTitle("Contact");
    const imageUrl = "https://wallpapercave.com/wp/wp14805291.jpg";
    const imageUrl2 = "https://i.pinimg.com/736x/18/a2/4a/18a24a79e8b643580595a0b84fbac547.jpg";
    return (
        <Box>
        <Card className="immaginecontatti">
            <CardMedia
                        component="img"
                        image="https://hotelinfinitycervia.it/files/usr/immagini-testata-pagine/contatti.jpg"/>
                        <h1 className='contattaci'>CONTATTACI</h1>
        </Card>
        <Box className="boxContatti">
                <Box className="cardcontatto">
                        <Box className="fotocontatti">  
                        </Box>
                        <h2>Antonio Vitale</h2>
                        <h3>a.vitale17@studenti.poliba.it</h3>
                </Box>

                <Box className="cardcontatto">
                        <Box className="fotocontatti"
                         sx={{ backgroundImage: `url(${imageUrl})` }}
                         >
                        </Box>
                        <h2>Angelo Sisto</h2>
                        <h3>a.sisto7@studenti.poliba.it</h3>
                </Box>

                <Box className="cardcontatto">
                        <Box className="fotocontatti"
                        sx={{ backgroundImage: `url(${imageUrl2})` }}>  
                        </Box>
                        <h2>Gabriele Putignano</h2>
                        <h3>g.putignano12@studenti.poliba.it</h3>
                </Box>

        </Box>
        </Box>
    )
}