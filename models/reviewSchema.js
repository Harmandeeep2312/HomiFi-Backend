const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = new  Schema({
    comment: {
        type:String,
    },
    rating:{
        type:Decimal,
        max:5,
        min:1
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    blog: {
  type: Schema.Types.ObjectId,
  ref: "Blog",
  required: true
}
});
module.exports = mongoose.model("Review",reviewSchema);