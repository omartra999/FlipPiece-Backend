const { User } = require('../models');

exports.findOrCreateByFirebaseUid = async (userData) => {
  const [user, created] = await User.findOrCreate({
    where: { firebaseUid: userData.uid },
    defaults: {
      username: userData.displayName || userData.email.split('@')[0],
      email: userData.email,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      isAdmin: false,
    },
  });
  return { user, created };
}

exports.updateUserProfile = async (uid, profileData) => {
  const user = await User.findOne({ where: { firebaseUid: uid } });
  if (!user) {
    throw new Error('User not found');
  }
  
  const updatedUser = await user.update(profileData);
  return updatedUser;
};

exports.deleteUserAccount = async (uid) => {
  const user = await User.findOne({ where: { firebaseUid: uid } });
  if (!user) {
    throw new Error('User not found');
  }
  await user.destroy();
};
exports.getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};
exports.getUserProfile = async (uid) => {
  const user = await User.findOne({ where: { firebaseUid: uid } });
  return user;
};