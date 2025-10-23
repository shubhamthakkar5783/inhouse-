const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.post('/generate', imageController.generateImage);
router.post('/generate-multiple', imageController.generateMultipleImages);
router.get('/event/:eventId', imageController.getEventImages);

module.exports = router;
