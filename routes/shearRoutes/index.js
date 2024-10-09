let express = require('express');
let router = express.Router();

const shearController = require('../../controllers/shearController');

router.get('/getTBRJobs', shearController.getTBRJobs);
router.get('/getFRJobs', shearController.getFRJobs);

module.exports = router;