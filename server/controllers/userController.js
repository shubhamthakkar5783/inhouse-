const UserModel = require('../models/userModel');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getAll();
      res.json({ success: true, data: users });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const userId = await UserModel.create(req.body);
      const user = await UserModel.findById(userId);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      await UserModel.update(req.params.id, req.body);
      const user = await UserModel.findById(req.params.id);
      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await UserModel.delete(req.params.id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = userController;
