const {mongoose, model, Types} = require("mongoose");

const ReadingSessionsSchema = mongoose.Schema({
    _id: {
        type: Types.ObjectId,
        auto: true
    },
    user_id: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    book_id: {
        type: Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    seconds: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    last_page_read: {
        type: Number,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const ReadingSessions = model('ReadingSessions', ReadingSessionsSchema);

module.exports = ReadingSessions;