const Film = require("../models/Film");
const User = require("../models/User");

exports.addToLiked = async (req, res) => {
    try{
        const userID = req.user.id;
        let { film } = req.body;

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                $set: {
                    title: film.title,
                    release_year: film.release_year,
                    director: film.director,
                    poster_path: film.poster_path
                }
            },
            {
                upsert: true
            });

        await User.findByIdAndUpdate(userID, {
            $addToSet: { liked: film.id }
        })

        res.status(200).json({ message: `"${film.title}" aggiunto alla lista dei film piaciuti!`  });
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

exports.removeFromLiked = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);

        const user = await User.findById(userID);
        user.liked = user.liked.find(id => id !== filmID);
        await user.save()
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
    res.status(200).json("Film rimosso dai piaciuti")
}