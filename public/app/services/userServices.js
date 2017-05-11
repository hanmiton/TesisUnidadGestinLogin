angular.module('userServices', [])

	.factory('User', function($http){
		var userFactory = {};

		// User.create(regData)
		userFactory.create = function(regData){
			return $http.post('/api/users', regData);
		}

		// User.checkUsername(regData)
		userFactory.checkUsername = function(regData){
			return $http.post('/api/checkusername', regData);
		}

		// User.create(regData)
		userFactory.checkEmail = function(regData){
			return $http.post('/api/checkemail', regData);
		}

		//User.activeaccount(token):
		userFactory.activeAccount = function(token) {
			return $http.put('/api/activate/' + token);
		}

		//User.checkCredentials(loginData);
		userFactory.checkCredentials = function(loginData){
			return $http.post('/api/resend', loginData);
		}

		
		return userFactory;
});
