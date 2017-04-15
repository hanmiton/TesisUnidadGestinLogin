angular.module('mainController',['authServices'])

.controller('mainCtrl', function(Auth, $location, $timeout, $rootScope){
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
			
	});

	

	this.doLogin = function(loginData){
		app.loading= true;
		app.errorMsg = false;
		app.successMsg = false;
		
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
				app.loading= false;
				app.errorMsg = data.data.message;
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
	
	