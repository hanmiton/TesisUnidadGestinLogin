angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){
	
	var app = this;

	this.regUser = function(regData, valid){
		app.disabled = true;
		app.loading= true;
		app.errorMsg = false;
		app.successMsg = false;
		
		if(valid){
			User.create(app.regData).then(function(data){
			if(data.data.success){
				app.loading= false;
				app.successMsg = data.data.message + '...Redirigiendo';
				//redirect to hombe page
				//$timeout(function(){
				//	$location.path('/');
				//},2000);

			}else{
				app.loading= false;
				app.disabled = false;
				app.errorMsg = data.data.message;
			}

			//console.log(this.regData);
			//console.log(data.data.message);
		});
		} else {
			app.disabled = false;
			//creacion de mensaje de error
			app.loading = false;
			app.errorMsg = "Porfavor asegurese de llenar apropiadamente los campos";
		}

		
	};


	this.checkUsername = function(regData){
		app.checkingUsername = true;
		app.usernameMsg = false;
		app.usernameInvalid = false;

		User.checkUsername(app.regData).then(function(data) {
			if(data.data.success){
				app.checkingUsername = false;
				app.usernameInvalid = false;
				app.usernameMsg = data.data.message;
			}else{
				app.checkingUsername = false;
				app.usernameInvalid = true;
				app.usernameMsg = data.data.message;
			}
		});
	}

	this.checkEmail = function(regData){
		app.checkingEmail = true;
		app.emailMsg = false;
		app.emailInvalid = false;

		User.checkEmail(app.regData).then(function(data) {
			if(data.data.success){
				app.checkingEmail = false;
				app.emailInvalid = false;
				app.emailMsg = data.data.message;
			}else{
				app.checkingEmail = false;
				app.emailInvalid = true;
				app.emailMsg = data.data.message;
			}
		});
	}

})
//Modificar para funcionar modular
.controller('emailCtrl', function($routeParams, User, $timeout, $location){
		//console.log($routeParams.token);
		app = this;
		
		User.activeAccount($routeParams.token).then(function(data){
			app.successMsg = false;
			app.errorMsg = false;

			if(data.data.success){
				app.successMsg = data.data.message + '...Redirecting';
				$timeout(function(){
					$location.path('/login');
				} , 2000);
			} else {
				app.errorMsg = data.data.message + '...Redirecting';
				$timeout(function(){
					$location.path('/login');
				}, 2000);
			}
		});
	})

.controller('resendCtrl', function(User){
	app = this;

	app.checkCredentials = function(loginData){
		app.disabled = true;
		app.errorMsg = false;
		app.successMsg = false;

		User.checkCredentials(app.loginData).then(function(data){
			if(data.data.success){
				User.resendLink(app.loginData).then(function(data){
					if (data.data.success) {
						app.successMsg = data.data.message;	
					}
				});
			} else {
				app.disabled = true;
				app.errorMsg = data.data.message;
			}
		});
	};
})

.controller('usernameCtrl', function(){
	
})
//hasta aqui modalizar email controller
.directive('match', function(){
	return {
		restrict : 'A',
		controller: function($scope) {

			$scope.confirmed = false;

			$scope.doConfirm = function(values) {
				values.forEach(function(ele){
					if($scope.confirm == ele) {
						$scope.confirmed = true;
					} else {
						$scope.confirmed = false;
					}
				});
			}
		},

		link: function(scope, element, attrs) {

			attrs.$observe('match', function(){
				scope.matches = JSON.parse(attrs.match);
				scope.doConfirm(scope.matches);
			});

			scope.$watch('confirm', function(){
				scope.matches = JSON.parse(attrs.match);
				scope.doConfirm(scope.matches);
			});
		}
	};
})

.controller('facebookCtrl', function($routeParams, Auth, $location, $window) {
	//console.log($routeParams.token);

	var app = this;
	app.errorMsg = false;
	app.expired = false;
	app.disabled = true; 


	if($window.location.pathname == '/facebookerror') {
		app.errorMsg = 'Facebook Usuario no encontrado en base de datos';
	} else if ($window.location.pathname  == '/facebook/inactive/error'){
		app.expired = true;
		app.errorMsg = 'Cuenta todavia no esta activada. Porfavor rebiza tu correo'
	} else {

		Auth.facebook($routeParams.token);
		$location.path('/');
	//	}
	}

})

.controller('twitterCtrl', function($routeParams, Auth, $location, $window) {
	//console.log($routeParams.token);

	var app = this;
	app.errorMsg = false;
	app.expired = false;
	app.disabled = true; 

	if($window.location.pathname == '/twittererror') {
		app.errorMsg = 'Twitter Usuario no encontrado en base de datos';
	} else if ($window.location.pathname  == '/twitter/inactive/error'){
		app.expired = true;
		app.errorMsg = 'Cuenta todavia no esta activada. Porfavor rebiza tu correo'
	}else {

		Auth.facebook($routeParams.token);
		$location.path('/');
	//	}
	}

})

.controller('googleCtrl', function($routeParams, Auth, $location, $window) {
	//console.log($routeParams.token);

	var app = this;
	app.errorMsg = false;
	app.expired = false;
	app.disabled = true; 


	if($window.location.pathname == '/googleerror') {
		app.errorMsg = 'Google Usuario no encontrado en base de datos';
	} else if ($window.location.pathname  == '/google/inactive/error'){
		app.expired = true;
		app.errorMsg = 'Cuenta todavia no esta activada. Porfavor rebiza tu correo'
	} else {

		Auth.facebook($routeParams.token);
		$location.path('/');
	//	}
	}

});