import useDocumentTitle from "./hooks/useDocumentTitle";
import {Typography, Box, Grid} from "@mui/material";
export default function About() {
    useDocumentTitle("About")
    return (
        <Box>
            <Grid container spacing={1}>
                <Grid xs={12} sm={6} md={4} lg={3} size={6} sx={{textAlign: "center"}}>
                    <Typography sx={{textAlign: "center", color: "#cad2c5", fontSize: "80px", marginBottom: "30px",fontWeight:"bold"}}>About Us</Typography>
                    <img src={"https://www.clipartmax.com/png/middle/35-355812_about-us-icon-icon.png"}
                         alt="Immagine About Us"
                         style={{width: "50%", height: "auto%", borderRadius: "50%", overFlow:"hidden"}}/>
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3} size={4}>
                    <h1 style={{textAlign: "center"}}>Chi Siamo: La tua vita in Film</h1>
                    <Typography sx={{textAlign: "center", color: "#cad2c5", fontSize: "20px"}}>
                        È un progetto realizzato per tutti gli appassionati del mondo cinematografico. <br/>
                        Per questo abbiamo creato un luogo digitale dove l'amore per il cinema prende forma. Utilizzalo
                        come diario personale per registrare e condividere le tue opinioni
                        personali sui film che guardi o semplicemente per tenere traccia dei film che hai visto in
                        passato. <br/>
                        Immediato, Personale e Sociale.
                    </Typography>
                    <h1 style={{textAlign: "center", marginTop: "50px"}}>Cosa offre</h1>
                    <ul style={{textAlign: "center", color: "#cad2c5", fontSize: "20px"}}>
                        <li>Tracciamento completo: tieni traccia dei film che hai visto e di quelli che hai visto in
                            passato e aggiungi alla tua lista dei desideri quelli che vorresti vedere;
                        </li>
                        <li>Scoperta Autentica: trova il tuo prossimo film fidandoti dei gusti della community e scopri
                            i loro film preferiti sulla loro pagina profilo;
                        </li>
                        <li>Recensisci e Condividi: pubblica le tue recensioni dettagliate in uno spazio positivo</li>
                    </ul>
                </Grid>
            </Grid>
        </Box>
    )
}