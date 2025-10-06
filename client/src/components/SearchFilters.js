import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Rating,
    Select,
    Typography
} from "@mui/material";
import DropDownMenu from "./DropDownMenu";
import useDecades from "./hooks/useDecades";
import useAllGenres from "./hooks/useAllGenres";

function SearchFilters({filters, setFilters, isLikedFilter}){

    const genres = useAllGenres();
    const decades = useDecades();

    const sortByMenu = [
        <MenuItem>
            <Checkbox checked={filters.sortByDate === "Dal più recente"} onChange={() => setFilters({...filters, sortByDate: "Dal più recente"})}/>
            Dal più recente
        </MenuItem>,
        <MenuItem>
            <Checkbox checked={filters.sortByDate === "Dal meno recente"} onChange={() => setFilters({...filters, sortByDate: "Dal meno recente" })}/>
            Dal meno recente
        </MenuItem>,
        <MenuItem>
            <Checkbox checked={filters.sortByPopularity === "Dal più popolare"} onChange={() => setFilters({...filters, sortByPopularity: "Dal più popolare"}) } />
            Dal più popolare
        </MenuItem>,
        <MenuItem>
            <Checkbox checked={filters.sortByPopularity === "Dal meno popolare"} onChange={() => setFilters({...filters, sortByPopularity: "Dal meno popolare"}) } />
            Dal meno popolare
        </MenuItem>
    ]


    return(
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly'}}>

            <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Genere</InputLabel>
                <Select value={filters.genre} variant="standard" onChange={(e) => setFilters({...filters, genre: e.target.value})}>
                    {genres?.map( (genre, index) => (
                        <MenuItem key={index} value={genre.id}>{genre.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Decade</InputLabel>
                <Select value={filters.decade} variant="standard" onChange={(e) => setFilters({...filters, decade: e.target.value}) }>
                    {decades.map((decade, index) => (
                        <MenuItem key={index} value={decade}>{decade}s</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
                <Typography component="legend">Minimo Rating medio</Typography>
                <Rating name="minRating" value={filters.minRating} onChange={ (e) => setFilters({...filters, minRating: e.target.value}) } precision={0.5}/>
            </FormControl>

            <FormControl sx={{ minWidth: 190 }} >
                <DropDownMenu buttonContent="Ordina per" menuContent={sortByMenu} />
            </FormControl>

            {isLikedFilter &&
                <FormControlLabel control={<Checkbox
                    checked={filters.isLiked}
                    onChange={() => setFilters({...filters, isLiked: !filters.isLiked})}
                />} label={filters.isLiked === true ? "Film piaciuti" : "Film non piaciuti"} />
            }


        </Box>
    )
}

export default SearchFilters;