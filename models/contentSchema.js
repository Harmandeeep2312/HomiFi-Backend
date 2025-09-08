const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userSchema")

const contentSchema = new Schema({
    title:{
        type: String,
    },
    content: {
        type:String
    },
    date: {
        type: Date,
        default:Date.now
    },
    author:
     { type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: false,
    default: null
 },
 reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
})
const Content = mongoose.model("Content",contentSchema);
module.exports = Content;