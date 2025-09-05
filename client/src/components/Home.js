import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle";
import {Box, Typography, Card, CardMedia, Button} from "@mui/material";
import './home.css'
import Carosello from "./Carosello"
function Home(){
    useDocumentTitle("Home")
    const {user} = useAuth();
    return (
        <>
        <Box>
            {user && <Typography component="h6" >Benvenuto nella home, {user.username}!</Typography>}
            {!user && <h1 id="titolohome1"> Nome del sito</h1>}
            <h2 id="sottotitolo">slogan del sito</h2>
        </Box>
        <Box 
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px">
        
        <Card className="card">
            <CardMedia 
            component="img"
            width="200px"
            height="30%"
            image="https://zampol.it/wp-content/uploads/2023/02/Caratteristiche_del_gatto-1024x683.jpg"
            alt="esempio"
            /> 
        </Card>
         </Box>
         <Typography><h2>Top 10 film di oggi</h2></Typography>
         <Carosello 
          immagini={["https://tse2.mm.bing.net/th/id/OIP.afK-uK47MsWnQsPrd6XKlwHaDw?pid=Api&P=0&h=180", "https://up.yimg.com/ib/th/id/OIP.ie9bjEuPhiCdRXC1aZgccQHaEK?pid=Api&rs=1&c=1&qlt=95&w=208&h=117", "https://wallpapers.com/images/featured-full/immagini-di-lontra-orhzifu8orb5nk39.jpg", "https://tse3.mm.bing.net/th/id/OIP.mQh66l5yzwXe7wNiV6IZzQHaEK?pid=Api&P=0&h=180", "https://tse1.mm.bing.net/th/id/OIP.JIrW6tZkWht1bu6qdYibYQHaEy?pid=Api&P=0&h=180", "https://tse1.mm.bing.net/th/id/OIP.T2eBkhJCN_e1J961eT2tOAHaE7?pid=Api&P=0&h=180" ]}
         />
         <Typography><h2>Top 10 film di oggi</h2></Typography>
         <Carosello 
          immagini={["https://tse2.mm.bing.net/th/id/OIP.afK-uK47MsWnQsPrd6XKlwHaDw?pid=Api&P=0&h=180", "https://up.yimg.com/ib/th/id/OIP.ie9bjEuPhiCdRXC1aZgccQHaEK?pid=Api&rs=1&c=1&qlt=95&w=208&h=117", "https://wallpapers.com/images/featured-full/immagini-di-lontra-orhzifu8orb5nk39.jpg", "https://tse3.mm.bing.net/th/id/OIP.mQh66l5yzwXe7wNiV6IZzQHaEK?pid=Api&P=0&h=180", "https://tse1.mm.bing.net/th/id/OIP.JIrW6tZkWht1bu6qdYibYQHaEy?pid=Api&P=0&h=180", "https://tse1.mm.bing.net/th/id/OIP.T2eBkhJCN_e1J961eT2tOAHaE7?pid=Api&P=0&h=180" ]}
         />
         <Typography><h2>Top 10 film di oggi</h2></Typography>
         <Carosello 
          immagini={["https://tse2.mm.bing.net/th/id/OIP.afK-uK47MsWnQsPrd6XKlwHaDw?pid=Api&P=0&h=180", "https://up.yimg.com/ib/th/id/OIP.ie9bjEuPhiCdRXC1aZgccQHaEK?pid=Api&rs=1&c=1&qlt=95&w=208&h=117", "https://wallpapers.com/images/featured-full/immagini-di-lontra-orhzifu8orb5nk39.jpg", "https://tse3.mm.bing.net/th/id/OIP.mQh66l5yzwXe7wNiV6IZzQHaEK?pid=Api&P=0&h=180", "https://tse1.mm.bing.net/th/id/OIP.JIrW6tZkWht1bu6qdYibYQHaEy?pid=Api&P=0&h=180", "https://tse1.mm.bing.net/th/id/OIP.T2eBkhJCN_e1J961eT2tOAHaE7?pid=Api&P=0&h=180" ]}
         />
         <Typography><h2>Top 10 film di oggi</h2></Typography>
         <Carosello 
          immagini={["https://tse2.mm.bing.net/th/id/OIP.afK-uK47MsWnQsPrd6XKlwHaDw?pid=Api&P=0&h=180", "https://up.yimg.com/ib/th/id/OIP.ie9bjEuPhiCdRXC1aZgccQHaEK?pid=Api&rs=1&c=1&qlt=95&w=208&h=117", "https://wallpapers.com/images/featured-full/immagini-di-lontra-orhzifu8orb5nk39.jpg", "https://tse3.mm.bing.net/th/id/OIP.mQh66l5yzwXe7wNiV6IZzQHaEK?pid=Api&P=0&h=180", "https://tse1.mm.bing.net/th/id/OIP.JIrW6tZkWht1bu6qdYibYQHaEy?pid=Api&P=0&h=180", "https://tse1.mm.bing.net/th/id/OIP.T2eBkhJCN_e1J961eT2tOAHaE7?pid=Api&P=0&h=180" ]}
         />
           
        </>
    )
}
export default Home;