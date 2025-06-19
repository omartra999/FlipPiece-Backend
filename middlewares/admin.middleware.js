const { User } = require('../models');

module.exports = async (req, res, next) => {
    if (!req.user || !req.user.uid) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }
    const user = await User.findOne({ where: { firebaseUid: req.user.uid } });
    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    // Optionally attach the DB user to the request for downstream use
    req.dbUser = user;
    next();
};