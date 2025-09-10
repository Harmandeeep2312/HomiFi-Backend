const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = new  Schema({
    comment: {
        type:String,
    },
    rating:{
        type:Number,
        max:5,
        min:0.5
    },
    date:{
        type: Date,
        default: Date.now
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    blog: {
  type: Schema.Types.ObjectId,
  ref: "Content",
  required: true
}
},{ timestamps: true });
module.exports = mongoose.model("Review",reviewSchema);