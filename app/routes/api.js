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
		user.name = req.body.name;
		console.log(req.body);
		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == ''){
			//res.send('hola');
			res.json({ success: false, message: 'Asegura tu nombre de usuario, email y contraseña'});
			//res.json({ success: false, messaje: 'hola'});
		}else{
			user.save(function(err){
				if(err){
					if(err.errors != null){
						if(err.errors.name){
							res.json({ success: false, message: err.errors.name.message});	
						} else if (err.errors.email) {
							res.json({ success: false, message: err.errors.email.message});
						} else if (err.errors.username) {
							res.json({ success: false, message: err.errors.username.message});
						} else if (err.errors.password) {
							res.json({ success: false, message: err.errors.password.message});
						} else {
							res.json({ success: false, message: err})
						}
							
					} else if (err){
						if (err.code == 11000) {
							if(err.errmsg[61] == "u"){
								res.json({ success: false, message: 'Usuario ya esta en uso'});
							} else if(err.errmsg[61] == "e"){
								res.json({ success: false, message: 'Este email ya esta en uso '})
							}
							//res.json( { success: false, message : 'Nombre de usuario o email en uso!'})
						} else {
							res.json({ success: false, message: err });	
						}
					}
				} else {
					res.json({ success: true, message: 'usuario Creado!'});
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

	router.use(function(req, res, next) {
		var token = req.body.token || req.body.query || req.headers['x-access-token'];

		if(token){
			jwt.verify(token, secret, function(err, decoded){
				if(err){
					res.json({ success: false, message: 'Token invalid'});
				} else {
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.json({ success: false, message : 'No token provided'});
		}
	})

	router.post('/me', function(req,res){
		res.send(req.decoded);
	});

	return router;
}