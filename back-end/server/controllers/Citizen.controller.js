const Citizen = require('../models/Citizen.model');

// Get all citizens
exports.getAllCitizens = async (req, res) => {
  try {
    const citizens = await Citizen.find();
    res.status(200).json(citizens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get citizen by ID
exports.getCitizenById = async (req, res) => {
  try {
    const citizen = await Citizen.findById(req.params.id);
    if (!citizen) return res.status(404).json({ message: 'Citizen not found' });
    res.status(200).json(citizen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new 
exports.createCitizen = async (req, res) => {
  const citizen = new Citizen({
    citizenID: req.body.citizenID,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDay: req.body.birthDay,
    Gender: req.body.Gender,
    licenseID: req.body.licenseID,
    number: req.body.number,
    details: req.body.details
  });

  try {
    const newCitizen = await citizen.save();
    res.status(201).json(newCitizen);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update
exports.updateCitizen = async (req, res) => {
  try {
    const updatedCitizen = await Citizen.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedCitizen) return res.status(404).json({ message: 'Citizen not found' });
    res.status(200).json(updatedCitizen);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deleteCitizen = async (req, res) => {
  try {
    const citizen = await Citizen.findByIdAndDelete(req.params.id);
    if (!citizen) return res.status(404).json({ message: 'Citizen not found' });
    res.status(200).json({ message: 'Citizen deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
