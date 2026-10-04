const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');

// ================= EMPLOYEE CONTROLLER =================
const getEmployees = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = {};
    if (department && department !== 'All') query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }
    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ATTENDANCE CONTROLLER =================
const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({}).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAttendance = async (req, res) => {
  try {
    const record = await Attendance.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LEAVE CONTROLLER =================
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({}).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= PAYROLL CONTROLLER =================
const getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find({}).sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPayroll = async (req, res) => {
  try {
    const { 
      employeeId, employeeName, salaryMonth, basic, hra, incentives, salesCommission, bonus,
      pf, esic, professionalTax, advanceSalary, loanRecovery, otherDeductions, paymentMode, paymentStatus
    } = req.body;

    const b = Number(basic) || 0;
    const h = Number(hra) || 0;
    const inc = Number(incentives) || 0;
    const comm = Number(salesCommission) || 0;
    const bon = Number(bonus) || 0;

    const pfDed = Number(pf) || 0;
    const esicDed = Number(esic) || 0;
    const ptDed = Number(professionalTax) || 200;
    const advDed = Number(advanceSalary) || 0;
    const loanDed = Number(loanRecovery) || 0;
    const othDed = Number(otherDeductions) || 0;

    const grossSalary = b + h + inc + comm + bon;
    const totalDeductions = pfDed + esicDed + ptDed + advDed + loanDed + othDed;
    const netSalary = Math.max(0, grossSalary - totalDeductions);

    const payroll = await Payroll.create({
      employeeId, employeeName, salaryMonth, basic: b, hra: h, incentives: inc, salesCommission: comm, bonus: bon,
      pf: pfDed, esic: esicDed, professionalTax: ptDed, advanceSalary: advDed, loanRecovery: loanDed, otherDeductions: othDed,
      grossSalary, totalDeductions, netSalary, paymentMode: paymentMode || 'Bank Transfer', paymentStatus: paymentStatus || 'Paid'
    });

    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmployees, createEmployee, updateEmployee, deleteEmployee,
  getAttendance, createAttendance,
  getLeaves, createLeave, updateLeaveStatus,
  getPayrolls, createPayroll, updatePayroll
};
