const mongoose = require('mongoose');
const { Schema } = mongoose;

const forecastSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    currentAmount: {
        type: Number,
        required: true,
    },
    monthlyIncome: {
        type: Number,
        required: true,
    },
    allocationPercentage: {
        type: Number,
        required: true,
    },
    months: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amountReceived: { 
        type: Number, 
        default: 0 
    },
    paymentHistory: [
        {
            amount: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Forecast', forecastSchema);
