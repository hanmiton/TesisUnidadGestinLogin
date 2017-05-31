angular.module('managementController', [])

.controller('managementCtrl', function(User) {
	var app = this;

	app.loading = true;
	app.accessDenied = true;
	app.errorMsg = false;
	app.editAccess = false;
	app.deleteAccess = false;
	app.limit = 5;

	function getUsers() {
		User.getUsers().then(function(data) {
			if (data.data.success) {
				if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
					app.users = data.data.users;
					app.loading = false;
					app.accessDenied = false;
					if(data.data.permission === 'admin' ) {
						app.editAccess = true;
						app.deleteAccess = true;
					} else if (data.data.permission === 'moderator' ) {
						app.editAccess = true;
					}
				} else {
					app.errorMsg = 'Permisos insuficientes';
					app.loading = false;
				}
			} else {
				app.errorMsg = data.data.message;
				app.loading = false;
			}
		});
	};

	getUsers();

	app.showMore = function(number) {
		app.showMoreError = false;

		if (number > 0 ) {
			app.limit = number;
		} else {
			app.showMoreError = 'Porfavor ingres un numero valido';
		}
	};

	app.showAll = function() {
		app.limit = undefined;
		app.showMoreError = false;
	};

	app.deleteUser = function(username) {
		User.deleteUser(username).then(function(data) {
			if(data.data.success) {

			} else {
				app.showMoreError = data.data.message;
			}
		});
	}

})

.controller('editCtrl' , function() {

});