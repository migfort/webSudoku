const express = require('express')
const path = require('path')
const PORT = 3000

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', function (req, res) {
  res.render('main.ejs')
})

app.listen(PORT)