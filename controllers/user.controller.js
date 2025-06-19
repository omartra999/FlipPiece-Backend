const userService = require('../services/user.service');

exports.profile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile.', error: err.message });
  }
};