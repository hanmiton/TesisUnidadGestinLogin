angular.module('userApp', ['appRoutes','userControllers', 'emailControllers' 'userServices', 'mainController', 'authServices'])

.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptors');
});