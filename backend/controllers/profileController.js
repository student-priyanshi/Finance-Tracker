const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Check if email or username already exists (excluding current user)
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.user.id } },
        { $or: [{ email }, { username }] }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password -otp');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};