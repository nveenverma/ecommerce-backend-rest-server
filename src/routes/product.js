const express = require("express");
const router = express.Router();

const multer = require("multer");
const shortid = require("shortid")
const path = require("path")

const { requireSignIn, adminMiddleware, uploadS3 } = require("../common-middleware");
const { createProduct, updateProduct, getProductsBySlug, getDetailsById, deleteProductById, getProducts } = require("../controller/product")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname )
    }
})

const upload = multer({ storage });

router.post('/product/create/', requireSignIn, adminMiddleware, uploadS3.array('productPicture'), createProduct);
router.post('/product/update/', requireSignIn, adminMiddleware, uploadS3.array('productPicture'), updateProduct);
router.get('/products/:slug', getProductsBySlug);
router.get('/product/:productId', getDetailsById);
router.delete("/product/deleteProductById", requireSignIn, adminMiddleware, deleteProductById);
router.post("/product/getProducts", requireSignIn, adminMiddleware, getProducts);

module.exports = router;