var express = require('express')
var app = express()
var port = process.env.PORT || 80
var morgan = require('morgan')

app.use(morgan('dev'))

app.listen(port, function(){
	console.log('Running the server on port' + port)
})