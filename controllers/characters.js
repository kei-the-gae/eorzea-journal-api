const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const Character = require('../models/character');
const verifyToken = require('../middleware/verify-token');

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
        const character = await Character.create(req.body);
        const user = await User.findById(req.params.userId);
        user.characters.push(character._id);
        await user.save();
        res.status(201).json(character);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

module.exports = router;