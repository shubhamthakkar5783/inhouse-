const BudgetModel = require('../models/budgetModel');

const budgetController = {
  getAllBudgets: async (req, res) => {
    try {
      const budgets = await BudgetModel.getAll();
      res.json({ success: true, data: budgets });
    } catch (error) {
      console.error('Error getting budgets:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getBudgetById: async (req, res) => {
    try {
      const budget = await BudgetModel.findById(req.params.id);
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
      const budget = await BudgetModel.findByEventId(req.params.eventId);
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
      const budgetId = await BudgetModel.create(req.body);
      const budget = await BudgetModel.findById(budgetId);
      res.status(201).json({ success: true, data: budget });
    } catch (error) {
      console.error('Error creating budget:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateBudget: async (req, res) => {
    try {
      await BudgetModel.update(req.params.id, req.body);
      const budget = await BudgetModel.findById(req.params.id);
      res.json({ success: true, data: budget });
    } catch (error) {
      console.error('Error updating budget:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteBudget: async (req, res) => {
    try {
      await BudgetModel.delete(req.params.id);
      res.json({ success: true, message: 'Budget deleted successfully' });
    } catch (error) {
      console.error('Error deleting budget:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = budgetController;
