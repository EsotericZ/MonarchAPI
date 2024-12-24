let express = require('express');
let router = express.Router();

const maintenanceController = require('../../controllers/maintenanceController');

router.get('/getAllRequests', maintenanceController.getAllRequests);
router.get('/getAllEquipment', maintenanceController.getAllEquipment);
router.get('/getFolder/:folderName', maintenanceController.getFolder);
router.post('/createRequest', maintenanceController.createRequest);
router.post('/updateRequest', maintenanceController.updateRequest);
router.post('/approveRequest', maintenanceController.approveRequest);
router.post('/denyRequest', maintenanceController.denyRequest);
router.post('/deleteRequest', maintenanceController.deleteRequest);
router.post('/holdRequest', maintenanceController.holdRequest);
router.post('/doneRequest', maintenanceController.doneRequest);

module.exports = router;