import {useEffect} from "react";

export default function useDocumentTitle(newTitle){
    useEffect(() => {
        document.title = newTitle;

        //quando il componente viene smontato, si ripristina il titolo originale
        return () => {
            document.title = "React App";
        };
    });
}