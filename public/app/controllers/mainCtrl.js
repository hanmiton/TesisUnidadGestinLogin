angular.module('mainController',['authServices'])

.controller('mainCtrl', function(Auth, $location, $timeout, $rootScope, $window){
	//console.log('hanmilton')
	var app = this;
 	
 	app.loadme = false;

	$rootScope.$on('$routeChangeStart', function() {
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
		//console.log($window.location);
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
	};

	this.twitter = function() {
		//console.log($window.location);
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
	};

	this.google = function() {
		//console.log($window.location);
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
	};

	this.doLogin = function(loginData){
		app.loading= true;
		app.errorMsg = false;
		app.successMsg = false;
		app.expired = false;
		
		Auth.login(app.loginData).then(function(data){
			if(data.data.success){
				app.loading= false;
				app.successMsg = data.data.message + '...Redirigiendo';
				//redirect to hombe page
				$timeout(function(){
					$location.path('/about');
					app.loginData= '';
					app.successMsg = false;
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
	
	