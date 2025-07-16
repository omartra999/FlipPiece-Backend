const userService = require('../services/user.service');

exports.findOrCreateByFirebaseUid = async (req, res) => {
  try {
    const user = await userService.findOrCreateByFirebaseUid(req.user);
    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch profile.',
      error: err.message
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user.uid, req.body);
    res.json({
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to update profile.',
      error: err.message
    });
  }
};
exports.deleteUserAccount = async (req, res) => {
  try {
    await userService.deleteUserAccount(req.user.uid);
    res.json({
      message: 'Account deleted successfully.'
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete account.',
      error: err.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch users.',
      error: err.message
    });
  }
};
exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.uid);
    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch profile.',
      error: err.message
    });
  }
};
