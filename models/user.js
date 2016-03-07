var bcrypt = require('bcryptjs');
var _ = require('lodash');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
				len: [1, 255],
				isString: function (value) {
					if (typeof value !== 'string') {
						throw new Error('Email address must be a string');
					}
				}
			}
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7, 100],
				isString: function (value) {
					if (typeof value !== 'string') {
						throw new Error('Password must be a string');
					}
				}
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if(typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				return _.omit(this.toJSON(), 'password', 'password_hash');
			}
		}
	});
}