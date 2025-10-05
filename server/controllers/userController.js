const { allQuery, getQuery, runQuery } = require('../database');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await allQuery('SELECT * FROM users ORDER BY created_at DESC');
      res.json({ success: true, data: users });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await getQuery('SELECT * FROM users WHERE id = ?', [req.params.id]);
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
      const { username, email, password, full_name, phone } = req.body;
      const result = await runQuery(
        'INSERT INTO users (username, email, password, full_name, phone) VALUES (?, ?, ?, ?, ?)',
        [username, email, password, full_name, phone]
      );
      const user = await getQuery('SELECT * FROM users WHERE id = ?', [result.id]);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { username, email, full_name, phone } = req.body;
      await runQuery(
        'UPDATE users SET username = ?, email = ?, full_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [username, email, full_name, phone, req.params.id]
      );
      const user = await getQuery('SELECT * FROM users WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await runQuery('DELETE FROM users WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = userController;
