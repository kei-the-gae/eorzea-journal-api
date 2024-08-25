const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    name: { type: String, required: true, },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
    },
});

const todoSchema = new mongoose.Schema({
    text: { type: String, required: true, },
});

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true, },
    datacenter: { type: String, required: true, },
    isStoryComplete: { type: Boolean, required: true, },
    jobs: [jobSchema],
    dutiesComplete: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Duty' }],
    todos: [todoSchema],
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;