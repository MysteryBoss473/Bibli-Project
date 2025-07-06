module.exports = function(req, res, next) {
    if (req.currUser.role !== 'admin') {
        return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }
    next();
};
