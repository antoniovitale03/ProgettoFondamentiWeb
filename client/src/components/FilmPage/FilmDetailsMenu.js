import {Box, MenuItem} from "@mui/material";

function FilmDetails({ film }) {
    return (
        <Box>
            <MenuItem>
                <h4>Original language: </h4>
                <p>{film?.details.original_language}</p>
            </MenuItem>
            <MenuItem>
                <h4>Original country: </h4>
                <p>{film?.details.origin_country?.[0]}</p>
            </MenuItem>
            <MenuItem sx={{flexWrap:"wrap"}}>
                <h4 style={{margin:"0"}}>Spoken languages: </h4>
                { film?.details.spoken_languages?.map( (language) => <p> {language} </p>) }
            </MenuItem>
            <MenuItem sx={{flexWrap:"wrap"}}>
                <h4 style={{margin:"0"}}>Production Companies: </h4>
                { film?.details.production_companies?.map( e => <p style={{margin:"0"}}> {e.name}({e.country}), </p>) }
            </MenuItem>
            <MenuItem>
                <h4>Revenue: </h4>
                <p>{film?.details.revenue}</p>
            </MenuItem>
            <MenuItem>
                <h4>Budget: </h4>
                <p>{film?.details.budget}</p>
            </MenuItem>
        </Box>
    )
}

export default FilmDetails;