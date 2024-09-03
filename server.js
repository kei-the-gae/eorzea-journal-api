const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const usersRouter = require('./controllers/users');
const charactersRouter = require('./controllers/characters');
const profilesRouter = require('./controllers/profiles');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});
app.use(cors());
app.use(express.json());

// Routes go here
app.use('/users', usersRouter);
app.use('/users/:userId/characters', charactersRouter);
app.use('/profiles', profilesRouter);

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
    console.log(`✅ PORT: ${app.get("port")} 🌟`);
});