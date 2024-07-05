import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'
const app = express()


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(cookieParser())

app.use(express.json())

app.use(express.static('public'))

app.use(express.urlencoded({extended:true}))

app.use('/api/v1/users',userRouter)

app.get('/',(req,res)=>{
    res.send('hello world')
})


export default app