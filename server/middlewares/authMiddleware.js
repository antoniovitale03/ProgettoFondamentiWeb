const jwt = require('jsonwebtoken');

exports.verifyJWT = async (req, res, next) => {
    try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }

    const accessToken = authHeader.split(' ')[1];
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = payload.user;
    next();
    } catch(error) { res.status(401).json('Token non valido.'); }
};

