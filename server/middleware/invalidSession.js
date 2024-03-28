
//Middleware used to throw error if session isn't valid/registered
const invalidSession = function (req, res, next) {
    if (!req.session.user) {
        let err = new Error("Invalid session");
        err.name = "InvalidSessionError";
        return next(err);
    }
    return next();
};

module.exports = invalidSession;