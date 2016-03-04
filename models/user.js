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
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [7, 100],
				isString: function (value) {
					if (typeof value !== 'string') {
						throw new Error('Password must be a string');
					}
				}
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if(typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		}
	});
}