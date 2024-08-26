const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Character = require('../models/character');
const verifyToken = require('../middleware/verify-token');



module.exports = router;