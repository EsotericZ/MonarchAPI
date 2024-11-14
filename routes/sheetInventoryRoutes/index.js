let express = require('express');
let router = express.Router();

const sheetInventoryController = require('../../controllers/sheetInventoryController');

router.post('/getALLPOsDate', sheetInventoryController.getAllPOsDate);
router.post('/getALLPOsPO', sheetInventoryController.getAllPOsPO);

module.exports = router;