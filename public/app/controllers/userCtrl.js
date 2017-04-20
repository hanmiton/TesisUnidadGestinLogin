angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){
	
	var app = this;

	this.regUser = function(regData, valid){
		app.loading= true;
		app.errorMsg = false;
		app.successMsg = false;
		
		if(valid){
			User.create(app.regData).then(function(data){
			if(data.data.success){
				app.loading= false;
				app.successMsg = data.data.message + '...Redirigiendo';
				//redirect to hombe page
				$timeout(function(){
					$location.path('/');
				},2000);

			}else{
				app.loading= false;
				app.errorMsg = data.data.message;
			}

			//console.log(this.regData);
			//console.log(data.data.message);
		});
		} else {
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

	if($window.location.pathname == '/facebookerror') {
		app.errorMsg = 'Facebook Usuario no encontrado en base de datos';
	} else {

		Auth.facebook($routeParams.token);
		$location.path('/');
	//	}
	}

})

.controller('twitterCtrl', function($routeParams, Auth, $location, $window) {
	//console.log($routeParams.token);

	var app = this;

	if($window.location.pathname == '/twittererror') {
		app.errorMsg = 'Twitter Usuario no encontrado en base de datos';
	} else {

		Auth.facebook($routeParams.token);
		$location.path('/');
	//	}
	}

})

.controller('googleCtrl', function($routeParams, Auth, $location, $window) {
	//console.log($routeParams.token);

	var app = this;

	if($window.location.pathname == '/googleerror') {
		app.errorMsg = 'Google Usuario no encontrado en base de datos';
	} else {

		Auth.facebook($routeParams.token);
		$location.path('/');
	//	}
	}

});