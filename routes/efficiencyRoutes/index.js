let express = require('express');
let router = express.Router();

const efficiencyController = require('../../controllers/efficiencyController');

router.post('/getSingleJob', efficiencyController.getSingleJob);
router.post('/getJobRange', efficiencyController.getJobRange);
router.get('/getLastTwenty', efficiencyController.getLastTwenty);

module.exports = router;