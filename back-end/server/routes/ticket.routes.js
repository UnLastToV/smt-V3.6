const express = require("express");
const router = express.Router();
const TicketController = require("../controllers/ticket.controller");

router.post("/tickets", TicketController.createTicket);
router.get("/tickets", TicketController.getTickets);
router.put("/tickets/:id", TicketController.updateTicket);
router.delete("/tickets/:id", TicketController.deleteTicket);

module.exports = router;
