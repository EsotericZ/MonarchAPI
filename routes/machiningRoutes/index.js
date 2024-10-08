let express = require('express');
let router = express.Router();

const machiningController = require('../../controllers/machiningController');

router.get('/getAllJobs', machiningController.getAllJobs);
router.get('/getTBRJobs', machiningController.getTBRJobs);
router.get('/getFutureJobs', machiningController.getFutureJobs);
router.get('/getRepeatJobs', machiningController.getRepeatJobs);

module.exports = router;