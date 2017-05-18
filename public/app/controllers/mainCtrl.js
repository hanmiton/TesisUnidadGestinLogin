angular.module('mainController',['authServices'])

.controller('mainCtrl', function(Auth, $location, $timeout, $rootScope, $window, $interval ){
	//console.log('hanmilton')
	var app = this;
 	
 	app.loadme = false;

 	app.checkSession = function() {
 		if(Auth.isLoggedIn()) {
 			app.checkingSession = true;
 			var interval = $interval(function(){
 				var token = $window.localStorage.getItem('token');
 				if(token === null ) {
 					$interval.cancel(interval);
 				} else {
 					self.parseJwt = function(token) {
 						var base64Url = token.split('.')[1];
 						var base64 = base64Url.replace('-', '+').replace('_', '/');
 						return JSON.parse($window.atob(base64));
 					}

 					var expireTime = self.parseJwt(token);
 					var timeStamp = Math.floor(Date.now() / 1000);
 					console.log(expireTime.exp);
 					console.log(timeStamp); 
 					var timeCheck = expireTime.exp - timeStamp;
 					console.log('timeCheck : ' + timeCheck);
 					if(timeCheck <= 0) {
 						console.log('token ha expirado');
 						$interval.cancel(interval);
 					} else {
 						console.log('token todavia no ha expirado');
 					}
 				}
 			} , 2000);
 		}
 	};

 	app.checkSession();

	$rootScope.$on('$routeChangeStart', function() {
		if(!app.checkSession) app.checkSession();

		if (Auth.isLoggedIn()) {
			console.log('Success: User is logged in.');
			app.isLoggedIn = true;
			
			Auth.getUser().then(function(data) {
				console.log(data.data.username);
				console.log(data.data);
				app.username = data.data.username;
				app.useremail = data.data.email;
				app.loadme = true;
			});
		}else {
			console.log('Failure: User is NOT logged in.');
			app.isLoggedIn = false;
			app.username = '';
			app.loadme = true;
		}
		 if ($location.hash() == '_=_') $location.hash(null);

			
	});

	
	this.facebook = function() {
		app.disabled = true; 
		//console.log($window.location);
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
	};

	this.twitter = function() {
		app.disabled = true; 
		//console.log($window.location);
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
	};

	this.google = function() {
		app.disabled = true; 
		//console.log($window.location);
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
	};

	this.doLogin = function(loginData){
		app.loading= true;
		app.errorMsg = false;
		app.successMsg = false;
		app.expired = false;
		app.disabled = true;
		
		Auth.login(app.loginData).then(function(data){
			if(data.data.success){
				app.loading= false;
				app.successMsg = data.data.message + '...Redirigiendo';
				//redirect to hombe page
				$timeout(function(){
					$location.path('/about');
					app.loginData= '';
					app.successMsg = false;
					app.checkSession();
				},2000);

			}else{
				if(data.data.expired){
					//Create an error message
					app.expired = true;
					app.loading = false;
					app.errorMsg = data.data.message;
				} else {
					//Create on error message
					app.loading = false;
					app.disabled = true;
					app.errorMsg = data.data.message;
				}
			}

			//console.log(this.loginData);
			//console.log(data.data.message);
		});
	};

	this.logout = function() {
		Auth.logout();
		$location.path('/logout');
		$timeout(function(){
			$location.path('/');
		}, 2000);
	};
});
	
	