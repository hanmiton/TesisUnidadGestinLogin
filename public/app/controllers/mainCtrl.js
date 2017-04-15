angular.module('mainController',['authServices'])

.controller('mainCtrl', function(Auth, $location, $timeout){
	//console.log('hanmilton')
	var app = this;

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
				},2000);

			}else{
				app.loading= false;
				app.errorMsg = data.data.message;
			}

			//console.log(this.loginData);
			//console.log(data.data.message);
		});
	};
});
	
	