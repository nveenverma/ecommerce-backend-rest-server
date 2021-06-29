const jwt = require('jsonwebtoken')
const multer = require("multer");
const shortid = require("shortid")
const path = require("path")
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");                                                                 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname )
    }
})

const accessKeyId = process.env.accessKeyId;
const secretAccessKey = process.env.secretAccessKey;

const s3 = new aws.S3({
    accessKeyId,
    secretAccessKey,
  });

exports.upload = multer({ storage });

exports.uploadS3 = multer({
    storage: multerS3({
      s3: s3,
      bucket: "ecomm-product-images",
      acl: "public-read",
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
      },
    }),
  });

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