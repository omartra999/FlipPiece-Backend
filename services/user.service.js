const { User } = require('../models');

exports.getUserProfile = async (userId) => {
  return User.findByPk(userId, {
    attributes: ['id', 'username', 'email', 'firstName', 'lastName']
  });
};

