let express = require('express');
let router = express.Router();

const qcinfoController = require('../../controllers/qcinfoController');

router.get('/getAllQCNotes', qcinfoController.getAllQCNotes);
router.post('/createQCNote', qcinfoController.createQCNote);
router.post('/updateQCInfo', qcinfoController.updateQCInfo);

module.exports = router;