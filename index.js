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
  let date = req.body.date
  if(date){
    date = new Date(date).toDateString()
  }else{
    date = new Date().toDateString()
  }
  const _id = req.params._id
  const user = await User.findById(_id)
  const exercise = await Exercise.findOneAndUpdate({_id: _id},{
    username: user.username,
    description: description,
    duration: parseInt(duration),
    date: date
  },{upsert:true, new:true})

  let log = await Log.findById(_id)
  if(!log){
    log = new Log({
      _id,
      count: 1,
      username: user.username,
      log: [{
        description,
        duration,
        date
      }]
    })
    await log.save()
  }
  else{
    log.count = log.count + 1
    log.log.push({
      description,
      duration,
      date
    })
    await Log.updateOne({_id: log._id},{count: log.count, log: log.log})
  }

  res.json({
    _id: exercise._id,
    username: exercise.username,
    date: exercise.date,
    duration: exercise.duration,
    description: exercise.description
  })
})

app.get('/api/users/:_id/logs', async (req,res)=>{
  const _id = req.params._id
  let {from, to, limit} = req.query
  let logs
  if(from && to && limit){
    from = new Date(from)
    to = new Date(to)
    logs = await Log.aggregate([
      {$match: {_id: _id}},
      {$unwind: "$log"},
      {$match:{"log.date":{$gte:from, $lte:to}}},
      {$limit: parseInt(limit)},
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          count: { $first: "$count" },
          log: { $push: "$log" },
        },
      }
    ])
  }else{
    logs = await Log.findById(_id)
  }
  res.json(logs)
  
})




connectDb()
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
