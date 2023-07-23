const express = require('express');
const router = express.Router();

const aboutController = require('../controllers/about');

// => GET
router.get('/brand', aboutController.getBrand);

router.get('/routine', aboutController.getRoutine);

router.get('/research', aboutController.getResearch);

router.get('/research/organic', aboutController.getOrganic);

router.get('/research/uv', aboutController.getUv);

router.get('/routine', aboutController.getRoutine);

router.get('/success', aboutController.getSuccess);

router.get('/faqs', aboutController.getFaqs);

router.get('/contact', aboutController.getContact);

router.get('/careers', aboutController.getCareers);

router.get('/privacy-policy', aboutController.getPrivacy);

router.get('/terms-conditions', aboutController.getTerms);

router.post('/newsletter', aboutController.postNewsletter);

module.exports = router;
