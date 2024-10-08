let express = require('express');
let router = express.Router();

const engineeringRoutes = require('./engineeringRoutes');
const formingRoutes = require('./formingRoutes');
const portalRoutes = require('./portalRoutes');
const qcinfoRoutes = require('./qcinfoRoutes');
const qualityRoutes = require('./qualityRoutes');
const tapRoutes = require('./tapRoutes');
const userRoutes = require('./userRoutes');

router.get('/', function (req, res) {
  res.send('Welcome to the API');
});

router.use('/engineering', engineeringRoutes);
router.use('/forming', formingRoutes);
router.use('/portal', portalRoutes);
router.use('/qcinfo', qcinfoRoutes);
router.use('/quality', qualityRoutes);
router.use('/taps', tapRoutes);
router.use('/users', userRoutes);

module.exports = router;