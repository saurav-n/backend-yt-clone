import mongoose, { modelNames } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const {Schema}=mongoose

const userSchema=new Schema({
    userName:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true
    },
    fullName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        default:''
    },
    watchHistory:{
        type:[
            {
                type:mongoose.SchemaTypes.ObjectId,
                ref:'Video'
            }
        ],
        default:[]
    },
    refreshToken:{
        type:String,
        default:''
    }
},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            userName:this.userName,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function (){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User=mongoose.model('User',userSchema)

export default User