let express = require('express');
let router = express.Router();

const sawController = require('../../controllers/sawController');

router.get('/getTBRJobs', sawController.getTBRJobs);
router.get('/getFRJobs', sawController.getFRJobs);

module.exports = router;