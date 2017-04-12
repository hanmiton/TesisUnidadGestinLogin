var express = require('express')
var app = express()

app.get('/',function(req,res){
	res.send('Unidad de gestion deployment probando pull')
})

app.listen(process.env.PORT || 80, function(){
	console.log('Running the server')
})