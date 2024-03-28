
const errorHandler = function (err, req, res, next) {
    if (err.code && err.code == 11000)
        return res.status(409).send(`An account with that ${Object.keys(err.keyPattern)[0]} already exists.`);
    switch (err.name) {
        case "ValidationError":
            let errors = {};
            
            Object.keys(err.errors).forEach((key) => {
                errors[err.errors[key].path] = err.errors[key].message;
            });
            return res.status(400).send(errors);
        case "InvalidLoginError":
            return res.status(401).send(err.name);
        case "InvalidSessionError":
            return res.status(401).send(err.name);
        case "AdminRequiredError":
            return res.status(401).send(err.name);
        default:
            console.log(err);
            return res.status(500).send(err.name);
    };
};

module.exports = errorHandler;