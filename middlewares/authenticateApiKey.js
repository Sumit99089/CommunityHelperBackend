require("dotenv").config()


const authenticateApiKey = (req, res, next) => {
    const apiKey = req.headers.api_key
    const authorizedApiKey = process.env.API_KEY

    if (!apiKey) {
        return res.status(403).json({
            error: "Api Key Missing",
            confirmation: false
        })
    }

    if (!apiKey === authorizedApiKey) {
        return res.status(401).json({
            error: "Api Key is missing",
            confirmation: false
        })
    }

    next();
};

module.exports = authenticateApiKey;