let express = require('express');
let router = express.Router();

const engineeringRoutes = require('./engineeringRoutes');
const portalRoutes = require('./portalRoutes');
const qcinfoRoutes = require('./qcinfoRoutes');
const qualityRoutes = require('./qualityRoutes');
const userRoutes = require('./userRoutes');

router.get('/', function (req, res) {
  res.send('Welcome to the API');
});

router.use('/engineering', engineeringRoutes);
router.use('/portal', portalRoutes);
router.use('/qcinfo', qcinfoRoutes);
router.use('/quality', qualityRoutes);
router.use('/users', userRoutes);

module.exports = router;