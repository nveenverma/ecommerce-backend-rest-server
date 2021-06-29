const jwt = require('jsonwebtoken')
const multer = require("multer");
const shortid = require("shortid")
const path = require("path")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname )
    }
})

exports.upload = multer({ storage });

exports.requireSignIn = (req, res, next) => {
    console.log(new Date())
    console.log("Request logged from requireSignIn Middleware : ", req.headers)

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = user;
    } else {
        return res.status(400).json({ message : "Authorization Required" })
    }
    next();
}

exports.userMiddleware = (req, res, next) => {
    if (req.user.role != "user") {
        res.status(400).json({ message : "Access Denied" })
    }
    next();    
}

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role != "admin") {
        res.status(400).json({ message : "Access Denied" })
    }
    next();
}