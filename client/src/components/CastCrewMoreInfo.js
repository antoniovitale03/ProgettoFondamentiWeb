import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    ImageList,
    ImageListItem,
    ImageListItemBar, MenuItem,
    Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {NavLink} from "react-router-dom";
import * as React from "react";

function CastCrewMoreInfo({ film }) {

    let detailsMenuItems = (
        <div>
            <MenuItem>
                <h4>Original language: </h4>
                <p>{film.details.original_language}</p>
            </MenuItem>
            <MenuItem>
                <h4>Original country: </h4>
                <p>{film.details.origin_country?.[0]}</p>
            </MenuItem>
            <MenuItem>
                <h4>Spoken languages: </h4>
                { film.details.spoken_languages?.map( (language) => <p> {language} </p>) }
            </MenuItem>
            <MenuItem>
                <h4>Production Companies:</h4>
                { film.details.production_companies?.map( e => <p> {e.name}({e.country}), </p>) }
            </MenuItem>
            <MenuItem>
                <h4>Revenue: </h4>
                <p>{film.details.revenue}</p>
            </MenuItem>
            <MenuItem>
                <h4>Budget: </h4>
                <p>{film.details.budget}</p>
            </MenuItem>
        </div>
    )

    return (
        <Box>
            <Accordion sx={{ width: '50%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}> {/*parte visibile e cliccabile */}
                    <Typography>Cast</Typography>
                </AccordionSummary>
                <AccordionDetails> {/* parte visibile una volta cliccato il pannello*/}
                    <ImageList cols={3} gap={7} >
                        {film.castPreview.map((actor) =>
                            <ImageListItem key={actor.id} component={Link} to={`/actor/${actor.name.replaceAll(" ", "-")}/${actor.id}`}>
                                <img width='100%' height='100%' style={{ objectFit: 'cover' }}
                                     src={actor.profile_path}
                                     alt={actor.name}
                                />
                                <ImageListItemBar
                                    title = {actor.name}
                                    subtitle = {actor.character}
                                />
                            </ImageListItem>
                        )
                        }
                    </ImageList>
                    <div>
                        <NavLink to={`/film/${film.title.replaceAll(" ", "-")}/${film.id}/cast`}>
                            Mostra altri...
                        </NavLink>
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ width: '50%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Crew</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ImageList cols={3} gap={7}>
                        {film.crewPreview.map( crewMember =>
                            <ImageListItem key={crewMember.id}>
                                <img
                                    src={crewMember.profile_path}
                                    alt={crewMember.name}
                                />
                                <ImageListItemBar
                                    title = {crewMember.name}
                                    subtitle = {crewMember.job}
                                />
                            </ImageListItem>
                        )
                        }
                    </ImageList>
                    <NavLink to={`/film/${film.title.replaceAll(" ", "-")}/${film.id}/crew`}>
                        Mostra altri...
                    </NavLink>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ width: '50%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Altre info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {detailsMenuItems}
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}

export default CastCrewMoreInfo;