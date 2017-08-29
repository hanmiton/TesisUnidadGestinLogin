var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
var passport = require('passport');
var social = require('./app/passport/passport')(app, passport);
var User = require('./app/models/user.js');
var multer = require('multer');
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/images/')
	}
	filename: function(req, file, cb) {
		if(!file.originalname.match(/\.(png)$/)){
			var err = new Error();
			err.code = 'filetype';
			return cb(err);
		} else {
			cb(null, Date.now() + '_' + file.originalname);
		}
	} 	  
});

var upload = multer({ 
	storage: storage,
	limits: {fileSize: 10000000}
	 }).single('myfile');


app.use(morgan('dev')); 
app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); //for parsing application
app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes);
//Deploy

//http://localhost:80/api/ users
//mongoose.connect('mongodb://localhost :27017/tutorial', function(err){
mongoose.connect('mongodb://localhost:27017/tutorial', function(err){
//mongoose.connect('mongodb://node:node@ds023644.mlab.com:23644/hanmilton',function(err){

	if(err){
		console.log('Not Connected to the database: ' + err);
	}
	else{
		console.log('Successfully connected to MongoDB');
	}
});
 /* ejemplo get
app.get('/test', function(req,res) {
	User.findOne({ username: 'hanmilton'} , function(err, user) {
		if (err) {
			res.send(err);
		} else {
			if (!user) {
				res.send(' Hey este usuario no existe');
			} else {
				res.send(user);
			}
		}
	});
});
*/

app.post('/upload' function(req.res ) {
	upload(req, res,, function(err) {
		if (err) {
			if (err.code === 'LIMIT_FILE_SIZE'){
				res.json({ success : false , message : 'El tamaño del archivo es demasiado grande. Límite máximo es 10 mb'})
			} else if (err.code === 'filetype') {
				res.json({success: false, message: 'El tipo de archivo no es válido. Debe ser .png'});
			} else {
				console.log(err);
				res.json({success: false, message: 'El archivo no se pudo cargar'});
			}
		} else {
			if (!req.file) {
				res.json({ success: false, message: 'No se ha seleccionado ningún archivo'});
			} else {
				res.json({ success: true, message: 'Se ha cargado el archivo'});
			}
		}
	});
});

app.get('*',function(req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function(){
	console.log('Running the server on port' + port);
}); 

