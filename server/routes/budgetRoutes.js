const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

router.get('/', budgetController.getAllBudgets);
router.get('/:id', budgetController.getBudgetById);
router.get('/event/:eventId', budgetController.getBudgetByEventId);
router.post('/', budgetController.createBudget);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
