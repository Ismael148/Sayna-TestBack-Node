const express = require('express');
const router = express.Router();
const { signup, signin, } = require('../controllers/auth');

// Route Register && Login
router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;
