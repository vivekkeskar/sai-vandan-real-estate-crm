const mongoose = require('mongoose');
const User = require('../models/User');
const Lead = require('../models/Lead');
const LeadQualification = require('../models/LeadQualification');
const FollowUp = require('../models/FollowUp');
const Property = require('../models/Property');
const SiteVisit = require('../models/SiteVisit');
const Negotiation = require('../models/Negotiation');
const Booking = require('../models/Booking');
const Document = require('../models/Document');
const Loan = require('../models/Loan');
const Agreement = require('../models/Agreement');
const Payment = require('../models/Payment');
const Possession = require('../models/Possession');
const SupportTicket = require('../models/SupportTicket');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');
const Vendor = require('../models/Vendor');
const PurchaseOrder = require('../models/PurchaseOrder');
const VendorBill = require('../models/VendorBill');
const VendorPayment = require('../models/VendorPayment');
const PettyCash = require('../models/PettyCash');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    console.log('Seeding demo data for Sai Vandan Complex...');

    // Clear collections
    await User.deleteMany({});
    await Lead.deleteMany({});
    await LeadQualification.deleteMany({});
    await FollowUp.deleteMany({});
    await Property.deleteMany({});
    await SiteVisit.deleteMany({});
    await Negotiation.deleteMany({});
    await Booking.deleteMany({});
    await Document.deleteMany({});
    await Loan.deleteMany({});
    await Agreement.deleteMany({});
    await Payment.deleteMany({});
    await Possession.deleteMany({});
    await SupportTicket.deleteMany({});
    await Employee.deleteMany({});
    await Attendance.deleteMany({});
    await Leave.deleteMany({});
    await Payroll.deleteMany({});
    await Vendor.deleteMany({});
    await PurchaseOrder.deleteMany({});
    await VendorBill.deleteMany({});
    await VendorPayment.deleteMany({});
    await PettyCash.deleteMany({});
    await Notification.deleteMany({});

    // 1. Users
    const users = await User.create([
      { name: 'Snehal Kulkarni (Client & Admin)', email: 'admin@saivandan.com', password: 'admin123', role: 'Admin', department: 'Management', mobile: '+91 98220 11223' },
      { name: 'Rajesh Sharma', email: 'sales@saivandan.com', password: 'sales123', role: 'Sales Executive', department: 'Sales', mobile: '+91 98221 44556' },
      { name: 'Pooja Kulkarni', email: 'hr@saivandan.com', password: 'hr123', role: 'HR', department: 'Human Resources', mobile: '+91 98222 77889' },
      { name: 'Mahesh Joshi', email: 'accounts@saivandan.com', password: 'accounts123', role: 'Accounts', department: 'Finance', mobile: '+91 98223 99001' },
      { name: 'Vikram Deshmukh', email: 'manager@saivandan.com', password: 'manager123', role: 'Manager', department: 'Operations', mobile: '+91 98224 11223' },
      { name: 'Anil Patil', email: 'employee@saivandan.com', password: 'emp123', role: 'Employee', department: 'Site Operations', mobile: '+91 98225 33445' }
    ]);
    console.log('✓ Users created');

    // 2. Properties (Inventory)
    const propertyData = [
      { projectName: 'Sai Vandan Complex', wing: 'A Wing', floor: 1, unitNumber: 'A-101', flatType: '2 BHK', carpetArea: 750, builtUpArea: 950, price: 6500000, availability: 'Sold', amenities: ['Gym', 'Clubhouse', 'Parking'] },
      { projectName: 'Sai Vandan Complex', wing: 'A Wing', floor: 1, unitNumber: 'A-102', flatType: '1 BHK', carpetArea: 520, builtUpArea: 680, price: 4500000, availability: 'Available', amenities: ['Parking', 'Security'] },
      { projectName: 'Sai Vandan Complex', wing: 'A Wing', floor: 2, unitNumber: 'A-201', flatType: '3 BHK', carpetArea: 1100, builtUpArea: 1380, price: 9500000, availability: 'Reserved', amenities: ['Gym', 'Pool', 'Clubhouse'] },
      { projectName: 'Sai Vandan Complex', wing: 'A Wing', floor: 2, unitNumber: 'A-202', flatType: '2 BHK', carpetArea: 760, builtUpArea: 960, price: 6600000, availability: 'Available', amenities: ['Parking', 'Solar Water'] },
      { projectName: 'Sai Vandan Complex', wing: 'B Wing', floor: 1, unitNumber: 'B-101', flatType: '2 BHK', carpetArea: 780, builtUpArea: 980, price: 6800000, availability: 'Sold', amenities: ['Power Backup', 'Gym'] },
      { projectName: 'Sai Vandan Complex', wing: 'B Wing', floor: 1, unitNumber: 'B-102', flatType: '3 BHK', carpetArea: 1150, builtUpArea: 1420, price: 9800000, availability: 'Available', amenities: ['Pool', 'Tennis Court'] },
      { projectName: 'Sai Vandan Complex', wing: 'B Wing', floor: 3, unitNumber: 'B-301', flatType: '4 BHK', carpetArea: 1650, builtUpArea: 2100, price: 15500000, availability: 'Reserved', amenities: ['Private Terrace', 'Jacuzzi', 'Clubhouse'] },
      { projectName: 'Sai Vandan Complex', wing: 'C Wing', floor: 3, unitNumber: 'C-301', flatType: '2 BHK', carpetArea: 750, builtUpArea: 940, price: 6400000, availability: 'Available', amenities: ['Garden', 'Security'] },
      { projectName: 'Sai Vandan Complex', wing: 'C Wing', floor: 4, unitNumber: 'C-401', flatType: '3 BHK', carpetArea: 1120, builtUpArea: 1400, price: 9600000, availability: 'Sold', amenities: ['Power Backup', 'Gym'] }
    ];

    const properties = await Property.create(propertyData);
    console.log('✓ Properties created');

    // 3. Leads
    const leads = await Lead.create([
      { name: 'Mrs. Snehal Kulkarni', mobile: '+91 98220 11223', email: 'snehal.kulkarni@example.com', city: 'Pune', budget: 9500000, configuration: '3 BHK', source: 'Walk-in', salesExecutive: 'Rajesh Sharma', status: 'Converted' },
      { name: 'Ramesh Patil', mobile: '+91 98901 22334', email: 'ramesh.patil@gmail.com', city: 'Pune', budget: 6500000, configuration: '2 BHK', source: 'Website', salesExecutive: 'Rajesh Sharma', status: 'Qualified' },
      { name: 'Priya Sharma', mobile: '+91 98902 33445', email: 'priya.s@yahoo.com', city: 'Mumbai', budget: 15500000, configuration: '4 BHK', source: 'Google Ads', salesExecutive: 'Rajesh Sharma', status: 'Contacted' },
      { name: 'Amit Shinde', mobile: '+91 98903 44556', email: 'shinde.amit@outlook.com', city: 'Pune', budget: 4500000, configuration: '1 BHK', source: 'Facebook', salesExecutive: 'Rajesh Sharma', status: 'New Lead' },
      { name: 'Rahul Verma', mobile: '+91 98904 55667', email: 'verma.rahul@gmail.com', city: 'Pimpri-Chinchwad', budget: 6800000, configuration: '2 BHK', source: 'WhatsApp', salesExecutive: 'Rajesh Sharma', status: 'Qualified' },
      { name: 'Neha Mehta', mobile: '+91 98905 66778', email: 'neha.m@techcorp.com', city: 'Pune', budget: 9800000, configuration: '3 BHK', source: 'Property Portal', salesExecutive: 'Rajesh Sharma', status: 'Contacted' }
    ]);
    console.log('✓ Leads created');

    // 4. Lead Qualifications
    await LeadQualification.create([
      { leadId: leads[0]._id, budget: 9500000, loanRequired: true, preferredLocation: 'A Wing, Higher Floor', flatType: '3 BHK', purchaseTimeline: 'Immediate', purchaseIntent: 'Self Use', remarks: 'High intent buyer, approved HDFC loan.' },
      { leadId: leads[1]._id, budget: 6500000, loanRequired: true, preferredLocation: 'B Wing', flatType: '2 BHK', purchaseTimeline: '1 Month', purchaseIntent: 'Self Use', remarks: 'Looking for 2 BHK near Baner road.' },
      { leadId: leads[4]._id, budget: 6800000, loanRequired: false, preferredLocation: 'C Wing', flatType: '2 BHK', purchaseTimeline: 'Immediate', purchaseIntent: 'Investment', remarks: 'Ready cash buyer.' }
    ]);

    // 5. Follow-ups
    await FollowUp.create([
      { leadId: leads[1]._id, type: 'Phone Call', date: new Date(), time: '11:00 AM', remarks: 'Discussed pricing and payment plan. Requested site visit.', nextFollowUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), executiveName: 'Rajesh Sharma', status: 'Pending' },
      { leadId: leads[2]._id, type: 'WhatsApp', date: new Date(), time: '02:30 PM', remarks: 'Sent e-brochure and floor plans for 4 BHK B-301.', nextFollowUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), executiveName: 'Rajesh Sharma', status: 'Pending' },
      { leadId: leads[5]._id, type: 'Meeting', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), time: '04:00 PM', remarks: 'Met at Baner sales office. Explained amenities.', nextFollowUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), executiveName: 'Rajesh Sharma', status: 'Completed' }
    ]);

    // 6. Site Visits
    await SiteVisit.create([
      { leadId: leads[1]._id, customerName: 'Ramesh Patil', mobile: '+91 98901 22334', visitDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), visitTime: '11:30 AM', pickupRequired: true, executive: 'Rajesh Sharma', propertyUnit: 'A-202', status: 'Scheduled', feedback: 'Wants pickup from Baner phata.' },
      { leadId: leads[0]._id, customerName: 'Mrs. Snehal Kulkarni', mobile: '+91 98220 11223', visitDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), visitTime: '03:00 PM', pickupRequired: false, executive: 'Rajesh Sharma', propertyUnit: 'A-101', status: 'Visited', feedback: 'Very satisfied with A-101 layout.' }
    ]);

    // 7. Bookings
    const booking1 = await Booking.create({
      customerName: 'Mrs. Snehal Kulkarni',
      mobile: '+91 98220 11223',
      email: 'snehal.kulkarni@example.com',
      propertyId: properties[0]._id, // A-101
      unitNumber: 'A-101',
      wing: 'A Wing',
      floor: 1,
      flatType: '2 BHK',
      bookingAmount: 500000,
      bookingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      finalPrice: 6500000,
      salesExecutive: 'Rajesh Sharma',
      status: 'Confirmed'
    });

    const booking2 = await Booking.create({
      customerName: 'Rahul Verma',
      mobile: '+91 98904 55667',
      email: 'verma.rahul@gmail.com',
      propertyId: properties[4]._id, // B-101
      unitNumber: 'B-101',
      wing: 'B Wing',
      floor: 1,
      flatType: '2 BHK',
      bookingAmount: 500000,
      bookingDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      finalPrice: 6800000,
      salesExecutive: 'Rajesh Sharma',
      status: 'Confirmed'
    });
    console.log('✓ Bookings created');

    // 8. Documents
    await Document.create([
      {
        customerName: 'Mrs. Snehal Kulkarni',
        bookingId: booking1._id,
        unitNumber: 'A-101',
        overallStatus: 'Verified',
        documents: [
          { docType: 'PAN Card', fileName: 'snehal_pan.pdf', status: 'Verified' },
          { docType: 'Aadhaar Card', fileName: 'snehal_aadhaar.pdf', status: 'Verified' },
          { docType: 'Bank Statement', fileName: 'snehal_bank_statement.pdf', status: 'Verified' }
        ]
      },
      {
        customerName: 'Rahul Verma',
        bookingId: booking2._id,
        unitNumber: 'B-101',
        overallStatus: 'Submitted',
        documents: [
          { docType: 'PAN Card', fileName: 'rahul_pan.pdf', status: 'Verified' },
          { docType: 'Aadhaar Card', fileName: 'rahul_aadhaar.pdf', status: 'Submitted' }
        ]
      }
    ]);

    // 9. Loans
    await Loan.create([
      { customerName: 'Mrs. Snehal Kulkarni', bookingId: booking1._id, unitNumber: 'A-101', bankName: 'HDFC Bank', loanAmount: 5000000, emi: 48500, applicationDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), sanctionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'Approved', remarks: 'Sanction letter issued.' }
    ]);

    // 10. Agreements
    await Agreement.create([
      { customerName: 'Mrs. Snehal Kulkarni', bookingId: booking1._id, unitNumber: 'A-101', agreementDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), agreementAmount: 6500000, stampDuty: 455000, registrationNumber: 'PN-2026-99182', status: 'Agreement Completed', remarks: 'Registered at Haveli Sub-registrar office.' }
    ]);

    // 11. Payments
    await Payment.create([
      { customerName: 'Mrs. Snehal Kulkarni', bookingId: booking1._id, unitNumber: 'A-101', paymentType: 'Booking Amount', amount: 500000, paymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), paymentMode: 'UPI', transactionNumber: 'UPI/991204821', status: 'Paid', remarks: 'Token received.' },
      { customerName: 'Mrs. Snehal Kulkarni', bookingId: booking1._id, unitNumber: 'A-101', paymentType: 'Agreement Payment', amount: 1500000, paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), paymentMode: 'Bank Transfer', transactionNumber: 'HDFCNEFT99128', status: 'Paid', remarks: '20% payment on agreement.' },
      { customerName: 'Mrs. Snehal Kulkarni', bookingId: booking1._id, unitNumber: 'A-101', paymentType: 'Slab Payment', amount: 2500000, paymentDate: new Date(), dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), paymentMode: 'Bank Transfer', transactionNumber: 'PENDING', status: 'Pending', remarks: '4th floor slab completion milestone.' },
      { customerName: 'Rahul Verma', bookingId: booking2._id, unitNumber: 'B-101', paymentType: 'Booking Amount', amount: 500000, paymentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), paymentMode: 'Cheque', transactionNumber: 'CHQ-882019', status: 'Paid', remarks: 'Cheque cleared.' }
    ]);

    // 12. Possession
    await Possession.create([
      { customerName: 'Mrs. Snehal Kulkarni', bookingId: booking1._id, unitNumber: 'A-101', finalInspection: true, utilityConnection: true, keyHandover: false, possessionLetter: false, status: 'Ready', remarks: 'Unit ready for key handover ceremony.' }
    ]);

    // 13. Support Tickets
    await SupportTicket.create([
      { customerName: 'Mrs. Snehal Kulkarni', mobile: '+91 98220 11223', unitNumber: 'A-101', requestType: 'Documentation', description: 'Request copy of Index II document.', assignedEmployee: 'Pooja Kulkarni', priority: 'Medium', status: 'In Progress' }
    ]);

    // 14. Employees
    const employees = await Employee.create([
      { employeeId: 'EMP-101', name: 'Rajesh Sharma', department: 'Sales', designation: 'Senior Sales Executive', mobile: '+91 98221 44556', email: 'sales@saivandan.com', salaryStructure: { basic: 35000, hra: 15000, allowances: 5000, incentives: 12000 }, bankDetails: { accountNo: '50100293819283', ifsc: 'HDFC0000123', bankName: 'HDFC Bank' }, pan: 'ABCDE1234F', aadhaar: '9988-7766-5544' },
      { employeeId: 'EMP-102', name: 'Pooja Kulkarni', department: 'Human Resources', designation: 'HR Executive', mobile: '+91 98222 77889', email: 'hr@saivandan.com', salaryStructure: { basic: 30000, hra: 12000, allowances: 4000, incentives: 0 }, bankDetails: { accountNo: '50100293819284', ifsc: 'ICIC0000456', bankName: 'ICICI Bank' }, pan: 'BCDEF2345G', aadhaar: '8877-6655-4433' },
      { employeeId: 'EMP-103', name: 'Mahesh Joshi', employeeId: 'EMP-103', name: 'Mahesh Joshi', department: 'Finance', designation: 'Chief Accountant', mobile: '+91 98223 99001', email: 'accounts@saivandan.com', salaryStructure: { basic: 45000, hra: 18000, allowances: 7000, incentives: 0 }, bankDetails: { accountNo: '50100293819285', ifsc: 'SBIN0000789', bankName: 'State Bank of India' }, pan: 'CDEFG3456H', aadhaar: '7766-5544-3322' }
    ]);

    // 15. Attendance & Payroll
    await Attendance.create([
      { employeeId: 'EMP-101', employeeName: 'Rajesh Sharma', date: new Date(), checkIn: '09:30 AM', checkOut: '06:30 PM', status: 'Present' },
      { employeeId: 'EMP-102', employeeName: 'Pooja Kulkarni', date: new Date(), checkIn: '09:45 AM', checkOut: '06:15 PM', status: 'Present' },
      { employeeId: 'EMP-103', employeeName: 'Mahesh Joshi', date: new Date(), checkIn: '09:15 AM', checkOut: '07:00 PM', status: 'Present' }
    ]);

    await Payroll.create([
      { employeeId: 'EMP-101', employeeName: 'Rajesh Sharma', salaryMonth: 'September 2026', basic: 35000, hra: 15000, incentives: 12000, pf: 1800, esic: 450, professionalTax: 200, grossSalary: 62000, totalDeductions: 2450, netSalary: 59550, paymentStatus: 'Paid' },
      { employeeId: 'EMP-102', employeeName: 'Pooja Kulkarni', salaryMonth: 'September 2026', basic: 30000, hra: 12000, incentives: 0, pf: 1800, esic: 400, professionalTax: 200, grossSalary: 42000, totalDeductions: 2400, netSalary: 39600, paymentStatus: 'Paid' }
    ]);

    // 16. Vendors & Bills
    const vendor1 = await Vendor.create({
      vendorName: 'UltraTech Cement Supplier',
      companyName: 'UltraTech Building Solutions Ltd',
      category: 'Material Supplier',
      gstNumber: '27AAAAA0000A1Z5',
      panNumber: 'AAAAA0000A',
      contactPerson: 'Sanjay Deshmukh',
      mobile: '+91 98900 11223',
      email: 'orders@ultratechpune.com',
      address: 'Plot 45, MIDC Bhosari, Pune',
      bankDetails: { accountNo: '991823901923', ifsc: 'HDFC0000999', bankName: 'HDFC Bank' }
    });

    const vendor2 = await Vendor.create({
      vendorName: 'Apex Electricals & Elevators',
      companyName: 'Apex Engineering Works',
      category: 'Electrical Contractor',
      gstNumber: '27BBBBB1111B1Z6',
      panNumber: 'BBBBB1111B',
      contactPerson: 'Karan Malhotra',
      mobile: '+91 98900 44556',
      email: 'karan@apexelectricals.com',
      address: 'Baner High Street, Pune',
      bankDetails: { accountNo: '881290381023', ifsc: 'ICIC0000888', bankName: 'ICICI Bank' }
    });

    await VendorBill.create([
      { vendorId: vendor1._id, vendorName: 'UltraTech Cement Supplier', invoiceNumber: 'UT-2026-441', invoiceDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), billAmount: 450000, gst: 81000, dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), paidAmount: 200000, balanceAmount: 250000, status: 'Partially Paid' },
      { vendorId: vendor2._id, vendorName: 'Apex Electricals & Elevators', invoiceNumber: 'APEX-9921', invoiceDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), billAmount: 320000, gst: 57600, dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), paidAmount: 0, balanceAmount: 320000, status: 'Pending' }
    ]);

    // 17. Petty Cash
    await PettyCash.create([
      { voucherNumber: 'PCV-0001', type: 'Expense', category: 'Tea & Snacks', description: 'Client meeting refreshments for Mrs. Snehal Kulkarni visit', employeeName: 'Rajesh Sharma', amount: 1200, paymentMode: 'Cash' },
      { voucherNumber: 'PCV-0002', type: 'Expense', category: 'Fuel', description: 'Site visit pickup fuel expense', employeeName: 'Anil Patil', amount: 2500, paymentMode: 'UPI' },
      { voucherNumber: 'PCV-0003', type: 'Received', category: 'Cash Refill', description: 'Monthly petty cash replenishment from main bank account', employeeName: 'Mahesh Joshi', amount: 25000, paymentMode: 'Bank Transfer' }
    ]);

    // 18. Notifications
    await Notification.create([
      { title: 'Welcome to Sai Vandan CRM', message: 'System setup completed for Sai Vandan Complex. Logged in as Admin.', type: 'General', isRead: false },
      { title: 'Follow-up Reminder', message: 'Follow-up scheduled with Ramesh Patil today at 11:00 AM.', type: 'FollowUp', isRead: false },
      { title: 'Payment Due Alert', message: 'Slab payment of ₹25,00,000 due for Unit A-101 in 15 days.', type: 'Payment', isRead: false }
    ]);

    console.log('✓ Master Seed Completed Successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;

if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(() => {
    seedData().then(() => mongoose.connection.close());
  });
}
