const express = require('express');
const router = express.Router();
const CitizenController = require('../controllers/Citizen.controller'); 


router.get('/', CitizenController.getAllCitizens);
router.get('/:id', CitizenController.getCitizenById);
router.post('/new', CitizenController.createCitizen);
router.put('/:id', CitizenController.updateCitizen);
router.delete('/:id', CitizenController.deleteCitizen);

module.exports = router;
