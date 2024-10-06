let express = require('express');
let router = express.Router();

const portalController = require('../../controllers/portalController');

router.post('/login', portalController.login);

module.exports = router;