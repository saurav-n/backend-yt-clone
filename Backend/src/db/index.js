import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"


const connectDb=async ()=>{
    try {
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URL}/
        ${DB_NAME}`)
        return connectionInstance?connectionInstance:null
    } catch (error) {
        throw error
    }
}

export default connectDb