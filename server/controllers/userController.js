const User = require("../models/User");
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

    // 3. Prendi l'indirizzo del file appena salvato
    const filePath = `/uploads/avatars/${req.file.filename}`;

    //salvo l'indirizzo nel db
    await User.findByIdAndUpdate(userID,
        { $set: {avatar_path: filePath} },
        )

    // 5. Rispondi al frontend che è tutto ok
    res.status(200).json(filePath);
}

