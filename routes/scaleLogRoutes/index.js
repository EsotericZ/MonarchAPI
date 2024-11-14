let express = require('express');
let router = express.Router();

const scaleLogController = require('../../controllers/scaleLogController');

router.get('/getMMScaleLogs', scaleLogController.getMMScaleLogs);
router.post('/addNewScaleLog', scaleLogController.addNewScaleLog);
router.post('/deleteScaleLog', scaleLogController.deleteScaleLog)

module.exports = router;