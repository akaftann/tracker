import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import {User,
  Exercise,
  Log,
  connectDb} from './db.js'
import { clear } from 'console'

const app = express()
dotenv.config()
const __dirname = path.resolve()
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users',async (req, res)=>{
  const users = await User.find()
  res.json(users)
})

app.post('/api/users',async (req,res)=>{
  const {username} = req.body
  const userNew = new User({username})
  const user = await userNew.save()
  res.json({username: user.username, _id: user._id})
})

app.post('/api/users/:_id/exercises',async (req,res)=>{
  const { description, duration} = req.body
  const date = req.body.date || new Date()
  const _id = req.params._id
  const user = await User.findById(_id)
  const exerciseNew = new Exercise({
    _id,
    username: user.username,
    description,
    duration,
    date
  })
  const exercise = await exerciseNew.save()
  res.json(exercise)
})




connectDb()
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
