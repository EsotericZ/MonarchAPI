let express = require('express');
let router = express.Router();

const materialController = require('../../controllers/materialController');

router.get('/getAllMaterials', materialController.getAllMaterials);
router.get('/getAllTLMaterials', materialController.getAllTLMaterials);
router.get('/getAllLaserMaterials', materialController.getAllLaserMaterials);
router.get('/getAllSLMaterials', materialController.getAllSLMaterials);
router.get('/getAllFLMaterials', materialController.getAllFLMaterials);
router.get('/getAllSawMaterials', materialController.getAllSawMaterials);
router.get('/getAllShearMaterials', materialController.getAllShearMaterials);
router.get('/getAllPunchMaterials', materialController.getAllPunchMaterials);
router.post('/createMaterial', materialController.createMaterial);
router.post('/updateCheck', materialController.updateCheck);
router.post('/updateComplete', materialController.updateComplete);
router.post('/updateNeed', materialController.updateNeed);
router.post('/updateOnOrder', materialController.updateOnOrder);
router.post('/updateVerified', materialController.updateVerified);
router.post('/updateMaterial', materialController.updateMaterial);
router.post('/updateMaterialsDate', materialController.updateMaterialsDate);

module.exports = router;