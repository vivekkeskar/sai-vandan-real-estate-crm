const Lead = require('../models/Lead');
const LeadQualification = require('../models/LeadQualification');
const FollowUp = require('../models/FollowUp');
const SiteVisit = require('../models/SiteVisit');

// @desc Get leads with search & filter
// @route GET /api/leads
const getLeads = async (req, res) => {
  try {
    const { search, status, source, configuration, salesExecutive } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') query.status = status;
    if (source && source !== 'All') query.source = source;
    if (configuration && configuration !== 'All') query.configuration = configuration;
    if (salesExecutive && salesExecutive !== 'All') query.salesExecutive = salesExecutive;

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get lead by ID with details
// @route GET /api/leads/:id
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const qualification = await LeadQualification.findOne({ leadId: lead._id });
    const followUps = await FollowUp.find({ leadId: lead._id }).sort({ date: -1 });
    const siteVisits = await SiteVisit.find({ leadId: lead._id }).sort({ visitDate: -1 });

    res.json({
      lead,
      qualification: qualification || null,
      followUps,
      siteVisits
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create lead with duplicate check
// @route POST /api/leads
const createLead = async (req, res) => {
  try {
    const { name, mobile, email, city, budget, interestedProperty, configuration, source, salesExecutive, status, notes } = req.body;

    // Check duplicate
    const existing = await Lead.findOne({ $or: [{ mobile }, { email: email ? email.toLowerCase() : '___' }] });
    if (existing) {
      return res.status(400).json({ 
        message: `Duplicate lead detected! Lead with mobile ${mobile} or email ${email} already exists for customer '${existing.name}' (${existing.status}).` 
      });
    }

    const lead = await Lead.create({
      name,
      mobile,
      email,
      city: city || 'Pune',
      budget,
      interestedProperty: interestedProperty || 'Sai Vandan Complex',
      configuration,
      source: source || 'Website',
      salesExecutive: salesExecutive || 'Unassigned',
      status: status || 'New Lead',
      notes: notes || ''
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update lead
// @route PUT /api/leads/:id
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    Object.assign(lead, req.body);
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete lead
// @route DELETE /api/leads/:id
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    await Lead.deleteOne({ _id: req.params.id });
    res.json({ message: 'Lead removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Save/Update lead qualification
// @route POST /api/leads/:id/qualification
const saveLeadQualification = async (req, res) => {
  try {
    const leadId = req.params.id;
    let qualification = await LeadQualification.findOne({ leadId });

    if (qualification) {
      Object.assign(qualification, req.body);
      await qualification.save();
    } else {
      qualification = await LeadQualification.create({
        leadId,
        ...req.body
      });
    }

    // Also update lead status to Qualified if specified
    await Lead.findByIdAndUpdate(leadId, { status: 'Qualified' });

    res.json(qualification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  saveLeadQualification
};
