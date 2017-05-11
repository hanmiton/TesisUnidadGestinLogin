var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = function(router){



	var options = {
	  auth: {
	    api_user: 'hanmilton',
	    api_key: 'UnidadDeGestion777'
	  }
	}

	var client = nodemailer.createTransport(sgTransport(options));


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
		user.temporarytoken = jwt.sign({ username: user.username, email: user.email}, secret, {expiresIn: '24h'});
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

					var email = {
					  from: 'Localhost Staff, staff@localhost.com',
					  to: user.email,
					  subject: 'unidaddegestion.club Enlace de Activación',
					  text: 'Hola' + user.name + ',gracias por registrate en unidaddegestion.club. Porfavor click en el siguiente link para completar la activación.',
					//local
					//html: '<b>Hello <strong>' + user.name + '</strong>,<br><br> Gracias por registrarte en unidaddegestion.club. Porfavor da click de abajo para completar la activación:<br><br><a href="http://localhost:5000/activate/' + user.temporarytoken + '">http://localhost:5000/activate/</a>'
					html: '<b>Hello <strong>' + user.name + '</strong>,<br><br> Gracias por registrarte en unidaddegestion.club. Porfavor da click de abajo para completar la activación:<br><br><a href="https://www.unidaddegestion.club/activate/' + user.temporarytoken + '">https://www.unidaddegestion.club/activate/</a>'
					};

					client.sendMail(email, function(err, info){
					    if (err ){
					      console.log(error);
					    }
					    else {
					      console.log('Mensaje enviado ' + info.response);
					    }	
					});
					
					res.json({ success: true, message: 'Cuenta registrada! Por favor rebiza tu correo para el link de ativacion.'});
				}
			}); 
		}
	});

	router.post('/checkusername', function(req, res){
		User.findOne({ username: req.body.username}).select('username').exec(function(err, user){
			if(err) throw err;
			console.log(user);
			if (user){
				res.json({success:false, message: 'Username en uso'});
				
			}else {
				res.json({success: true, message: 'Username Valido'})
			}
		});
	});

	router.post('/checkemail', function(req, res){
		User.findOne({ email: req.body.email}).select('email').exec(function(err, user){
			if(err) throw err;
			//console.log(user);
			if (user){
				res.json({success:false, message: 'email en uso'});
				
			}else {
				res.json({success: true, message: 'email Valido'})
			}
		});
	});



	//user login route
	// http://localhost:port/api/authenticate
	router.post('/authenticate', function(req, res){
		User.findOne({ username: req.body.username}).select('email username password active').exec(function(err, user){
			if(err) throw err;
			
			if (!user){
				res.json({success:false, message: 'No se puede autenticar usuario'});	
			}else if (user){
				if(req.body.password){
					var validPassword = user.comparePassword(req.body.password);	
					if(!validPassword){
					res.json({success: false, message: 'No puede autentica password'});
					} else if(!user.active){
						res.json({success: false, message: 'Cuenta todavia no activada, Por favor rebiza tu e-mail por el link de ativacion', expired: true});
					}
					else {
					var token = jwt.sign({ username: user.username, email: user.email}, secret, {expiresIn: '24h'});
					res.json({success: true, message: 'User autenticado!', token: token});
				}
				} else {
					res.json({ success: false, message : 'Password no ingresado'});
				}
				
				
			}
		});
	});

	router.put('/activate/:token', function(req,res){
		console.log(req.params.token);
		
		User.findOne({ temporarytoken: req.params.token}, function(err, user){
			if (err) throw err;
			var token = req.params.token;
			//console.log(user);
			jwt.verify(token, secret, function(err, decoded){
				if(err){
					res.json({ success: false, message: 'Enlace de activacion esta expirado.'});
				} else  if(!user){
					res.json({ success: false, message: 'Enlace de activación esta expirado.'})
				} else {
					user.temporarytoken = false;
					user.active = true;
					user.save(function(err){
						if (err) {
							console.log(err);
						}else {
							var email = {
								  from: 'Localhost Staff, staff@localhost.com',
								  to: user.email,
								  subject: 'Cuenta Activada',
								  text: 'Hola' + user.name + ', Tu cuenta ha sido exitosamente activada!',
								  html: 'Hello <strong>' + user.name + '</strong>,<br><br> Tu cuenta ha sido exitosamente activada!'

								};

								client.sendMail(email, function(err, info){
								    if (err ){
								      console.log(error);
								    }
								    else {
								      console.log('Message sent: ' + info.response);
								    }
								});

							res.json({success: true, message: 'Cuenta Activada'});
						}
					});
				}
			});
		});
	});


	router.post('/resend', function(req, res){
		User.findOne({ username: req.body.username}).select('username password active').exec(function(err, user){
			if(err) throw err;
			
			if (!user){
				res.json({success:false, message: 'No se puede autenticar usuario'});	
			}else if (user){
				if(req.body.password){
					var validPassword = user.comparePassword(req.body.password);	
					if(!validPassword){
					res.json({success: false, message: 'No puede autentica password'});
					} else if(user.active){
						res.json({success: false, message: 'Cuenta ya esta activada.'});
					}
					else {
					res.json({user: user});
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