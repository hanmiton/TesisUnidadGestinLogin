var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';

module.exports = function(router){
	// http://localhost:80/api/users
	// www.unidaddegestion.club:80/users
	router.post('/users',function(req,res){
		//res.send('testing users route')
		//console.log(req.body);
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;
		user.email = req.body.email;
		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == ''){
			//res.send('hola');
			res.json({ success: false, message: 'Asegura tu nombre de usuario, email y contraseña'});
			//res.json({ success: false, messaje: 'hola'});
		}else{
			user.save(function(err){
				if(err){
					res.json({ success: false, message: 'Username o Email ya existen!.'});
				} else {
					res.json({ success: true, message: 'user created!'});
				}
			}); 
		}
	});


	//user login route
	// http://localhost:port/api/authenticate
	router.post('/authenticate', function(req, res){
		User.findOne({ username: req.body.username}).select('email username password').exec(function(err, user){
			if(err) throw err;
			console.log(user);
			if (!user){
				res.json({success:false, message: 'No se puede autenticar usuario'});
				
			}else if (user){
				if(req.body.password){
					var validPassword = user.comparePassword(req.body.password);	
					if(!validPassword){
					res.json({success: false, message: 'No puede autentica password'});
					} else {
					var token = jwt.sign({ username: user.username, email: user.email}, secret, {expiresIn: '24h'});
					res.json({success: true, message: 'User autenticado!', token: token});
				}
				} else {
					res.json({ success: false, message : 'Password no ingresado'});
				}
				
				
			}
		});
	});
	return router;
}