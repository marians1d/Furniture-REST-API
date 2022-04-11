const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const statusRequestSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        unique: true
    }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('StatusRequest', statusRequestSchema);