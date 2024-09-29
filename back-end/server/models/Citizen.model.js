const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CitizenSchema = new Schema({
  citizenID: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthDay: {
    type: String,
    required: true
  },
  Gender: {
    type: String,
    required: true
  },
  licenseID: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
  
});

module.exports = mongoose.model('Citizen', CitizenSchema);