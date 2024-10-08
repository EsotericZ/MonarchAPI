let express = require('express');
let router = express.Router();

const tlaserController = require('../../controllers/tlaserController');

router.get('/getAllJobs', tlaserController.getAllJobs);
router.get('/getTBRJobs', tlaserController.getTBRJobs);
router.get('/getFRJobs', tlaserController.getFRJobs);
router.post('/updateTLProgrammer', tlaserController.updateTLProgrammer);
router.post('/updateTLStatus', tlaserController.updateTLStatus);

module.exports = router;