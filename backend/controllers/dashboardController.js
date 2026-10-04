const Lead = require('../models/Lead');
const FollowUp = require('../models/FollowUp');
const SiteVisit = require('../models/SiteVisit');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Property = require('../models/Property');
const VendorBill = require('../models/VendorBill');
const Payroll = require('../models/Payroll');
const PettyCash = require('../models/PettyCash');

const getDashboardStats = async (req, res) => {
  try {
    // 1. Leads
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New Lead' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });

    // 2. Follow-ups today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const followUpsToday = await FollowUp.countDocuments({
      status: 'Pending',
      nextFollowUpDate: { $gte: startOfDay, $lte: endOfDay }
    });

    // 3. Site Visits & Bookings
    const siteVisitsCount = await SiteVisit.countDocuments();
    const bookingsCount = await Booking.countDocuments({ status: 'Confirmed' });

    // 4. Sales & Payments
    const bookings = await Booking.find({ status: 'Confirmed' });
    const totalSales = bookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0);

    const customerPayments = await Payment.find({});
    const paidPaymentsTotal = customerPayments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingCustomerPayments = customerPayments.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((sum, p) => sum + (p.amount || 0), 0);

    // 5. Vendor Outstanding
    const vendorBills = await VendorBill.find({});
    const vendorOutstanding = vendorBills.reduce((sum, b) => sum + (b.balanceAmount || 0), 0);

    // 6. Employee Salary (Paid/Pending in latest month)
    const payrolls = await Payroll.find({});
    const employeeSalaryTotal = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);

    // 7. Petty Cash Balance
    const pettyEntries = await PettyCash.find({});
    let pettyReceived = 0;
    let pettySpent = 0;
    pettyEntries.forEach(e => {
      if (e.type === 'Received') pettyReceived += e.amount;
      else pettySpent += e.amount;
    });
    const pettyCashBalance = 50000 + pettyReceived - pettySpent;

    // Charts Data
    // A. Leads by Source
    const leadsBySourceGroup = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);
    const leadsBySource = leadsBySourceGroup.map(g => ({ name: g._id || 'Unknown', value: g.count }));

    // B. Property Availability
    const availableProps = await Property.countDocuments({ availability: 'Available' });
    const reservedProps = await Property.countDocuments({ availability: 'Reserved' });
    const soldProps = await Property.countDocuments({ availability: 'Sold' });

    const propertyAvailability = [
      { name: 'Available', value: availableProps, color: '#10B981' },
      { name: 'Reserved', value: reservedProps, color: '#F59E0B' },
      { name: 'Sold', value: soldProps, color: '#EF4444' }
    ];

    // C. Booking Status
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });

    const bookingStatusChart = [
      { name: 'Confirmed', count: confirmedBookings },
      { name: 'Pending', count: pendingBookings },
      { name: 'Cancelled', count: cancelledBookings }
    ];

    // D. Monthly Sales Data (Sample months)
    const monthlySalesChart = [
      { month: 'May', sales: 4500000, bookings: 1 },
      { month: 'Jun', sales: 9000000, bookings: 2 },
      { month: 'Jul', sales: 6500000, bookings: 1 },
      { month: 'Aug', sales: 13500000, bookings: 3 },
      { month: 'Sep', sales: 18000000, bookings: 4 },
      { month: 'Oct', sales: totalSales > 0 ? totalSales : 12000000, bookings: bookingsCount }
    ];

    // E. Payment Collections (Paid vs Pending)
    const paymentCollectionChart = [
      { status: 'Collected', amount: paidPaymentsTotal },
      { status: 'Pending', amount: pendingCustomerPayments }
    ];

    // Feeds
    const recentLeads = await Lead.find({}).sort({ createdAt: -1 }).limit(5);
    const upcomingFollowUps = await FollowUp.find({ status: 'Pending' }).populate('leadId', 'name mobile').sort({ date: 1 }).limit(5);
    const upcomingSiteVisits = await SiteVisit.find({ status: 'Scheduled' }).sort({ visitDate: 1 }).limit(5);
    const recentBookings = await Booking.find({}).sort({ bookingDate: -1 }).limit(5);
    const pendingPaymentsList = await Payment.find({ status: { $in: ['Pending', 'Overdue'] } }).sort({ dueDate: 1 }).limit(5);

    res.json({
      cards: {
        totalLeads,
        newLeads,
        qualifiedLeads,
        followUpsToday,
        siteVisitsCount,
        bookingsCount,
        totalSales,
        pendingCustomerPayments,
        vendorOutstanding,
        employeeSalaryTotal,
        pettyCashBalance
      },
      charts: {
        leadsBySource,
        propertyAvailability,
        bookingStatusChart,
        monthlySalesChart,
        paymentCollectionChart
      },
      feeds: {
        recentLeads,
        upcomingFollowUps,
        upcomingSiteVisits,
        recentBookings,
        pendingPaymentsList
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFinanceStats = async (req, res) => {
  try {
    const customerPayments = await Payment.find({});
    const totalCollected = customerPayments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const customerReceivables = customerPayments.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0);

    const payrolls = await Payroll.find({});
    const employeeSalaryPayments = payrolls.reduce((sum, p) => sum + p.netSalary, 0);

    const vendorBills = await VendorBill.find({});
    const vendorOutstanding = vendorBills.reduce((sum, b) => sum + b.balanceAmount, 0);

    const pettyEntries = await PettyCash.find({});
    let pettyReceived = 0, pettySpent = 0;
    pettyEntries.forEach(e => {
      if (e.type === 'Received') pettyReceived += e.amount;
      else pettySpent += e.amount;
    });
    const pettyCashBalance = 50000 + pettyReceived - pettySpent;

    const dailyExpenses = pettySpent + (vendorBills.reduce((sum, b) => sum + b.paidAmount, 0));

    res.json({
      customerReceivables,
      employeeSalaryPayments,
      vendorOutstanding,
      pettyCashBalance,
      dailyCollection: totalCollected,
      dailyExpenses,
      bankBalance: totalCollected - (employeeSalaryPayments + dailyExpenses),
      profitAndLoss: {
        totalRevenue: totalCollected,
        totalExpenses: employeeSalaryPayments + dailyExpenses,
        netProfit: totalCollected - (employeeSalaryPayments + dailyExpenses)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getFinanceStats };
