const express = require('express');
const hospitalController = require('@base/controllers/hospitalController');
const authController = require('@base/controllers/authController');
const router = express.Router();

router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);
router.post('/',authController.verifyToken, hospitalController.createHospital);
router.put('/:id', hospitalController.updateHospital);
router.delete('/:id',authController.verifyToken, hospitalController.deleteHospital);
router.get('/:id/history', hospitalController.getHospitalHistory);


module.exports = router;
