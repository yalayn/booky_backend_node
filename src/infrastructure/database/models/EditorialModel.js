const {mongoose, model, Types} = require("mongoose");

const EditorialSchema = new mongoose.Schema({
    _id: {
        type: Types.ObjectId,
        required: true
    },
    name: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    },
    founding_date: { 
        type: Date
    },
}, 
{ timestamps: true }
);

const Editorial = model("Editorial", EditorialSchema);

module.exports = Editorial;