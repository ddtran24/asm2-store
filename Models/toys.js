var mongoose = require("mongoose");

var schematoys = new mongoose.Schema({
    Name: String,
    Image: String,
    Price: Number
});

module.exports = mongoose.model("toys", schematoys);
