const User = require("../models/user");

const updateUserPassword = async (req, res, next) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    // Update password
    const salt = await bcrypt.genSalt();
    const newPassword = await bcrypt.hash(req.body.password, salt);
    user.password = newPassword;
    await user.save();

    // Return updated user
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (userId, updatedFields) => {
    const user = await User.findById(userId);
  
    if (!user) {
      throw new Error("User not found");
    }
  
    if (updatedFields.username) {
      user.username = updatedFields.username;
    }
  
    await user.save();
    return user;
  };

module.exports = { updateUser,updateUserPassword };
