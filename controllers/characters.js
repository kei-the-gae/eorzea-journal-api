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
        const user = await User.findById(req.user._id);
        if (!user.characters.find(({ _id }) => _id.equals(req.params.characterId))) {
            return res.status(403).send('You\'re not allowed to do that!');
        };
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
        if (!user.characters.find(({ _id }) => _id.equals(req.params.characterId))) {
            return res.status(403).send('You\'re not allowed to do that!');
        };
        const deletedCharacter = await Character.findByIdAndDelete(req.params.characterId);
        user.characters.remove({ _id: req.params.characterId });
        await user.save();
        res.status(200).json(deletedCharacter);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.post('/:characterId/jobs', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.characters.find(({ _id }) => _id.equals(req.params.characterId))) {
            return res.status(403).send('You\'re not allowed to do that!');
        };
        const character = await Character.findById(req.params.characterId);
        if (character.jobs.find(({ name }) => name === req.body.name)) {
            return res.status(409).send('Job already exists.');
        };
        character.jobs.push(req.body);
        await character.save();
        const newJob = character.jobs[character.jobs.length - 1];
        res.status(201).json(newJob);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.get('/:characterId/jobs', async (req, res) => {
    try {
        const character = await Character
            .findById(req.params.characterId)
            .populate('jobs');
        const jobs = character.jobs;
        res.status(200).json(jobs);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.put('/:characterId/jobs/:jobId', async (req, res) => {
    try {
        const character = await Character.findById(req.params.characterId);
        const job = character.jobs.id(req.params.jobId);
        job.level = req.body.level;
        await character.save();
        res.status(200).json({ message: 'Ok' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.post('/:characterId/todos', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.characters.find(({ _id }) => _id.equals(req.params.characterId))) {
            return res.status(403).send('You\'re not allowed to do that!');
        };
        const character = await Character.findById(req.params.characterId);
        character.todos.push(req.body);
        await character.save();
        const newTodo = character.todos[character.todos.length - 1];
        res.status(201).json(newTodo);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.get('/:characterId/todos', async (req, res) => {
    try {
        const character = await Character
            .findById(req.params.characterId)
            .populate('todos');
        const todos = character.todos;
        res.status(200).json(todos);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

module.exports = router;