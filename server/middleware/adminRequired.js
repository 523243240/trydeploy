
//Middleware used to throw error if user isn't admin
const adminRequired = function (req, res, next) {
    if (!req.session.user || !req.session.user.isAdmin) {
        let err = new Error("Admin privledges required");
        err.name = "AdminRequiredError";
        return next(err);
    }
    return next();
};

module.exports = adminRequired;