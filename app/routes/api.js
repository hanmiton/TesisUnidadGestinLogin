var User = require('../models/user');

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
	return router;
}