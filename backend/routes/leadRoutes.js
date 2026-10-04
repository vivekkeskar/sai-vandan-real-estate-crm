const express = require('express');
const router = express.Router();
const { 
  getLeads, getLeadById, createLead, updateLead, deleteLead, saveLeadQualification 
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getLeads)
  .post(protect, createLead);

router.route('/:id')
  .get(protect, getLeadById)
  .put(protect, updateLead)
  .delete(protect, deleteLead);

router.post('/:id/qualification', protect, saveLeadQualification);

module.exports = router;
