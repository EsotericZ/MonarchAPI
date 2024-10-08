let express = require('express');
let router = express.Router();

const formingController = require('../../controllers/formingController');

router.get('/getAllJobs', formingController.getAllJobs);
router.post('/updateJob', formingController.updateJob);
router.post('/updateFormProgrammer', formingController.updateFormProgrammer);
router.post('/updateFormStatus', formingController.updateFormStatus);

module.exports = router;