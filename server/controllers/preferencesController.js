const { allQuery, getQuery, runQuery } = require('../database');

const preferencesController = {
  getPreferences: async (req, res) => {
    try {
      const userId = req.query.user_id || 1;
      const preferences = await getQuery(
        'SELECT * FROM event_preferences WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );

      if (!preferences) {
        return res.json({ success: true, data: null });
      }

      res.json({ success: true, data: preferences });
    } catch (error) {
      console.error('Error getting preferences:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getAllPreferences: async (req, res) => {
    try {
      const userId = req.query.user_id || 1;
      const preferences = await allQuery(
        'SELECT * FROM event_preferences WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      res.json({ success: true, data: preferences });
    } catch (error) {
      console.error('Error getting all preferences:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createPreferences: async (req, res) => {
    try {
      const {
        user_id = 1,
        event_id = null,
        venue,
        number_of_people,
        budget,
        event_date,
        event_time,
        event_type
      } = req.body;

      const result = await runQuery(
        `INSERT INTO event_preferences (
          user_id, event_id, venue, number_of_people, budget,
          event_date, event_time, event_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, event_id, venue, number_of_people, budget, event_date, event_time, event_type]
      );

      const preference = await getQuery(
        'SELECT * FROM event_preferences WHERE id = ?',
        [result.id]
      );
      res.status(201).json({ success: true, data: preference });
    } catch (error) {
      console.error('Error creating preferences:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updatePreferences: async (req, res) => {
    try {
      const {
        venue,
        number_of_people,
        budget,
        event_date,
        event_time,
        event_type,
        event_id
      } = req.body;

      await runQuery(
        `UPDATE event_preferences SET
          venue = ?, number_of_people = ?, budget = ?,
          event_date = ?, event_time = ?, event_type = ?,
          event_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [venue, number_of_people, budget, event_date, event_time, event_type, event_id, req.params.id]
      );

      const preference = await getQuery(
        'SELECT * FROM event_preferences WHERE id = ?',
        [req.params.id]
      );
      res.json({ success: true, data: preference });
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  saveOrUpdatePreferences: async (req, res) => {
    try {
      const {
        user_id = 1,
        event_id = null,
        venue,
        number_of_people,
        budget,
        event_date,
        event_time,
        event_type
      } = req.body;

      const existingPreference = await getQuery(
        'SELECT * FROM event_preferences WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [user_id]
      );

      let preference;
      if (existingPreference) {
        await runQuery(
          `UPDATE event_preferences SET
            venue = ?, number_of_people = ?, budget = ?,
            event_date = ?, event_time = ?, event_type = ?,
            event_id = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
          [venue, number_of_people, budget, event_date, event_time, event_type, event_id, existingPreference.id]
        );

        preference = await getQuery(
          'SELECT * FROM event_preferences WHERE id = ?',
          [existingPreference.id]
        );
      } else {
        const result = await runQuery(
          `INSERT INTO event_preferences (
            user_id, event_id, venue, number_of_people, budget,
            event_date, event_time, event_type
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [user_id, event_id, venue, number_of_people, budget, event_date, event_time, event_type]
        );

        preference = await getQuery(
          'SELECT * FROM event_preferences WHERE id = ?',
          [result.id]
        );
      }

      res.json({ success: true, data: preference });
    } catch (error) {
      console.error('Error saving/updating preferences:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deletePreferences: async (req, res) => {
    try {
      await runQuery('DELETE FROM event_preferences WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Preferences deleted successfully' });
    } catch (error) {
      console.error('Error deleting preferences:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = preferencesController;
