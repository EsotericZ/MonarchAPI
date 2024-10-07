let express = require('express');
let router = express.Router();

const qualityController = require('../../controllers/qualityController');

router.post('/updateInspector', qualityController.updateInspector);
router.post('/updateStatus', qualityController.updateStatus);

module.exports = router;