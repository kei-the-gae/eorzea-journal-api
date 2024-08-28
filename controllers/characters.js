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

router.get('/', async (req, res) => {
    try {
        const user = await User
            .findById(req.params.userId)
            .populate('characters')
        const characters = user.characters;
        res.status(200).json(characters);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.get('/:characterId', async (req, res) => {
    try {
        const character = await Character
            .findById(req.params.characterId)
        // .populate('dutiesComplete') <-- add once database for duties is populated
        res.status(200).json(character);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.put('/:characterId', async (req, res) => {
    try {
        console.log(req.user.characters);
        if (!req.user.characters.find(character => character === req.params.characterId)) (
            res.status(403).send('You\'re not allowed to do that!')
        );
        const updatedCharacter = await Character.findByIdAndUpdate(
            req.params.characterId,
            req.body,
            { new: true },
        );
        res.status(200).json(updatedCharacter);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.delete('/:characterId', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        // if (!user.characters.find(character => character._id === req.params.characterId)) (
        //     res.status(403).send('You\'re not allowed to do that!')
        // );
        // TODO: fix this auth check
        await Character.findByIdAndDelete(req.params.characterId);
        user.characters.remove({ _id: req.params.characterId });
        await user.save();
        res.status(200).json({ message: 'Ok' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

module.exports = router;