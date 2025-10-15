const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');

router.get('/', preferencesController.getPreferences);
router.get('/all', preferencesController.getAllPreferences);
router.post('/', preferencesController.createPreferences);
router.put('/:id', preferencesController.updatePreferences);
router.post('/save', preferencesController.saveOrUpdatePreferences);
router.delete('/:id', preferencesController.deletePreferences);

module.exports = router;
