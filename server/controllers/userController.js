const { allQuery, getQuery, runQuery } = require('../database');
const bcrypt = require('bcrypt');

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
  },

  register: async (req, res) => {
    try {
      const { email, password, full_name } = req.body;

      if (!email || !password || !full_name) {
        return res.status(400).json({
          success: false,
          error: 'Email, password, and full name are required'
        });
      }

      const existingUser = await getQuery('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const username = email.split('@')[0];

      const result = await runQuery(
        'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, full_name]
      );

      const user = await getQuery(
        'SELECT id, username, email, full_name, created_at FROM users WHERE id = ?',
        [result.id]
      );

      res.status(201).json({
        success: true,
        data: user,
        message: 'User registered successfully'
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      const user = await getQuery('SELECT * FROM users WHERE email = ?', [email]);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: userWithoutPassword,
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = userController;
