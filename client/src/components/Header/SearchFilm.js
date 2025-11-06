import {Box, Button, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../../context/notificationContext";
import {useState} from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchFilm(){
    const navigate = useNavigate();
    const showNotification = useNotification();

    const [title, setTitle] = useState("");

    const handleSearch = async () => {
        try{
            navigate(`/search/${title.replaceAll(" ", "-")}`);
            setTitle("");
        }catch(error){
            showNotification(error.response.data, "error");
            setTitle("");
        }
    }
    return(
        <Box component="form" onSubmit={handleSearch}>
            <TextField type="search" id="outlined-basic" label="Cerca un film..." variant="outlined" value={title} onChange={ (e) => setTitle(e.target.value) } />
            <Button sx={{backgroundColor:"#354f52", marginTop:"8px"}} variant="contained" onClick={handleSearch}>
                <SearchIcon/>
            </Button>
        </Box>
    )
}