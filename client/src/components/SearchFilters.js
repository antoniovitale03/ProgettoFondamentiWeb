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
import useDecades from "./hooks/useDecades";
import useAllGenres from "./hooks/useAllGenres";

export default function SearchFilters({filters, setFilters, decadeFilter, isLikedFilter}){

    const genres = useAllGenres();
    const decades = useDecades();

    const sortByMenu = [
        <MenuItem>
            <Checkbox checked={filters.sortByDate === "Dal più recente"} onChange={() => setFilters({...filters, sortByDate: "Dal più recente", page: 1})}/>
            Dal più recente
        </MenuItem>,
        <MenuItem>
            <Checkbox checked={filters.sortByDate === "Dal meno recente"} onChange={() => setFilters({...filters, sortByDate: "Dal meno recente", page: 1 })}/>
            Dal meno recente
        </MenuItem>,
        <MenuItem>
            <Checkbox checked={filters.sortByPopularity === "Dal più popolare"} onChange={() => setFilters({...filters, sortByPopularity: "Dal più popolare", page: 1}) } />
            Dal più popolare
        </MenuItem>,
        <MenuItem>
            <Checkbox checked={filters.sortByPopularity === "Dal meno popolare"} onChange={() => setFilters({...filters, sortByPopularity: "Dal meno popolare", page: 1}) } />
            Dal meno popolare
        </MenuItem>
    ]


    return(
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly'}}>

            <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Genere</InputLabel>
                <Select value={filters.genre} variant="standard" onChange={(e) => setFilters({...filters, genre: e.target.value, page: 1})}>
                    {genres?.map( (genre, index) => (
                        <MenuItem key={index} value={genre.id}>{genre.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {
                decadeFilter === false ? null :
                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>Decade</InputLabel>
                        <Select value={filters.decade} variant="standard" onChange={(e) => setFilters({...filters, decade: e.target.value, page: 1}) }>
                            {decades.map((decade, index) => (
                                <MenuItem key={index} value={decade}>{decade}s</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
            }


            <FormControl sx={{ minWidth: 180 }}>
                <Typography component="legend">Minimo Rating medio</Typography>
                <Rating name="minRating" value={filters.minRating} onChange={ (e) => setFilters({...filters, minRating: e.target.value, page: 1}) } precision={0.5}/>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Ordina per </InputLabel>
                <Select value="" variant="standard" onChange={ (e) => setFilters({...filters, sortBy: e.target.value, page: 1}) }>
                    {sortByMenu}
                </Select>
            </FormControl>

            {
                isLikedFilter === false ? null :
                <FormControlLabel control={<Checkbox
                    checked={filters.isLiked}
                    onChange={() => setFilters({...filters, isLiked: !filters.isLiked})}
                />} label={filters.isLiked === true ? "Film piaciuti" : "Film non piaciuti"} />
            }


        </Box>
    )
}