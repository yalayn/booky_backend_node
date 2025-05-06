const {mongoose, model, Types} = require("mongoose");

const AuthorSchema = new mongoose.Schema({
    _id: {
        type: Types.ObjectId,
        required: true
    },
    key: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    },
    birthday: { 
        type: Date
    },
}, 
{ timestamps: true }
);

const Author = model("Author", AuthorSchema);

module.exports = Author;