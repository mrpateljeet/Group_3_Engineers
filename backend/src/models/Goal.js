// models/Goal.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const goalSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    targetDate: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Goal', goalSchema);
