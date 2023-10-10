const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const router = express.Router();
const cors = require('cors');

router.use(cors());


const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

router.post('/register', async (req, res) => {
    console.log("Attempting to register a new user with data:", req.body);
    
    // Check if the provided email matches the regex pattern
    if (!emailRegex.test(req.body.email)) {
        console.warn("Invalid email format:", req.body.email);
        return res.status(400).send("Invalid email format");
    }

    const user = new User(req.body);

    try {
        await user.save();
        console.log("User registered successfully:", user);
        const token = await user.generateAuthToken();
        console.log("Generated token for user:", token);
        res.status(201).send({ user, token });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    console.log("Attempting to login user with email:", req.body.email);
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.warn("No user found with email:", req.body.email);
            throw new Error('Invalid login credentials');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            console.warn("Invalid password provided for email:", req.body.email);
            throw new Error('Invalid login credentials');
        }

        const token = await user.generateAuthToken();
        console.log("User logged in successfully and token generated:", token);
        res.send({ user, token });
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(400).send();
    }
});

module.exports = router;
