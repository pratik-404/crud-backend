const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ error: 'Admin access required.' });
    }
    next();
};

module.exports = admin;
