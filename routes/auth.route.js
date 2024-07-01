const express = require('express');
const { auth, callback } = require('../controllers/auth.controller');
const router = express.Router();


router.get('/auth', auth);
router.get("/oauth2callback", callback)

module.exports = router;
