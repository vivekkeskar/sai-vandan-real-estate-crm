const express = require('express');
const router = express.Router();
const { 
  getEmployees, createEmployee, updateEmployee, deleteEmployee,
  getAttendance, createAttendance,
  getLeaves, createLeave, updateLeaveStatus,
  getPayrolls, createPayroll, updatePayroll
} = require('../controllers/hrController');
const { protect } = require('../middleware/auth');

router.route('/employees').get(protect, getEmployees).post(protect, createEmployee);
router.route('/employees/:id').put(protect, updateEmployee).delete(protect, deleteEmployee);

router.route('/attendance').get(protect, getAttendance).post(protect, createAttendance);

router.route('/leaves').get(protect, getLeaves).post(protect, createLeave);
router.route('/leaves/:id').put(protect, updateLeaveStatus);

router.route('/payroll').get(protect, getPayrolls).post(protect, createPayroll);
router.route('/payroll/:id').put(protect, updatePayroll);

module.exports = router;
