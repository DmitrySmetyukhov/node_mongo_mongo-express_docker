const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
let path = require('path');
let fs = require('fs');

const app = express();
const port = 3000;

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/my-db');
mongoose.connect('mongodb://admin:password@mongodb:27017/my-db', {
    authSource: "admin"
});

const db = mongoose.connection;

db.on('error', (e) => console.log("Connection error ", e));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Define a schema and model for your data
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userId: Number,
    name: String,
    email: String,
    interests: String
});

const User = mongoose.model('User', userSchema);

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/profile-picture', function (req, res) {
    let img = fs.readFileSync(path.join(__dirname, "images/profile-1.png"));
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});


app.get('/get-profile', async (req, res) => {
    try {
        const user = await User.findOne({ userId: 1 });
        const result = user || {};
        res.send(result);
    } catch (e) {
        res.status(500).json({ message: 'Error getting data' });
    }
});

// Define a POST route to store data in the database
app.post('/update-profile', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({userId: 1}, {$set: req.body}, {new: true});
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Error saving data' });
    }
});

app.post('/add-data', async (req, res) => {
    try {
        const newUser = new User({userId: 1, name: 'testUser1'});
        await newUser.save();
        res.status(200).json({ message: 'User saved successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error saving data' });
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
