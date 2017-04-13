var express = require('express');
var app = express();
var port = process.env.PORT || 80;
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./app/models/user');
var bodyParser = require('body-parser');

app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); //for parsing application
app.use(morgan('dev')); 

//Deploy
//mongoose.connect('mongodb://localhost :27017/tutorial', function(err){
mongoose.connect('mongodb://localhost:27017/tutorial', function(err){
//mongoose.connect('mongodb://node:node@ds023644.mlab.com:23644/hanmilton',function(err){

	if(err){
		console.log('Not Connected to the database: ' + err);
	}
	else{
		console.log('Successfully connected to MongoDB');
	}
})

// http://localhost:8000/users
// www.unidaddegestion.club:80/users
app.post('/users',function(req,res){
	//res.send('testing users route')
	console.log(req.body);
	var user = new User();
	user.username = req.body.username;
	user.password = req.body.password;
	user.email = req.body.email;
	if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == ''){
		res.send('Ensuere username, email, and password were provided');
	}else{
		user.save(function(err){
			if(err){
				res.send(err);
			} else {
				res.send('user created!');
			}
		}); 
	}
});

app.listen(port, function(){
	console.log('Running the server on port' + port);
}); 