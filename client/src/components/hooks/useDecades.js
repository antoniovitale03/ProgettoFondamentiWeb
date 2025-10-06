function useDecades(){
    const decades = [];
    const currentYear = new Date().getFullYear();
    const currentDecade = Math.floor(currentYear / 10) * 10;
    for(let decade = currentDecade; decade >= 1870; decade -= 10){
        decades.push(decade);
    }
    return decades;
}

export default useDecades;