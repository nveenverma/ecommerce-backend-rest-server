const express = require('express');
const router = express.Router();

const { requireSignIn, adminMiddleware } = require('../../common-middleware');
const { updateOrder, getCustomerOrders } = require('../../controller/admin/order');

router.post('/order/update', requireSignIn, adminMiddleware, updateOrder);
router.post('/order/getCustomerOrders', requireSignIn, adminMiddleware, getCustomerOrders);

module.exports = router;