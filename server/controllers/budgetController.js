const { allQuery, getQuery, runQuery } = require('../database');

const budgetController = {
  getAllBudgets: async (req, res) => {
    try {
      const budgets = await allQuery('SELECT * FROM budgets ORDER BY created_at DESC');
      res.json({ success: true, data: budgets });
    } catch (error) {
      console.error('Error getting budgets:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getBudgetById: async (req, res) => {
    try {
      const budget = await getQuery('SELECT * FROM budgets WHERE id = ?', [req.params.id]);
      if (!budget) {
        return res.status(404).json({ success: false, error: 'Budget not found' });
      }
      res.json({ success: true, data: budget });
    } catch (error) {
      console.error('Error getting budget:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getBudgetByEventId: async (req, res) => {
    try {
      const budget = await getQuery('SELECT * FROM budgets WHERE event_id = ?', [req.params.eventId]);
      if (!budget) {
        return res.status(404).json({ success: false, error: 'Budget not found for this event' });
      }
      res.json({ success: true, data: budget });
    } catch (error) {
      console.error('Error getting event budget:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createBudget: async (req, res) => {
    try {
      const {
        event_id,
        venue_total = 0,
        catering_total = 0,
        services_total = 0,
        miscellaneous_total = 0,
        grand_total = 0,
        budget_data = null
      } = req.body;

      const result = await runQuery(
        `INSERT INTO budgets (
          event_id, venue_total, catering_total, services_total,
          miscellaneous_total, grand_total, budget_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [event_id, venue_total, catering_total, services_total, miscellaneous_total, grand_total, JSON.stringify(budget_data)]
      );

      const budget = await getQuery('SELECT * FROM budgets WHERE id = ?', [result.id]);
      res.status(201).json({ success: true, data: budget });
    } catch (error) {
      console.error('Error creating budget:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateBudget: async (req, res) => {
    try {
      const {
        venue_total,
        catering_total,
        services_total,
        miscellaneous_total,
        grand_total,
        budget_data
      } = req.body;

      await runQuery(
        `UPDATE budgets SET
          venue_total = ?, catering_total = ?, services_total = ?,
          miscellaneous_total = ?, grand_total = ?, budget_data = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [venue_total, catering_total, services_total, miscellaneous_total, grand_total, JSON.stringify(budget_data), req.params.id]
      );

      const budget = await getQuery('SELECT * FROM budgets WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: budget });
    } catch (error) {
      console.error('Error updating budget:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteBudget: async (req, res) => {
    try {
      await runQuery('DELETE FROM budgets WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Budget deleted successfully' });
    } catch (error) {
      console.error('Error deleting budget:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = budgetController;
