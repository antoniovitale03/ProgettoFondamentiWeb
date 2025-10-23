import {Box, MenuItem, Typography} from "@mui/material";

function FilmDetails({ film }) {
    return (
        <Box>
            <MenuItem>
                <Typography component="h4">Original language: </Typography>
                <Typography component="p">{film?.details.original_language}</Typography>
            </MenuItem>
            <MenuItem>
                <Typography component="h4">Original country: </Typography>
                <Typography component="p">{film?.details.origin_country?.[0]}</Typography>
            </MenuItem>
            <MenuItem sx={{flexWrap:"wrap"}}>
                <Typography component="h4" style={{margin:"0"}}>Spoken languages: </Typography>
                { film?.details.spoken_languages?.map( (language) => <Typography component="p"> {language} </Typography>) }
            </MenuItem>
            <MenuItem sx={{flexWrap:"wrap"}}>
                <Typography component="h4" style={{margin:"0"}}>Production Companies: </Typography>
                { film?.details.production_companies?.map( e => <Typography component="p" style={{margin:"0"}}> {e.name}({e.country}), </Typography>) }
            </MenuItem>
            <MenuItem>
                <Typography component="h4">Revenue: </Typography>
                <Typography component="p">{film?.details.revenue}</Typography>
            </MenuItem>
            <MenuItem>
                <Typography component="h4">Budget: </Typography>
                <Typography component="p">{film?.details.budget}</Typography>
            </MenuItem>
        </Box>
    )
}

export default FilmDetails;