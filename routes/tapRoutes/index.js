let express = require('express');
let router = express.Router();

const tapController = require('../../controllers/tapController');

router.get('/getStandardTaps', tapController.getStandardTaps);
router.get('/getMetricTaps', tapController.getMetricTaps);
router.post('/createTap', tapController.createTap);
router.post('/updateTap', tapController.updateTap);

module.exports = router;