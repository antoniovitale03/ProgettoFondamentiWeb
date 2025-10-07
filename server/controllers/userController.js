const User = require("../models/User");
const Activity = require("../models/Activity");
const fs = require("fs");
const path = require("path");

exports.getProfileInfo = async (req, res) => {
    try{
        const username = req.params.username;
        const user = await User.findOne({ username: username }).populate('favorites').populate('watched').populate({path: 'reviews', populate: {path: 'film'}});
        const profile = {
            avatar_path: user.avatar_path,
            country: user.country,
            biography: user.biography,
            followers: user.followers.length,
            following: user.following.length,
            favorites: user.favorites.length > 0 ? user.favorites.reverse() : null,
            latestWatched: user.watched.length > 0 ? user.watched.reverse().slice(0, 10) : null,
            latestReviews: user.reviews.length > 0 ? user.reviews.slice(0, 10) : null
        }
        res.status(200).json(profile);

    }catch(error){
        res.status(500).json('Errore del server.');
    }
}

exports.getFollowing = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username: username }).populate('following');
    res.status(200).json(user.following);
}

exports.getFollowers = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({username: username}).populate('followers');
    res.status(200).json(user.followers);
}

exports.deleteAccount = async (req, res) => {
    try{
        const userID = req.user.id;
        let confirmEmail = req.params.confirmEmail;

        const user = await User.findById(userID);
        if (user.email !== confirmEmail) {
            return res.status(400).json("L'email inserita non corrisponde a quella del tuo account. Riprova.");
        }

        //se le email corrispondono, procedo ad eliminare l'account (documento utente nel DB)
        await User.findByIdAndDelete(userID);

        res.status(200).json("Account eliminato con successo." );
    } catch(error){
        res.status(500).json('Errore del server.');
    }
}

exports.getProfileData = async (req, res) => {
    try{
        const userID = req.user.id;
        const user = await User.findById(userID);
        let profileData = {
            username: user.username ? user.username : "",
            email: user.email ? user.email : "",
            name: user.name ? user.name : "",
            surname: user.surname ? user.surname : "",
            biography: user.biography ? user.biography : "",
            country: user.country ? user.country : "",
        }
        res.json(profileData);
    }catch(error){
        res.status(500).json('Errore del server.');
    }
}

exports.updateProfile = async (req, res) => {
    try{
        const userID = req.user.id;
        const profileData = req.body;

        await User.findByIdAndUpdate(userID,
            { $set: {
                    username: profileData.username,
                    email: profileData.email,
                    name: profileData.name,
                    surname: profileData.surname,
                    biography: profileData.biography,
                    country: profileData.country

                } },
            {
                runValidators: true //esegue le validazioni dello schema (es. unique)
            }
        )
        res.status(200).json("Profilo aggiornato.")
    }catch(error){
        res.status(500).json('Errore del server.');
    }


}

exports.uploadAvatar = async (req, res) => {

    const userID = req.user.id;

    // A questo punto, Multer ha GIA' salvato il file per te!
    if (!req.file) {
        return res.status(400).send('Nessun file ricevuto.');
    }

    //la cartella public è da omettere nel percorso perchè già configurata per il delivery di file static
    // con app.use(express.static("public"))
    const filePath = `/avatars/${req.file.filename}`;

    //salvo l'indirizzo nel db
    await User.findByIdAndUpdate(userID, { $set: {avatar_path: filePath} })

    res.status(200).json(filePath);
}

exports.removeAvatar = async (req, res) => {
    const userID = req.user.id;
    const user = await User.findById(userID);

    //procedo a rimuovere fisicamente l'avatar dalla cartella del server
    const filePath = path.join(__dirname, "..", "public", user.avatar_path); //__dirname è la cartella corrente (controllers)
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(400).json("Errore durante l'eliminazione del file dal server.");
        } else {
            res.status(200).json("Avatar rimosso.");
        }
    });

    //elimino anche nel DB
    user.avatar_path = null;
    await user.save();

}

exports.getActivity = async (req, res) => {
    const username = req.params.username;
    //popolo la proprietà activity e per ogni oggetto che ottengo popolo anche la proprietà user
    const user = await User.findOne({ username: username}).populate({
            path: "activity",
            populate: { path: "user" }
        });
    if(user.activity.length > 0){
        res.status(200).json([...user.activity].reverse());
    }else{
        res.status(200).json(null);
    }

}

exports.follow = async (req, res) => {
    try{
    const userID = req.user.id;
    const friendUsername = req.params.friendUsername;

    const user = await User.findById(userID);
    if(!user){
        return res.status(404).json("Utente non trovato.");
    }

    const friend = await User.findOne({ username: friendUsername });

    //controllo prima che il nome utente esista
    if(!friend){
        return res.status(404).json("Nome utente non esistente.");
    }
    let friendID = friend._id.toString();

    //controllo che l'utente non stia seguendo se stesso
    if (userID === friendID) return res.status(400).json("Non puoi seguire te stesso.");

    //controllo che l'utente non stia già seguendo l'amico
    if(user.following.find(id => id === friendID)) return res.status(404).json(`Segui già "${friendUsername}"`);

    await User.findByIdAndUpdate(userID, { $addToSet: { following: friendID } });

    await User.findByIdAndUpdate(friendID, { $addToSet: { followers: userID } });

        return res.status(200).json("Amico aggiunto con successo.");
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

exports.unfollow = async (req, res) => {
    try{
        const userToUnfollowID = req.params.userId;
        const userID = req.user.id; //id dell'utente che ha richiesto l'unfollow

        await User.findByIdAndUpdate(userToUnfollowID, {$pull: {follower: userID }} );

        await User.findByIdAndUpdate(userID, { $pull: {following: userToUnfollowID} } );

        //rimuovo anche tutte le attività inerenti all'utente unfollowato
        const activitiesToRemove = await Activity.find({ user: userToUnfollowID });
        const IdsToRemove = activitiesToRemove.map( activity => activity._id );
        await User.findByIdAndUpdate(userID, { $pull: { activity: { $in: IdsToRemove } }});

        res.status(200).json("Rimozione avvenuta correttamente");
    }catch(error){
        res.status(500).json('Errore del server.');
    }
}