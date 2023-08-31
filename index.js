const express = require('express')
const path = require('path')
const PORT = 3000

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', function (req, res) {
  console.log("html request")
  res.render('main.ejs')
})

app.get('/api/newgame', function (req, res) {
  console.log("api request")
  const data = require(path.join(__dirname,'/games/default.json'));
  res.json(data);
})

app.listen(PORT)