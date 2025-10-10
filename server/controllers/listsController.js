const List = require("../models/List");
const {findOne} = require("../models/User");
const User = require("../models/User");

exports.createList = async (req, res) => {
    try{
        const userID = req.user.id;

        const listName = req.params.listName;

        //controllo che non esista già una lista con lo stesso nome
        const list = await List.findOne({ name: listName });
        if(list){
            return res.status(400).json("Hai già una lista con questo nome");
        }
        const newList = await new List({
            name: listName
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
    const user = await User.findOne({ username: username }).populate("lists");
    res.status(200).json(user.lists);
}