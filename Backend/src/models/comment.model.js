import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema=new mongoose.Schema({
    commentor:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    commentOf:{
        type:mongoose.SchemaTypes.ObjectId,
    },
    replyOf:{
        type:mongoose.SchemaTypes.ObjectId
    },
    content:{
        type:String,
        required:true
    }
},{timestamps:true})

commentSchema.plugin(mongooseAggregatePaginate)

const Comment=mongoose.model('Comment',commentSchema)

export default Comment