import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const dbUrl = process.env.DB_URL
export const connectDb = async () =>{
    try{
        await mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
        console.log('db connected')
    }catch(e){
        console.log('db connect failed: ', e.message)
    }
    
}

const exercise = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    description: String,
    duration: Number,
    date: {
        type: Date,
        required: true
    }
})

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }
})

const log = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    },
    log:{
        type: [{
            description: String,
            duration: Number,
            date: Date
        }],
        required: true
    }
})

export const Exercise = mongoose.model('exercise', exercise)
export const User = mongoose.model('user', user)
export const Log = mongoose.model('log', log)
