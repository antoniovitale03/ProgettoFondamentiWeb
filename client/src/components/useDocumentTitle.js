import {useEffect} from "react";

function useDocumentTitle(newTitle){
    useEffect(() => {
        document.title = newTitle;

        //quando il componente viene smontato, si ripristina il titolo originale
        return () => {
            document.title = "React App";
        };
    });
}

export default useDocumentTitle;