import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import {User,
  Exercise,
  Log,
  connectDb} from './db.js'

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

app.post('/api/users',(req,res)=>{
  console.log(req.body)
  res.json('some result')
})




connectDb()
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
