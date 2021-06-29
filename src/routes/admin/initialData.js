const express = require('express');
const { requireSignIn, adminMiddleware } = require('../../common-middleware');
const { initialData } = require('../../controller/admin/initialData');

const router = express.Router();
router.get('/initialData', requireSignIn, adminMiddleware, initialData);

module.exports = router;