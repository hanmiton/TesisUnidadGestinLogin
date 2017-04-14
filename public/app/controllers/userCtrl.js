angular.module('userControllers', [])

.controller('regCtrl', function($http){
	
	this.regUser = function(regData){
		console.log('form sumitted');
		console.log(this.regData);
		$http.post('/api/users',this.regData);
	};
});