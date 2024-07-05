import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})
// import connectDb from './db/index.js'
// import app from './app.js';


;(async ()=>{
    try {
        const {default:connectDb}=await import('./db/index.js')
        const {default:app}=await import('./app.js')
        const connectionInstance=await connectDb()
        app.listen(process.env.PORT,()=>{
            console.log(`Server is listening at port: ${process.env.PORT}`)
        })
    } catch (error) {
        console.log('DB connection failed',error)
    }
})()