var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
	validate({
		validator: 'matches',
		arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
		message: 'Debe tener por lo menos 3 caracteres, maximo 30,no especial character, tener espacio entre nombre'
	})
];

var emailValidator = [
	validate({
		validator: 'isEmail',
		message: 'Is not a valid e-mail.'
	}),
	validate({
		validator: 'isLength',
		arguments: [3, 25],
		message: 'Email debe estar entre {ARGS[0] AND {ARGS[1]} caracteres'
	})
]

var UserSchema = new Schema({
	name: { type: String, required: true, validate: nameValidator},
	username: { type: String, lowercase: true, required: true, unique: true},
	password: { type: String, required: true},
	email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidator }
});

UserSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

UserSchema.plugin(titlize, {
	paths : [ 'name']
});

UserSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);