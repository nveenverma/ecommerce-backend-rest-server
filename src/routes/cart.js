const express = require("express");
const { requireSignIn, userMiddleware } = require("../common-middleware");
const router = express.Router();

const { addItemToCart, getCartItems, removeCartItems } = require("../controller/cart")

router.post('/user/cart/addToCart', requireSignIn, userMiddleware, addItemToCart);
router.post('/user/getCartItems', requireSignIn, userMiddleware, getCartItems)
router.post("/user/cart/removeItem", requireSignIn, userMiddleware, removeCartItems);

module.exports = router;