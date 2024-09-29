const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    ticketNumber: {
        type: String,
        required: true
    },
    citizenID: {
        type: String,
        required: true
    },
    driverName: {
        type: String,
        required: true
    },
    licenseID: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    carType: {
        type: String,
        required: true
      },
      licensePlateID: {
        type: String,
        required: true
    },
      issueType: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
      },
    status: {
        type: String,
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    cancelDescript: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Ticket", TicketSchema);
