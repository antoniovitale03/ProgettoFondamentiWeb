function FilmCard({film}){
    return(
       <div>
           <p>{film.title}</p>
           <img src={film.poster_path} alt="Locandina film"/>
           <p>{film.release_date}</p>
           <p>{film.director}</p>
           <p>-------</p>
       </div>
    )
}
export default FilmCard;