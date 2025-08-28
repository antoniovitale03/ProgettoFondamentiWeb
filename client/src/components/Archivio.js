import useDocumentTitle from "./useDocumentTitle";

function Archivio(){
    useDocumentTitle("Archivio");
    return(
        <div>
            <p>Archivio di tutti i film disponibili</p>
            <p>Similmente alla funzione di ricerca, qui l'utente può trovare dei film non solo a partire dal nome, ma anche dalla data di uscita, genere, popolarità ecc.</p>
        </div>
    )
}

export default Archivio;