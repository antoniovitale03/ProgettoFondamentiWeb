export default function GetParams(filters){
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page);
    if (filters.genre !== "") params.append("genre", filters.genre);
    if (filters.decade !== "") params.append("decade", filters.decade);
    if (filters.minRating !== 0) params.append("minRating", filters.minRating);
    if (filters.sortByDate !== "") params.append("sortByDate", filters.sortByDate);
    if (filters.sortByPopularity !== "") params.append("sortByPopularity", filters.sortByPopularity);
    if (filters.isLiked) params.append("isLiked", filters.isLiked); //parametro iniziale = false
    return params;
}