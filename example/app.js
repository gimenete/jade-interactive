var express = require('express')
var http = require('http')
var path = require('path')
var app = express()
var interacive = require('../')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// these lines configure jade-interactive in an express app
// jade-interactive requires jade-debug which is a fork of jade
app.engine('jade', require('jade-debug').__express)
interacive.configureApp({
  app: app,
  // Set the command to open your text editor
  // For SublimteText <executable> <file>:<line>
  cmd: '/Applications/Sublime\\ Text\\ 2.app/Contents/SharedSupport/bin/subl %s:%s',
})
// --

app.locals.pretty = true

app.get('/', function(req, res) {
  res.render('index')
})

http.createServer(app).listen(3000)
console.log('Server started at http://127.0.0.1:3000')
