import mongoose from "mongoose";

const viewSchema=new mongoose.Schema({
    viewer:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    video:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    }
},{timestamps:true})

const View=mongoose.model('View',viewSchema)

export default View