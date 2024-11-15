let express = require('express');
let router = express.Router();

const vtigerController = require('../../controllers/vtigerController');

router.get('/getAllCustomers', vtigerController.getAllCustomers);
router.post('/getOneCustomer', vtigerController.getOneCustomer);
router.get('/getAllContacts', vtigerController.getAllContacts);
router.post('/getOneContact', vtigerController.getOneContact);
router.get('/getAllQuotes', vtigerController.getAllQuotes);

module.exports = router;