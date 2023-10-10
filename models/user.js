const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    role: {
        type: String,
        default: 'user',  // 'admin' or 'user'
    }
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Generate Auth Token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'THIS_IS_A_SECRET');

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
