angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){
	
	var app = this;

	this.regUser = function(regData){
		app.loading= true;
		app.errorMsg = false;
		app.successMsg = false;
		
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
	};
})

.controller('facebookCtrl', function($routeParams, Auth, $location, $window) {
	//console.log($routeParams.token);

	var app = this;

	if($window.location.pathname == '/facebookerror') {
		app.errorMsg = 'Facebook user not found in database';
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
		app.errorMsg = 'Twitter user not found in database';
	} else {

		Auth.facebook($routeParams.token);
		$location.path('/');
	//	}
	}

});