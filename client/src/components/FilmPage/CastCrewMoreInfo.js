import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {NavLink} from "react-router-dom";
import FilmDetailsMenu from "./FilmDetailsMenu";

function CastCrewMoreInfo({ film }) {

    return (
        <Box sx={{marginBottom:"20px"}}>
            <Accordion sx={{width:{xs:"200px", md:"35vw"},backgroundColor:"#52796f",border:"1px solid black" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}> {/*parte visibile e cliccabile */}
                    <Typography sx={{fontSize:{xs:"12px", md:"1vw"}}}>Cast</Typography>
                </AccordionSummary>
                <AccordionDetails> {/* parte visibile una volta cliccato il pannello*/}
                    <ImageList cols={3} gap={7} >
                        {film.castPreview.map((actor) =>
                            <ImageListItem key={actor.id} component={Link} to={`/actor/${actor.name.replaceAll(" ", "-")}/${actor.id}`}>
                                <img style={{ objectFit: 'cover'}}
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
                        <NavLink style={{color:"black"}} to={`/film/${film.title.replaceAll(" ", "-")}/${film.id}/cast`}>
                            Mostra altri...
                        </NavLink>
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{width:{xs:"200px", md:"35vw"},backgroundColor:"#52796f", border:"1px solid black" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography sx={{fontSize:{xs:"12px", md:"1vw"}}}>Crew</Typography>
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
                    <NavLink style={{color:"black"}} to={`/film/${film.title.replaceAll(" ", "-")}/${film.id}/crew`}>
                        Mostra altri...
                    </NavLink>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{width:{xs:"200px", md:"35vw"},backgroundColor:"#52796f",border:"1px solid black"}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography sx={{fontSize:{xs:"12px", md:"1vw"}}}>Altre info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FilmDetailsMenu film={film} />
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}

export default CastCrewMoreInfo;