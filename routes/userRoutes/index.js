let express = require('express');
let router = express.Router();

const userController = require('../../controllers/userController');

router.get('/getAllUsers', userController.getAllUsers);
router.post('/getUserPassword', userController.getUserPassword);
router.post('/createUser', userController.createUser);
router.post('/deleteUser', userController.deleteUser);
router.post('/updateUser', userController.updateUser);
router.post('/updateEngineering', userController.updateEngineering);
router.post('/updateMaintenance', userController.updateMaintenance);
router.post('/updateShipping', userController.updateShipping);
router.post('/updateTLaser', userController.updateTLaser);
router.post('/updateQuality', userController.updateQuality);
router.post('/updateForming', userController.updateForming);
router.post('/updateMachining', userController.updateMachining);
router.post('/updateLaser', userController.updateLaser);
router.post('/updateSaw', userController.updateSaw);
router.post('/updatePunch', userController.updatePunch);
router.post('/updateShear', userController.updateShear);
router.post('/updatePurchasing', userController.updatePurchasing);
router.post('/updateBacklog', userController.updateBacklog);

module.exports = router;