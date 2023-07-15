const express = require('express');
const router = express.Router();

const aboutController = require('../controllers/about');

// => GET
router.get('/brand', aboutController.getBrand);

router.get('/routine', aboutController.getRoutine);

router.get('/research', aboutController.getResearch);

router.get('/routine', aboutController.getRoutine);

router.get('/research/ingredients', aboutController.getIngredients);

router.get('/success', aboutController.getSuccess);

module.exports = router;
