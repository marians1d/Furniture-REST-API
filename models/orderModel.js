const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    orderName: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        enum: [
            'Private',
            'Public'
        ],
        default: 'Public'
    },
    providers: [{
        type: ObjectId,
        ref: 'User'
    }],
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    comments: [{
        type: ObjectId,
        ref: 'Comment'
    }],
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Order', orderSchema);
