let express = require('express');
let router = express.Router();

const backlogController = require('../../controllers/backlogController');

router.get('/getAllJobs', backlogController.getAllJobs);
router.get('/getNextMonthJobs', backlogController.getNextMonthJobs);
router.get('/getFutureJobs', backlogController.getFutureJobs);
router.post('/getAllSubJobs', backlogController.getAllSubJobs);
router.post('/getSingleJob', backlogController.getSingleJob);
router.post('/updateJob', backlogController.updateJob);
router.post('/updateEmail', backlogController.updateEmail);
router.post('/updateHold', backlogController.updateHold);
router.get('/unconfirmed', backlogController.Unconfirmed);
router.get('/test', backlogController.Test);

module.exports = router;