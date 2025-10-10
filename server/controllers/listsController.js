const List = require("../models/List");
const User = require("../models/User");

exports.createList = async (req, res) => {
    try{
        const userID = req.user.id;

        const listName = req.params.listName;

        //controllo che non esista già una lista con lo stesso nome
        let list = await List.findOne({ name: listName, userID: userID });
        if(list){
            return res.status(200).json("Hai già una lista con questo nome");
        }

        const newList = await new List({
            name: listName, userID: userID
        })
        await newList.save();
        await User.findByIdAndUpdate(userID, {
            $addToSet: { lists: newList._id },
        })
        res.status(200).json("Lista creata");
    }catch(error){
        res.status(500).json("Errore del server");
    }

}

exports.getLists = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username: username }).populate({path: 'lists', populate: {path: 'films'}});
    res.status(200).json(user.lists);
}

exports.addToList = async (req, res) => {
    const userID = req.user.id;
    const filmID = parseInt(req.params.filmID);
    const listName = req.params.listName;
    const user = await User.findById(userID);
    if(!user) {
        return res.status(404).json("Utente non trovato.");
    }
    await List.findOneAndUpdate({name: listName, userID: userID}, {
        $addToSet: { films: filmID }
    })

    res.status(200).json(`Film aggiunto alla lista ${listName}`);

}

exports.removeFromList = async (req, res) => {
    const userID = req.user.id;
    const filmID = parseInt(req.params.filmID);
    const listName = req.params.listName;
    const user = await User.findById(userID);
    if(!user) {
        return res.status(404).json("Utente non trovato.");
    }
    await List.findOneAndUpdate({name: listName, userID: userID}, {
        $pull: { films: filmID }
    })

    res.status(200).json(`Film rimosso dalla lista ${listName}`);

}