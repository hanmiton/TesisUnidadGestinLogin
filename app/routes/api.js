var User = require('../models/user');

module.exports = function(router){
	// http://localhost:8000/users
	// www.unidaddegestion.club:80/users
	router.post('/users',function(req,res){
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
	return router;
}