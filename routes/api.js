let express = require('express');
let router = express.Router();

const engineeringRoutes = require('./engineeringRoutes');

router.get('/', function (req, res) {
  res.send('Welcome to the API');
});

router.use('/engineering', engineeringRoutes);

module.exports = router;