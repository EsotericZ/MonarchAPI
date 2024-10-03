let express = require('express');
let router = express.Router();

const engineeringRoutes = require('./engineeringRoutes');
const qcinfoRoutes = require('./qcinfoRoutes');
const userRoutes = require('./userRoutes');

router.get('/', function (req, res) {
  res.send('Welcome to the API');
});

router.use('/engineering', engineeringRoutes);
router.use('/qcinfo', qcinfoRoutes);
router.use('/users', userRoutes);

module.exports = router;